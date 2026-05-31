"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateCaregiverProfile } from "@/actions/profile"
import { REGIONES_CHILE } from "@/data/chile-regions"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2 } from "lucide-react"
import type { CaregiverProfile } from "@/generated/prisma"

const AVAILABILITY_LABELS: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  PART_TIME: "Medio tiempo",
  SHIFTS_24H: "Turno 24 horas",
}

const schema = z.object({
  profileType: z.enum(["PROFESSIONAL", "EXPERIENCED"], { error: "Selecciona el tipo de perfil" }),
  title: z.string().optional(),
  firstName: z.string({ error: "Este campo es requerido" }).min(2, "Mínimo 2 caracteres"),
  lastName: z.string({ error: "Este campo es requerido" }).min(2, "Mínimo 2 caracteres"),
  phone: z.string({ error: "Este campo es requerido" }).min(8, "Teléfono inválido"),
  bio: z.string({ error: "Este campo es requerido" })
    .min(50, "Cuéntanos un poco más (mínimo 50 caracteres)")
    .max(500, "Máximo 500 caracteres"),
  yearsExperience: z.string({ error: "Este campo es requerido" }).min(1, "Indica los años"),
  availability: z.enum(["FULL_TIME", "PART_TIME", "SHIFTS_24H"], { error: "Selecciona disponibilidad" }),
  region: z.string({ error: "Selecciona una región" }).min(1, "Selecciona una región"),
  comuna: z.string({ error: "Selecciona una comuna" }).min(1, "Selecciona una comuna"),
})

type FormValues = z.infer<typeof schema>

export function ProfileForm({ profile }: { profile: CaregiverProfile }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileType: profile.profileType,
      title: profile.title ?? "",
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      bio: profile.bio,
      yearsExperience: String(profile.yearsExperience),
      availability: profile.availability,
      region: profile.region,
      comuna: profile.comuna,
    },
  })

  const profileType = form.watch("profileType")
  const bio = form.watch("bio") ?? ""
  const selectedRegion = form.watch("region")
  const comunas = REGIONES_CHILE.find((r) => r.nombre === selectedRegion)?.comunas ?? []

  const onSubmit = (data: FormValues) => {
    let clientError = false
    if (!data.availability) {
      form.setError("availability", { message: "Selecciona tu disponibilidad" })
      clientError = true
    }
    if (!data.region) {
      form.setError("region", { message: "Selecciona una región" })
      clientError = true
    }
    if (!data.comuna) {
      form.setError("comuna", { message: "Selecciona una comuna" })
      clientError = true
    }
    if (clientError) return

    setSaved(false)
    setError(null)
    startTransition(async () => {
      try {
        await updateCaregiverProfile({
          profileType: data.profileType,
          title: data.profileType === "PROFESSIONAL" ? data.title : undefined,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          bio: data.bio,
          yearsExperience: parseInt(data.yearsExperience, 10),
          availability: data.availability,
          region: data.region,
          comuna: data.comuna,
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch (e) {
        if (e instanceof Error) setError(e.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Tipo de perfil */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">¿Tienes título formal de salud?</h3>
          </div>
          <FormField control={form.control} name="profileType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup value={field.value} onValueChange={(v) => { field.onChange(v); if (v === "EXPERIENCED") form.setValue("title", "") }} className="flex flex-col gap-3">
                    <label htmlFor="exp" className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5">
                      <RadioGroupItem value="EXPERIENCED" id="exp" className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">No tengo título formal</p>
                        <p className="text-muted-foreground text-sm">Me desempeño por vocación y experiencia práctica</p>
                      </div>
                    </label>
                    <label htmlFor="prof" className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5">
                      <RadioGroupItem value="PROFESSIONAL" id="prof" className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Sí, tengo título de salud</p>
                        <p className="text-muted-foreground text-sm">TENS, Enfermero/a, Técnico en Enfermería u otro</p>
                      </div>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {profileType === "PROFESSIONAL" && (
            <FormField control={form.control} name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cuál es tu título?</FormLabel>
                  <FormControl><Input placeholder="Ej: TENS, Enfermero/a" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </section>

        <Separator />

        {/* Datos personales */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">Tus datos</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel>Apellido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre ti</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" rows={4} {...field} />
                </FormControl>
                <FormDescription className="text-right">{bio.length}/500</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        {/* Disponibilidad */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">Disponibilidad</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="yearsExperience" render={({ field }) => (
              <FormItem>
                <FormLabel>Años de experiencia</FormLabel>
                <FormControl><Input type="number" min={0} max={50} className="max-w-32" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <span className="flex-1 text-left text-sm">{AVAILABILITY_LABELS[field.value]}</span>
                        ) : (
                          <span className="flex-1 text-left text-sm text-muted-foreground">Selecciona</span>
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(AVAILABILITY_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        {/* Zona de servicio */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">¿Dónde ofreces tus servicios?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Región</FormLabel>
                  <Select onValueChange={(v) => { field.onChange(v); form.setValue("comuna", "") }} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <span className="flex-1 text-left text-sm">{field.value}</span>
                        ) : (
                          <span className="flex-1 text-left text-sm text-muted-foreground">Selecciona región</span>
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONES_CHILE.map((r) => <SelectItem key={r.nombre} value={r.nombre}>{r.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRegion}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <span className="flex-1 text-left text-sm">{field.value}</span>
                        ) : (
                          <span className="flex-1 text-left text-sm text-muted-foreground">
                            {selectedRegion ? "Selecciona comuna" : "Primero elige región"}
                          </span>
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {comunas.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2"><Spinner className="h-4 w-4" />Guardando...</span>
            ) : "Guardar cambios"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Guardado
            </span>
          )}
        </div>
      </form>
    </Form>
  )
}

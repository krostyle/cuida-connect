"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createCaregiverProfile } from "@/actions/caregiver"
import { REGIONES_CHILE } from "@/data/chile-regions"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const AVAILABILITY_LABELS: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  PART_TIME: "Medio tiempo",
  SHIFTS_24H: "Turno 24 horas",
}

const schema = z.object({
  profileType: z.enum(["PROFESSIONAL", "EXPERIENCED"]),
  title: z.string().optional(),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().min(8, "Ingresa un teléfono válido"),
  bio: z
    .string()
    .min(50, "Cuéntanos un poco más (mínimo 50 caracteres)")
    .max(500, "Máximo 500 caracteres"),
  yearsExperience: z.string().min(1, "Indica tus años de experiencia"),
  availability: z.enum(["FULL_TIME", "PART_TIME", "SHIFTS_24H"]),
  region: z.string().min(1, "Selecciona una región"),
  comuna: z.string().min(1, "Selecciona una comuna"),
})

type FormValues = z.infer<typeof schema>

interface CaregiverFormProps {
  defaultFirstName?: string
  defaultLastName?: string
}

export function CaregiverForm({ defaultFirstName = "", defaultLastName = "" }: CaregiverFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileType: "EXPERIENCED",
      firstName: defaultFirstName,
      lastName: defaultLastName,
    },
  })

  const profileType = form.watch("profileType")
  const bio = form.watch("bio") ?? ""
  const selectedRegion = form.watch("region")
  const comunas =
    REGIONES_CHILE.find((r) => r.nombre === selectedRegion)?.comunas ?? []

  const onSubmit = (data: FormValues) => {
    setError(null)
    startTransition(async () => {
      try {
        await createCaregiverProfile({
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
      } catch (e) {
        if (e instanceof Error && !e.message.includes("NEXT_REDIRECT")) {
          setError(e.message)
        }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ¿Tienes título formal? */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">
              ¿Tienes título formal de salud?
            </h3>
            <p className="text-muted-foreground text-sm">
              Ambas opciones son bienvenidas en CuidaConnect — la distinción
              ayuda a las familias a encontrar el perfil que necesitan.
            </p>
          </div>

          <FormField
            control={form.control}
            name="profileType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v)
                      if (v === "EXPERIENCED") form.setValue("title", "")
                    }}
                    className="flex flex-col gap-3"
                  >
                    <label
                      htmlFor="experienced"
                      className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="EXPERIENCED" id="experienced" className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">No tengo título formal</p>
                        <p className="text-muted-foreground text-sm">
                          Me desempeño como cuidador por vocación y/o
                          experiencia práctica, sin certificación académica
                        </p>
                      </div>
                    </label>
                    <label
                      htmlFor="professional"
                      className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="PROFESSIONAL" id="professional" className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Sí, tengo título de salud</p>
                        <p className="text-muted-foreground text-sm">
                          TENS, Enfermero/a, Técnico en Enfermería, Terapeuta
                          Ocupacional u otro título del área de la salud
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {profileType === "PROFESSIONAL" && (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cuál es tu título?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: TENS, Enfermero/a, Técnico en Enfermería"
                      {...field}
                    />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Carlos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Rodríguez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+56 9 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre ti</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuéntanos tu experiencia, por qué te dedicas al cuidado de adultos mayores y qué te hace un buen cuidador..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-right">
                  {bio.length}/500
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        {/* Disponibilidad y experiencia */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">Disponibilidad</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Años de experiencia</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3"
                      min={0}
                      max={50}
                      className="max-w-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu disponibilidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(AVAILABILITY_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        {/* Ubicación */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">
              ¿Dónde ofreces tus servicios?
            </h3>
            <p className="text-muted-foreground text-sm">
              Si trabajas en varias comunas, indica la principal. Podrás
              ampliar tu zona de cobertura más adelante.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Región</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v)
                      form.setValue("comuna", "")
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu región" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONES_CHILE.map((r) => (
                        <SelectItem key={r.nombre} value={r.nombre}>
                          {r.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedRegion}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedRegion
                              ? "Selecciona tu comuna"
                              : "Primero elige región"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {comunas.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {error && (
          <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Guardando...
            </span>
          ) : (
            "Crear mi perfil →"
          )}
        </Button>
      </form>
    </Form>
  )
}

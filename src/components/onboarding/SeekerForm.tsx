"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createSeekerProfile } from "@/actions/seeker"
import { REGIONES_CHILE } from "@/data/chile-regions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

const schema = z.object({
  forSelf: z.boolean(),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  phone: z.string().min(8, "Ingresa un teléfono válido"),
  elderFirstName: z.string().optional(),
  elderLastName: z.string().optional(),
  elderAge: z.string().optional(),
  elderCondition: z.string().max(500, "Máximo 500 caracteres").optional(),
  region: z.string().min(1, "Selecciona una región"),
  comuna: z.string().min(1, "Selecciona una comuna"),
})

type FormValues = z.infer<typeof schema>

interface SeekerFormProps {
  defaultFirstName?: string
  defaultLastName?: string
}

export function SeekerForm({ defaultFirstName = "", defaultLastName = "" }: SeekerFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      forSelf: true,
      firstName: defaultFirstName,
      lastName: defaultLastName,
    },
  })

  const forSelf = form.watch("forSelf")
  const selectedRegion = form.watch("region")
  const comunas =
    REGIONES_CHILE.find((r) => r.nombre === selectedRegion)?.comunas ?? []

  const onSubmit = (data: FormValues) => {
    setError(null)
    startTransition(async () => {
      try {
        await createSeekerProfile({
          forSelf: data.forSelf,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          elderFirstName: data.forSelf ? undefined : data.elderFirstName,
          elderLastName: data.forSelf ? undefined : data.elderLastName,
          elderAge:
            !data.forSelf && data.elderAge
              ? parseInt(data.elderAge, 10)
              : undefined,
          elderCondition: data.forSelf ? undefined : data.elderCondition,
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
        {/* ¿Para quién? */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">¿El cuidado es para ti?</h3>
          <FormField
            control={form.control}
            name="forSelf"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value ? "self" : "other"}
                    onValueChange={(v) => {
                      field.onChange(v === "self")
                      if (v === "self") {
                        form.setValue("elderFirstName", "")
                        form.setValue("elderLastName", "")
                        form.setValue("elderAge", "")
                        form.setValue("elderCondition", "")
                      }
                    }}
                    className="flex flex-col gap-3"
                  >
                    <label
                      htmlFor="for-self"
                      className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="self" id="for-self" />
                      <div>
                        <p className="font-medium">Para mí mismo/a</p>
                        <p className="text-muted-foreground text-sm">
                          Soy quien necesita el cuidado
                        </p>
                      </div>
                    </label>
                    <label
                      htmlFor="for-other"
                      className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:border-primary/50 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                    >
                      <RadioGroupItem value="other" id="for-other" />
                      <div>
                        <p className="font-medium">Para otra persona</p>
                        <p className="text-muted-foreground text-sm">
                          Gestiono el cuidado de un familiar
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Datos del adulto mayor (condicional) */}
        {!forSelf && (
          <>
            <Separator />
            <section className="space-y-4">
              <h3 className="font-semibold text-base">
                Datos del adulto mayor
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="elderFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="elderLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="elderAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="75"
                        min={18}
                        max={120}
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
                name="elderCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Condición o necesidades especiales{" "}
                      <span className="text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe condiciones médicas, movilidad, rutinas o cualquier información que ayude al cuidador..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </>
        )}

        <Separator />

        {/* Tus datos */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">Tus datos de contacto</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="María" {...field} />
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
                  <FormLabel>Tu apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="González" {...field} />
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
                  <Input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        {/* Ubicación */}
        <section className="space-y-4">
          <h3 className="font-semibold text-base">Ubicación</h3>
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
            "Buscar cuidadores →"
          )}
        </Button>
      </form>
    </Form>
  )
}

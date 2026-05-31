import { z } from "zod"

z.setErrorMap((issue) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: "Este campo es requerido" }

    case z.ZodIssueCode.too_small: {
      const iss = issue as { minimum: number; origin: string }
      if (iss.origin === "string") {
        return iss.minimum <= 1
          ? { message: "Este campo es requerido" }
          : { message: `Mínimo ${iss.minimum} caracteres` }
      }
      if (iss.origin === "number") {
        return { message: `El valor mínimo es ${iss.minimum}` }
      }
      return { message: `Mínimo ${iss.minimum}` }
    }

    case z.ZodIssueCode.too_big: {
      const iss = issue as { maximum: number; origin: string }
      if (iss.origin === "string") return { message: `Máximo ${iss.maximum} caracteres` }
      return { message: `Máximo ${iss.maximum}` }
    }

    case z.ZodIssueCode.invalid_value:
      return { message: "Selecciona una opción válida" }

    case z.ZodIssueCode.invalid_format:
      return { message: "Formato no válido" }

    case z.ZodIssueCode.custom:
      return { message: issue.message ?? "Valor no válido" }

    default:
      return { message: "Valor no válido" }
  }
})

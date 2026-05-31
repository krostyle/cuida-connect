import { z } from "zod"

z.setErrorMap((issue) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      return { message: "Este campo es requerido" }

    case z.ZodIssueCode.too_small: {
      const min = (issue as { minimum: number }).minimum
      if (issue.type === "string") {
        return min <= 1
          ? { message: "Este campo es requerido" }
          : { message: `Mínimo ${min} caracteres` }
      }
      if (issue.type === "number") {
        return { message: `El valor mínimo es ${min}` }
      }
      return { message: `Mínimo ${min}` }
    }

    case z.ZodIssueCode.too_big: {
      const max = (issue as { maximum: number }).maximum
      if (issue.type === "string") return { message: `Máximo ${max} caracteres` }
      return { message: `Máximo ${max}` }
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

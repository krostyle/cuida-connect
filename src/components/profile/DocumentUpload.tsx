"use client"

import { useRef, useState, useTransition } from "react"
import { Upload, FileText, Image as ImageIcon, Trash2, ExternalLink } from "lucide-react"
import { uploadCaregiverDocument, deleteCaregiverDocument } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import type { CaregiverDocument } from "@/generated/prisma"

const DOC_TYPES = [
  { value: "TITLE", label: "Título profesional" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "COURSE", label: "Curso" },
  { value: "CERTIFICATE", label: "Certificado" },
  { value: "OTHER", label: "Otro" },
]

interface DocumentUploadProps {
  documents: CaregiverDocument[]
}

export function DocumentUpload({ documents }: DocumentUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [docType, setDocType] = useState("TITLE")
  const [docName, setDocName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [uploadPending, startUpload] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const file = fileRef.current?.files?.[0]
    if (!file) { setError("Selecciona un archivo"); return }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("docType", docType)
    formData.append("name", docName.trim() || "")

    startUpload(async () => {
      try {
        await uploadCaregiverDocument(formData)
        if (fileRef.current) fileRef.current.value = ""
        setDocName("")
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startUpload(async () => {
      try {
        await deleteCaregiverDocument(id)
      } finally {
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Lista de documentos existentes */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              {doc.fileType === "pdf" ? (
                <FileText className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <ImageIcon className="w-5 h-5 text-primary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {DOC_TYPES.find((t) => t.value === doc.docType)?.label}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-muted transition-colors"
                  title="Ver documento"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                  title="Eliminar"
                >
                  {deletingId === doc.id ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-destructive" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {documents.length > 0 && <Separator />}

      {/* Formulario de subida */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de documento</Label>
            <Select value={docType} onValueChange={(v) => v && setDocType(v)}>
              <SelectTrigger>
                {docType ? (
                  <span className="flex-1 text-left text-sm">
                    {DOC_TYPES.find((t) => t.value === docType)?.label}
                  </span>
                ) : (
                  <span className="flex-1 text-left text-sm text-muted-foreground">
                    Selecciona tipo
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Nombre{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              placeholder="Ej: TENS Universidad de Chile 2019"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Archivo</Label>
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                PDF, JPG, PNG o WEBP — máx. 10 MB
              </span>
              <input
                ref={fileRef}
                type="file"
                name="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="sr-only"
              />
            </label>
            <Button type="submit" size="sm" disabled={uploadPending}>
              {uploadPending ? (
                <span className="flex items-center gap-1.5">
                  <Spinner className="w-3.5 h-3.5" />
                  Subiendo...
                </span>
              ) : (
                "Subir"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>
    </div>
  )
}

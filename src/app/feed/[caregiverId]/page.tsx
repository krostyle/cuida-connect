export default async function CaregiverProfilePage({
  params,
}: {
  params: Promise<{ caregiverId: string }>
}) {
  const { caregiverId } = await params
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Perfil del cuidador</h1>
      <p className="text-muted-foreground">ID: {caregiverId}</p>
      {/* Implementado en módulo: Feed */}
    </main>
  )
}

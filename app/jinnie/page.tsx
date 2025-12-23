import { JinnieChat } from "@/components/jinnie/jinnie-chat"

export const dynamic = "force-dynamic"

export default function JinniePage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Jinnie (지니)</h1>
        <p className="mt-2 text-muted-foreground">
          24/7 concierge beta. Ask about buying a car in Korea, registration steps, insurance basics, and recommended models.
        </p>
      </div>

      <JinnieChat />
    </div>
  )
}

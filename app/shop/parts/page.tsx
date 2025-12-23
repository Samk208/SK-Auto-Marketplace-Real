import { redirect } from "next/navigation"

export default async function ShopPartsRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(resolvedSearchParams ?? {})) {
    if (typeof value === "string") {
      params.set(key, value)
    } else if (Array.isArray(value)) {
      for (const v of value) params.append(key, v)
    }
  }

  const qs = params.toString()
  redirect(qs ? `/parts?${qs}` : "/parts")
}

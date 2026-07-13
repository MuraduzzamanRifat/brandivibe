import 'server-only'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { clientIdOf, roleOf, type Role } from '@/access/roles'

export type PortalUser = {
  id: string
  name: string
  email: string
  role: Role
  title?: string
  clientId: string | null
}

/**
 * Resolves the logged-in user from the Payload session cookie inside a server
 * component or route. Returns null when nobody is signed in.
 *
 * The portal is a Next frontend sitting on the SAME Payload auth as the admin —
 * one login, one cookie. This reads that cookie server-side so a client's
 * projects are fetched with their own permissions, never with overrideAccess.
 */
export async function getPortalUser(): Promise<PortalUser | null> {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await nextHeaders() })
    if (!user) return null
    return {
      id: String(user.id),
      name: String((user as { name?: string }).name ?? ''),
      email: String((user as { email?: string }).email ?? ''),
      role: (roleOf(user as never) ?? 'client') as Role,
      title: (user as { title?: string }).title,
      clientId: clientIdOf(user as never),
    }
  } catch {
    return null
  }
}

import type { Access, FieldAccess, Where } from 'payload'

/**
 * Access-control primitives for the whole platform.
 *
 * Three roles live on the Users collection:
 *   admin   — the studio; full control of everything
 *   editor  — studio staff; content + operations, but not user/role management
 *   client  — a customer with a login to their own portal, and NOTHING else
 *
 * The rule that matters most: a `client` must only ever see rows that belong to
 * their own company. That is enforced here by returning a Payload `Where`
 * filter (not just a boolean), so the constraint is applied at the query layer
 * and cannot be bypassed by guessing an ID. A boolean `true` would hand a
 * client every project in the database.
 */

export type Role = 'admin' | 'editor' | 'client'

// Loose on purpose: Payload hands us its generated user type (many fields).
// We only read `role` and `client`, so accept any record.
type MaybeUser = Record<string, unknown> | null | undefined

export function roleOf(user: MaybeUser): Role | null {
  const r = user?.role
  return r === 'admin' || r === 'editor' || r === 'client' ? r : null
}

/** The company id a client-user is scoped to (their portal account). */
export function clientIdOf(user: MaybeUser): string | null {
  const c = user?.client
  if (!c) return null
  if (typeof c === 'object') return String((c as { id?: unknown }).id ?? '') || null
  return String(c)
}

// ---- collection-level Access (boolean or Where) ---------------------------

export const isSignedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

export const isStaff: Access = ({ req: { user } }) => {
  const r = roleOf(user)
  return r === 'admin' || r === 'editor'
}

/**
 * Staff see everything; a client sees only rows whose `client` relationship is
 * their own company. Use on every portal collection that has a `client` field.
 */
export const staffOrOwnClient: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isStaffUser(user)) return true
  const cid = clientIdOf(user)
  if (!cid) return false
  return { client: { equals: cid } }
}

/** Same, for a collection whose ownership is via `project.client` (one hop). */
export const staffOrOwnViaProject =
  (projectField = 'project'): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (isStaffUser(user)) return true
    const cid = clientIdOf(user)
    if (!cid) return false
    // Payload resolves the dotted path against the related Project's client.
    return { [`${projectField}.client`]: { equals: cid } } as never
  }

// ---- field-level access ----------------------------------------------------

/** A field only staff may edit (clients can read but never change). */
export const staffOnlyField: FieldAccess = ({ req: { user } }) => isStaffUser(user)

/** A field only admins may edit (e.g. role). */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

// ---- internal --------------------------------------------------------------

function isStaffUser(user: MaybeUser): boolean {
  const r = roleOf(user)
  return r === 'admin' || r === 'editor'
}

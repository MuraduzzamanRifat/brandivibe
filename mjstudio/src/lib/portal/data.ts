import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Portal data access. Every query runs with the signed-in user's permissions
 * (user is passed to payload.find), so a client can only ever receive their own
 * rows — the access rules on each collection do the filtering, not this file.
 */

type ReqUser = { id: string } & Record<string, unknown>

async function pl() {
  return getPayload({ config })
}

export type ProjectCard = {
  id: string
  name: string
  summary: string
  status: string
  completionPercent: number
  derivedPercent: number
  targetDate: string | null
  cover: string | null
}

/** Projects the user is allowed to see, each with a task-derived progress %. */
export async function getMyProjects(user: ReqUser): Promise<ProjectCard[]> {
  const payload = await pl()
  const res = await payload.find({
    collection: 'projects',
    limit: 100,
    depth: 1,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
  })
  const cards = await Promise.all(
    res.docs.map(async (d) => {
      const doc = d as Record<string, unknown>
      const derived = await taskProgress(String(doc.id), user)
      const cover = doc.cover as { url?: string } | undefined
      return {
        id: String(doc.id),
        name: String(doc.name ?? ''),
        summary: String(doc.summary ?? ''),
        status: String(doc.status ?? ''),
        completionPercent: Number(doc.completionPercent ?? 0),
        derivedPercent: derived,
        targetDate: (doc.targetDate as string) ?? null,
        cover: cover?.url ?? null,
      }
    }),
  )
  return cards
}

/** Live progress from client-visible tasks (done ÷ total). 0 when none. */
async function taskProgress(projectId: string, user: ReqUser): Promise<number> {
  const payload = await pl()
  const tasks = await payload.find({
    collection: 'project-tasks',
    where: { and: [{ project: { equals: projectId } }, { clientVisible: { equals: true } }] },
    limit: 1000,
    depth: 0,
    user,
    overrideAccess: false,
  })
  const total = tasks.docs.length
  if (!total) return 0
  const done = tasks.docs.filter((t) => (t as { status?: string }).status === 'done').length
  return Math.round((done / total) * 100)
}

export type FullProject = {
  project: Record<string, unknown> | null
  milestones: Record<string, unknown>[]
  tasks: Record<string, unknown>[]
  files: Record<string, unknown>[]
  invoices: Record<string, unknown>[]
  messages: Record<string, unknown>[]
  approvals: Record<string, unknown>[]
  derivedPercent: number
}

/** Everything for one project page — fetched with the user's own permissions. */
export async function getProjectBundle(projectId: string, user: ReqUser): Promise<FullProject> {
  const payload = await pl()
  const opts = { user, overrideAccess: false as const, depth: 1 }

  const project = await payload
    .findByID({ collection: 'projects', id: projectId, ...opts })
    .catch(() => null)

  if (!project) {
    return { project: null, milestones: [], tasks: [], files: [], invoices: [], messages: [], approvals: [], derivedPercent: 0 }
  }

  const where = { project: { equals: projectId } }
  const [milestones, tasks, files, messages, approvals, invoices] = await Promise.all([
    payload.find({ collection: 'milestones', where, sort: 'order', limit: 100, ...opts }),
    payload.find({ collection: 'project-tasks', where: { and: [where, { clientVisible: { equals: true } }] }, sort: 'order', limit: 500, ...opts }),
    payload.find({ collection: 'project-files', where, sort: '-createdAt', limit: 200, ...opts }),
    payload.find({ collection: 'project-messages', where, sort: 'createdAt', limit: 500, ...opts }),
    payload.find({ collection: 'approvals', where, sort: '-createdAt', limit: 100, ...opts }),
    payload.find({ collection: 'invoices', where, sort: '-issueDate', limit: 100, ...opts }),
  ])

  const total = tasks.docs.length
  const done = tasks.docs.filter((t) => (t as { status?: string }).status === 'done').length
  const derivedPercent = total ? Math.round((done / total) * 100) : 0

  return {
    project: project as Record<string, unknown>,
    milestones: milestones.docs as Record<string, unknown>[],
    tasks: tasks.docs as Record<string, unknown>[],
    files: files.docs as Record<string, unknown>[],
    invoices: invoices.docs as Record<string, unknown>[],
    messages: messages.docs as Record<string, unknown>[],
    approvals: approvals.docs as Record<string, unknown>[],
    derivedPercent,
  }
}

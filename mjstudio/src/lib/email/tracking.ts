import 'server-only'
import crypto from 'crypto'

/**
 * Signed, self-describing tracking tokens.
 *
 * Instead of pre-creating an event row per recipient (millions of rows before a
 * single open), each pixel/link carries a token that IS the data: campaign id +
 * subscriber id, signed with PAYLOAD_SECRET. On a hit we verify the signature
 * and write the event then. A forged or tampered token fails the HMAC check and
 * is ignored, so nobody can inflate stats by curling the endpoint.
 */

const SECRET = process.env.PAYLOAD_SECRET || 'dev-only-insecure-secret'

export type Track = { c: string; s: string } // campaign, subscriber

export function signTrack(t: Track): string {
  const payload = Buffer.from(JSON.stringify(t)).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url').slice(0, 16)
  return `${payload}.${sig}`
}

export function verifyTrack(token: string): Track | null {
  const [payload, sig] = String(token).split('.')
  if (!payload || !sig) return null
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url').slice(0, 16)
  // timing-safe compare
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null
  }
  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (obj && typeof obj.c === 'string' && typeof obj.s === 'string') return obj
  } catch {
    /* fallthrough */
  }
  return null
}

const SITE = 'https://brandivibe.com'

export const openPixelUrl = (t: Track) => `${SITE}/e/open?t=${encodeURIComponent(signTrack(t))}`
export const clickUrl = (t: Track, dest: string) =>
  `${SITE}/e/click?t=${encodeURIComponent(signTrack(t))}&u=${encodeURIComponent(dest)}`
export const unsubscribeUrl = (unsubToken: string) =>
  `${SITE}/e/unsubscribe?t=${encodeURIComponent(unsubToken)}`

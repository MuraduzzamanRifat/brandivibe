/**
 * Browser-safe validators. Kept separate from brain-storage.ts so client
 * components can reuse the email regex without pulling Node-only modules
 * (fs/promises, path, github-storage) into the browser bundle.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

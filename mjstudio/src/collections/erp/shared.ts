import type { Option } from 'payload'

/** One currency list shared across every ERP + finance collection. */
export const CURRENCY_OPTIONS: Option[] = ['USD', 'EUR', 'GBP', 'BDT', 'AUD', 'CAD'].map((c) => ({
  label: c,
  value: c,
}))

/** Sum of quantity × unitPrice over an array of line items. */
export function sumLineItems(items: { quantity?: number; unitPrice?: number }[] | undefined): number {
  return (items ?? []).reduce((sum, li) => sum + (li.quantity ?? 0) * (li.unitPrice ?? 0), 0)
}

/** Sum of hours × rate over an array of effort lines. */
export function sumEffort(items: { hours?: number; rate?: number }[] | undefined): number {
  return (items ?? []).reduce((sum, li) => sum + (li.hours ?? 0) * (li.rate ?? 0), 0)
}

/** Formats an integer number of cents as dollars, e.g. 1999 -> "$19.99". */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export interface Coupon {
  code: string;
  kind: "fixed";
  /** Amount taken off the subtotal, in cents. */
  amountCents: number;
  /** The coupon stops working at this moment. */
  expiresAt?: Date;
  /** The subtotal must be at least this much for the coupon to apply. */
  minSubtotalCents?: number;
}

export function isActive(coupon: Coupon, now: Date): boolean {
  return !coupon.expiresAt || now < coupon.expiresAt;
}

/**
 * How many cents the coupon takes off this subtotal.
 * Never more than the subtotal, so a total can't go negative.
 */
export function discountFor(coupon: Coupon, subtotalCents: number, now: Date): number {
  if (!isActive(coupon, now)) return 0;
  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) return 0;
  return Math.min(coupon.amountCents, subtotalCents);
}

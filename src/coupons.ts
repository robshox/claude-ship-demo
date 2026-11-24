import { formatCents } from "./money.ts";

interface CouponBase {
  code: string;
  /** The coupon stops working at this moment. */
  expiresAt?: Date;
  /** The subtotal must be at least this much for the coupon to apply. */
  minSubtotalCents?: number;
}

export interface FixedCoupon extends CouponBase {
  kind: "fixed";
  /** Amount taken off the subtotal, in cents. */
  amountCents: number;
}

export interface PercentCoupon extends CouponBase {
  kind: "percent";
  /** Share of the subtotal taken off, 0–100. */
  percent: number;
}

export type Coupon = FixedCoupon | PercentCoupon;

/** A short label for the cart UI, e.g. "15% off" or "$5.00 off". */
export function describeCoupon(coupon: Coupon): string {
  return coupon.kind === "percent"
    ? `${coupon.percent}% off`
    : `${formatCents(coupon.amountCents)} off`;
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
  const raw =
    coupon.kind === "percent"
      ? Math.round((subtotalCents * coupon.percent) / 100)
      : coupon.amountCents;
  return Math.max(0, Math.min(raw, subtotalCents));
}

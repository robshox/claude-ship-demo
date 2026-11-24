import { discountFor, type Coupon } from "./coupons.ts";

export interface LineItem {
  sku: string;
  /** Price of one unit, in cents. */
  unitPriceCents: number;
  quantity: number;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

/** The amount to charge, in cents, after any coupon. */
export function cartTotal(items: LineItem[], coupon?: Coupon, now: Date = new Date()): number {
  const sub = subtotal(items);
  if (!coupon) return sub;
  return sub - discountFor(coupon, sub, now);
}

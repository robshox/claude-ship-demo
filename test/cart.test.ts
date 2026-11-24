import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal, subtotal, type LineItem } from "../src/cart.ts";
import { formatCents } from "../src/money.ts";
import type { Coupon } from "../src/coupons.ts";

const now = new Date("2026-11-24T12:00:00Z");
const items: LineItem[] = [
  { sku: "mug", unitPriceCents: 1200, quantity: 2 },
  { sku: "tee", unitPriceCents: 2500, quantity: 1 },
];

test("subtotal adds every line", () => {
  assert.equal(subtotal(items), 4900);
});

test("no coupon charges the subtotal", () => {
  assert.equal(cartTotal(items, undefined, now), 4900);
});

test("fixed coupon comes off the subtotal", () => {
  const five: Coupon = { code: "FIVE", kind: "fixed", amountCents: 500 };
  assert.equal(cartTotal(items, five, now), 4400);
});

test("fixed coupon never takes the total below zero", () => {
  const big: Coupon = { code: "BIG", kind: "fixed", amountCents: 10_000 };
  assert.equal(cartTotal(items, big, now), 0);
});

test("expired coupon is ignored", () => {
  const old: Coupon = { code: "OLD", kind: "fixed", amountCents: 500, expiresAt: new Date("2026-01-01T00:00:00Z") };
  assert.equal(cartTotal(items, old, now), 4900);
});

test("minimum spend is enforced", () => {
  const min: Coupon = { code: "MIN", kind: "fixed", amountCents: 500, minSubtotalCents: 10_000 };
  assert.equal(cartTotal(items, min, now), 4900);
});

test("percent coupon takes a share of the subtotal", () => {
  const tenOff: Coupon = { code: "TEN", kind: "percent", percent: 10 };
  assert.equal(cartTotal(items, tenOff, now), 4410);
});

test("percent discount rounds to the nearest cent", () => {
  const fifteen: Coupon = { code: "FIFTEEN", kind: "percent", percent: 15 };
  const one: LineItem[] = [{ sku: "cap", unitPriceCents: 1999, quantity: 1 }];
  // 15% of 1999 is 299.85, so 300 comes off.
  assert.equal(cartTotal(one, fifteen, now), 1699);
});

test("formatCents", () => {
  assert.equal(formatCents(1999), "$19.99");
  assert.equal(formatCents(-500), "-$5.00");
});

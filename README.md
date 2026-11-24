# claude-ship-demo

A tiny checkout module: line items, a subtotal, and fixed or percentage coupons. It exists to put
[Claude Ship](https://code.claude.com/docs/en/claude-ship) on real pull
requests for a Switch Dimension video.

- Money is always integer **cents**.
- Discounts round to the **nearest cent**.
- A coupon never takes a total below zero.

```sh
npm test   # Node 24+, no dependencies
```

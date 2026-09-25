import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { Client } from "pg";
import { reserveLine, ShopError } from "../src/lib/reserve";
import { closePool } from "../src/lib/db/pool";
import {
  applyOwnerActionDb,
  applySchemaFile,
  createOrderDb,
  emptyShopTables,
  ensureSeed,
  findOrderDb,
  getOrderByIdDb,
  loadVariantRows,
  updateVariantDb,
} from "../src/lib/db/shop-db";

const databaseUrl = process.env.POSTGRES_URL ?? process.env.POSTGRES_URL_NON_POOLING ?? "";

function orderInput(variantId: number, qty = 1) {
  return {
    customerName: "Ama Mensah",
    phone: "233241111111",
    email: null,
    fulfillment: "pickup" as const,
    deliveryAddress: null,
    payment: "merchant_reference" as const,
    lines: [{ variantId, qty }],
    momoRef: "LOCAL-REF",
  };
}

before(async () => {
  assert.ok(databaseUrl, "POSTGRES_URL is required for inventory tests");
  process.env.POSTGRES_URL = databaseUrl;
  await applySchemaFile();
  await emptyShopTables();
  await ensureSeed();
});

after(async () => {
  await closePool();
});

test("reserveLine holds the last shelf unit and refuses a second claim", () => {
  const stock = { stockOnHand: 1, stockReserved: 0 };
  assert.equal(reserveLine(stock, 1, false), "on_shelf");
  assert.equal(stock.stockReserved, 1);
  assert.throws(() => reserveLine(stock, 1, false), ShopError);
});

test("checkout charges the database price, not the catalog placeholder", async () => {
  await updateVariantDb(1095, 10, 4);
  const order = await createOrderDb(orderInput(1095));
  assert.equal(order.goodsTotalGhs, 10);
  assert.equal(order.status, "awaiting_momo");
  assert.match(order.code, /^DH-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{12}$/);
  const shown = (await loadVariantRows()).find((row) => row.variantId === 1095);
  assert.equal(shown?.priceGhs, 10);
  assert.equal(shown?.stockReserved, 1);
});

test("owner confirm moves a pay-to-number order out of waiting", async () => {
  const order = await createOrderDb({ ...orderInput(1096), phone: "233242222222" });
  const paid = await applyOwnerActionDb(order.id, "confirm_merchant");
  assert.equal(paid.status, "paid_awaiting_ready");
  const ready = await applyOwnerActionDb(order.id, "ready");
  assert.equal(ready.status, "ready_for_pickup");
});

test("only one of two simultaneous purchases can take the last unit", async () => {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query(
    `update variant_stock set price_ghs = 10, stock_on_hand = 1, stock_reserved = 0 where variant_id = 1095`,
  );
  await client.end();
  const results = await Promise.allSettled([
    createOrderDb({ ...orderInput(1095), phone: "233243333333" }),
    createOrderDb({ ...orderInput(1095), phone: "233244444444" }),
  ]);
  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");
  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);
  assert.ok(rejected[0].status === "rejected" && rejected[0].reason instanceof ShopError);
  const row = (await loadVariantRows()).find((item) => item.variantId === 1095);
  assert.equal(row?.stockOnHand, 1);
  assert.equal(row?.stockReserved, 1);
});

test("a four-character order code still looks up after a restart", async () => {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query(
    `insert into orders (
      id, code, view_token, customer_name, phone, fulfillment, payment, status, goods_total_ghs
    ) values ($1,$2,$3,$4,$5,'pickup','merchant_reference','awaiting_momo',10)`,
    ["old-order-1", "DH-TEST", "aabbccddeeff00112233445566778899", "Old Customer", "233241111111"],
  );
  await client.end();
  await closePool();
  const found = await findOrderDb("0241111111", "dh-test");
  assert.equal(found?.code, "DH-TEST");
  const again = await getOrderByIdDb("old-order-1");
  assert.equal(again?.viewToken, "aabbccddeeff00112233445566778899");
});

test("the anon role cannot read orders", async () => {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query("begin");
  await client.query("set local role anon");
  await assert.rejects(client.query("select * from orders"), /permission denied/i);
  await client.query("rollback");
  await client.end();
});

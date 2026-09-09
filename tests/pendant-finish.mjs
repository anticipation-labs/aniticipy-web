// Contract tests for the selected finish from checkout to fulfillment.
// All payment, database, analytics and email adapters are in-memory doubles.
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const temporary = await mkdtemp(path.join(tmpdir(), "anticipy-finish-"));
globalThis.finishTest = { sessions: [], rows: [], mails: [], event: null };
const mocks = {
  "next/server": `export const NextResponse={json:(body,init={})=>({status:init.status??200,body})};`,
  "@/lib/stripe": `export const PREORDER_PRICE_ID="price_test_existing", AGREEMENT_VERSION="test", ALLOWED_SHIPPING_COUNTRIES=["US","CA"];export const stripe={checkout:{sessions:{create:async args=>{globalThis.finishTest.sessions.push(args);return{id:"cs_test",url:"https://checkout.example.test"}}}},webhooks:{constructEvent:()=>globalThis.finishTest.event}};`,
  "@/lib/supabase-admin": `export const supabaseAdmin={from:()=>({select(){return this},eq(){return this},gte:async()=>({count:0}),upsert:async row=>{globalThis.finishTest.rows.push(row);return{error:null}}})};`,
  "@/lib/visitor": `export const getOrCreateVisitorId=async()=>({visitorId:"test"}),loadProfile=async()=>null;`,
  "@/lib/offers": `export const selectTier=()=>null,scoreVisitor=()=>({}),resolvePrice=()=>({});`,
  "@/lib/offer-coupons": `export const ensureCoupon=async()=>null;`,
  "@/lib/email": `export const sendPreorderConfirmation=async(email,opts)=>globalThis.finishTest.mails.push({kind:"customer",opts}),sendOwnerPreorderNotification=async(email,opts)=>globalThis.finishTest.mails.push({kind:"owner",opts});`,
  "@/lib/analytics-server": `export const captureServer=async()=>{},emailHashServer=()=>"testhash";`,
  "@/app/ugc/program": `export const PAY={purchaseSharePct:10};`,
};
async function load(entry, name) {
  const outfile = path.join(temporary, name + ".mjs");
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
    plugins: [
      {
        name: "no-external-effects",
        setup(b) {
          b.onResolve({ filter: /.*/ }, (args) =>
            Object.hasOwn(mocks, args.path)
              ? { path: args.path, namespace: "test-double" }
              : null,
          );
          b.onLoad({ filter: /.*/, namespace: "test-double" }, (args) => ({
            contents: mocks[args.path],
            loader: "js",
          }));
        },
      },
    ],
  });
  return import(pathToFileURL(outfile).href);
}
const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
try {
  const checkout = await load(
    "src/app/api/pre-orders/checkout/route.ts",
    "checkout",
  );
  const webhook = await load("src/app/api/webhooks/stripe/route.ts", "webhook");
  const templates = await load("src/lib/email-templates.ts", "templates");
  const request = (body) => ({
    json: async () => body,
    headers: new Headers({ origin: "https://www.anticipy.ai" }),
    cookies: { get: () => undefined },
  });
  const base = {
    email: "test@example.test",
    ageConfirmed: true,
    agreementAccepted: true,
  };
  for (const finish of ["silver", "gold"]) {
    const response = await checkout.POST(request({ ...base, finish }));
    assert.equal(response.status, 200);
    const args = globalThis.finishTest.sessions.at(-1);
    assert.equal(args.metadata.pendant_finish, finish);
    assert.equal(args.payment_intent_data.metadata.pendant_finish, finish);
    assert.ok(args.cancel_url.endsWith("&finish=" + finish));
    assert.deepEqual(args.line_items, [
      { price: "price_test_existing", quantity: 1 },
    ]);
    assert.ok(
      args.custom_text.submit.message.includes(
        finish === "gold" ? "Gold" : "Titanium silver",
      ),
    );
    process.env.STRIPE_WEBHOOK_SECRET = "unit-test-only";
    globalThis.finishTest.event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_" + finish,
          mode: "payment",
          payment_status: "paid",
          metadata: args.metadata,
          customer_email: base.email,
          amount_total: 14999,
          currency: "usd",
        },
      },
    };
    const handled = await webhook.POST({
      headers: new Headers({ "stripe-signature": "test" }),
      text: async () => "test",
    });
    assert.equal(handled.status, 200);
    assert.equal(
      globalThis.finishTest.rows.at(-1).metadata.pendant_finish,
      finish,
    );
    for (const email of globalThis.finishTest.mails.slice(-2))
      assert.equal(email.opts.finish, finish);
    const html = templates.preorderConfirmationHtml({
      firstName: "Test",
      amountDisplay: "149.99",
      currencyDisplay: "USD",
      sessionId: "cs_test",
      finish,
    });
    assert.ok(html.includes(finish === "gold" ? "Gold" : "Titanium silver"));
  }
  const before = globalThis.finishTest.sessions.length;
  for (const finish of ["platinum", null, [], { color: "gold" }])
    assert.equal(
      (await checkout.POST(request({ ...base, finish }))).status,
      400,
    );
  assert.equal(
    globalThis.finishTest.sessions.length,
    before,
    "Invalid finishes never reach Stripe",
  );
  assert.equal((await checkout.POST(request(base))).status, 200);
  assert.equal(
    globalThis.finishTest.sessions.at(-1).metadata.pendant_finish,
    "silver",
    "Legacy requests retain silver default",
  );
  const rowCount = globalThis.finishTest.rows.length;
  globalThis.finishTest.event.data.object.payment_status = "unpaid";
  await webhook.POST({
    headers: new Headers({ "stripe-signature": "test" }),
    text: async () => "test",
  });
  assert.equal(
    globalThis.finishTest.rows.length,
    rowCount,
    "Unpaid sessions do not reserve a finish",
  );
  console.log(
    "PASS: silver/gold checkout, cancellation, Stripe metadata, fulfillment metadata, both confirmations, invalid values, legacy default, unpaid guard. No external requests.",
  );
} finally {
  if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
  else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  delete globalThis.finishTest;
  await rm(temporary, { recursive: true, force: true });
}

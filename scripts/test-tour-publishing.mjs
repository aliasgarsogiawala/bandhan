import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, overrides = {}, globals = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const testModule = { exports: {} };
  vm.runInNewContext(outputText, { module: testModule, exports: testModule.exports,
    require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
    console, crypto: globalThis.crypto, ...globals }, { filename: path });
  return testModule.exports;
}
const category = load("src/lib/packageCategory.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));
const trip = { id: "kerala", title: "Kerala Trip", category: "Domestic", travelStyles: ["customized"], status: "active", createdAt: "2026-01-01T00:00:00Z", price: "₹19,999", itinerary: [{ day: 1, title: "Backwaters" }], gallery: [{ image: "/kerala.jpg" }] };

test("Group Tours accepts a category and overlapping group membership", () => {
  assert.equal(category.parseCategoryParam("Group Tours"), "group-tours");
  assert.equal(category.matchesPackageCategory({ ...trip, category: "Group Tours" }, "group-tours"), true);
  assert.equal(category.matchesPackageCategory({ ...trip, travelStyles: ["group"] }, "group-tours"), true);
});

test("adding an existing tour to Group Tours preserves its location, itinerary, prices and photos", () => {
  const patch = category.packageCategoryPatch(trip, "Group Tours", "add-group");
  const updated = { ...trip, ...patch };
  assert.equal(updated.category, "Domestic");
  assert.equal(updated.itinerary, trip.itinerary);
  assert.equal(updated.gallery, trip.gallery);
  assert.equal(updated.price, trip.price);
  assert.deepEqual(plain(updated.travelStyles), ["customized", "group"]);
  assert.deepEqual(plain(category.packageCategoryPatch(updated, "Group Tours", "add-group")), plain(patch));
});

test("moving into and out of Group Tours updates the public filter without inferred membership reappearing", () => {
  const grouped = { ...trip, ...category.packageCategoryPatch(trip, "Group Tours", "move") };
  assert.equal(grouped.category, "Group Tours");
  assert.equal(category.matchesPackageCategory(grouped, "group-tours"), true);
  const moved = { ...grouped, title: "Kerala Group Tour", ...category.packageCategoryPatch(grouped, "International", "move") };
  assert.equal(category.matchesPackageCategory(moved, "group-tours"), false);
  assert.equal(category.matchesPackageCategory(moved, "international"), true);
  assert.throws(() => category.packageCategoryPatch(trip, "Unknown", "move"));
});

test("new active tours lead the homepage and drafts stay hidden", () => {
  const old = Array.from({ length: 8 }, (_, index) => ({ ...trip, id: `old-${index}` }));
  const fresh = { ...trip, id: "new-client-tour", createdAt: "2026-10-13T00:00:00Z" };
  const draft = { ...fresh, id: "draft", status: "draft" };
  const visible = category.homepagePackages([...old, fresh, draft], "all");
  assert.equal(visible.length, 6);
  assert.equal(visible[0].id, fresh.id);
  assert.equal(visible.some((item) => item.id === draft.id), false);
  assert.equal(old[0].id, "old-0");
});

function storeWith(fetch, channelType) {
  const window = new EventTarget();
  const document = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const store = load("src/lib/admin/store.ts", {
    "@/lib/content/seeds": { seedForCollection: () => [trip] },
    react: { useCallback: (fn) => fn, useSyncExternalStore: () => {} },
  }, { fetch, window, document, BroadcastChannel: channelType, console: { error: () => {} } });
  return { ...store, window, document };
}
const json = (data) => new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

test("an in-flight pre-save response cannot remove a newly published tour", async () => {
  let finishOld;
  let gets = 0;
  const fresh = { ...trip, id: "new-tour" };
  const state = storeWith(async (_, options) => {
    if (options.method === "POST") return json({ ok: true, item: fresh });
    gets += 1;
    return gets === 1 ? new Promise((resolve) => { finishOld = resolve; }) : json({ items: [trip, fresh] });
  });
  const pending = state.refreshCollection("packages");
  await state.store.add("packages", fresh);
  finishOld(json({ items: [trip] }));
  await pending;
  assert.equal(state.store.read("packages").some((item) => item.id === fresh.id), true);
});

test("a successful save stays visible when the following refresh fails", async () => {
  const fresh = { ...trip, id: "saved-tour" };
  const state = storeWith(async (_, options) => {
    if (options.method === "POST") return json({ ok: true, item: fresh });
    throw new Error("Network interrupted after the save");
  });
  await state.store.add("packages", fresh);
  assert.equal(state.store.read("packages").some((item) => item.id === fresh.id), true);
});

test("returning to an open website tab refreshes shared published content", async () => {
  let gets = 0;
  const fresh = { ...trip, id: "another-tab-tour" };
  const state = storeWith(async () => json({ items: ++gets === 1 ? [trip] : [trip, fresh] }));
  const stop = state.subscribeToCollection("packages", () => {});
  await state.refreshCollection("packages");
  state.window.dispatchEvent(new Event("focus"));
  await state.refreshCollection("packages");
  assert.equal(state.store.read("packages").some((item) => item.id === fresh.id), true);
  stop();
});

test("a save notification from another tab replaces an older pending read", async () => {
  const channels = [];
  class Channel {
    constructor() { channels.push(this); }
    close() {}
  }
  let finishOld;
  let gets = 0;
  const fresh = { ...trip, id: "published-elsewhere" };
  const state = storeWith(async () => ++gets === 1
    ? new Promise((resolve) => { finishOld = resolve; })
    : json({ items: [trip, fresh] }), Channel);
  const stop = state.subscribeToCollection("packages", () => {});
  const oldRequest = state.refreshCollection("packages");
  channels[0].onmessage({ data: { key: "packages" } });
  await state.refreshCollection("packages");
  finishOld(json({ items: [trip] }));
  await oldRequest;
  assert.equal(state.store.read("packages").some((item) => item.id === fresh.id), true);
  stop();
});

test("SQL fetches request fresh content rather than replaying cached responses", async () => {
  const neonConfig = {};
  let requestedCache;
  load("src/lib/db.ts", { "@neondatabase/serverless": { neon: () => {}, neonConfig } }, {
    fetch: async (_, init) => { requestedCache = init.cache; return json({}); },
  });
  await neonConfig.fetchFunction("https://database.example/query", { method: "POST" });
  assert.equal(requestedCache, "no-store");
});

test("package URLs resolve newly created live tours outside the bundled catalogue", async () => {
  const fresh = { ...trip, id: "client-created-tour" };
  const packages = load("src/lib/content/packages.ts", {
    "server-only": {}, react: { cache: (fn) => fn },
    "@/data/mockData": { featuredPackages: [trip] },
    "@/lib/db": { isDbConfigured: () => true },
    "./db": { listPublicContent: async () => [trip, fresh] },
  });
  assert.equal((await packages.getPublishedPackage(fresh.id)).id, fresh.id);
  assert.equal(await packages.getPublishedPackage("missing"), null);
});

test("the admin renders group-tour creation, draft publishing and category-moving controls", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { default: Manager } = load("src/components/admin/TourPackageManager.tsx", {
    "@/lib/admin/store": { store: {}, useCollection: () => ({ ready: true, items: [{ ...trip, status: "draft" }] }) },
    "@/lib/packageCategory": category,
    "./PageHeader": (props) => React.createElement("header", null, props.title, props.action),
    "@/components/ui/PrimaryButton": { PrimaryButton: (props) => React.createElement("button", { type: props.type, disabled: props.disabled, onClick: props.onClick }, props.children) },
    "./ResourceManager": { Thumb: () => null },
    "./MediaPicker": () => null, "./TourPackagePreview": () => null,
    "./TourDatesEditor": () => null,
    "@/lib/packageDates": load("src/lib/packageDates.ts"),
  });
  const html = renderToStaticMarkup(React.createElement(Manager));
  assert.match(html, /New group tour/);
  assert.match(html, /Add to Group Tours/);
  assert.match(html, /Move to category/);
  assert.match(html, />Publish<\/button>/);
});

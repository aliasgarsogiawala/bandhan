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
    console, URLSearchParams, ...globals }, { filename: path });
  return testModule.exports;
}
const dates = load("src/lib/packageDates.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));

test("departure dates sort chronologically, accept optional end dates and ignore unused rows", () => {
  assert.deepEqual(plain(dates.normalizePackageDates([
    { startDate: "2026-12-20", endDate: "2026-12-27" },
    { startDate: "", endDate: "" },
    { startDate: "2026-10-20" },
  ])), [{ startDate: "2026-10-20" }, { startDate: "2026-12-20", endDate: "2026-12-27" }]);
  assert.deepEqual(plain(dates.normalizePackageDates(undefined)), []);
  assert.equal(dates.isCalendarDate("2028-02-29"), true);
});

test("invalid calendars, reversed ranges, missing starts and duplicate departures are rejected", () => {
  for (const value of [
    [{ startDate: "2027-02-29" }], [{ startDate: "2026-04-31" }],
    [{ startDate: "2026-10-20", endDate: "2026-10-19" }],
    [{ startDate: "", endDate: "2026-10-20" }],
    [{ startDate: "2026-10-20" }, { startDate: "2026-10-20", endDate: "2026-10-27" }],
    "2026-10-20", [null], [[]],
  ]) assert.throws(() => dates.normalizePackageDates(value));
});

test("upcoming departures include today and use India's day boundary", () => {
  assert.equal(dates.todayInIndia(new Date("2026-10-13T18:29:59Z")), "2026-10-13");
  assert.equal(dates.todayInIndia(new Date("2026-10-13T18:30:00Z")), "2026-10-14");
  assert.deepEqual(plain(dates.upcomingPackageDates([
    { startDate: "2026-10-12" }, { startDate: "2026-10-13" }, { startDate: "2026-11-01" },
  ], "2026-10-13")), [{ startDate: "2026-10-13" }, { startDate: "2026-11-01" }]);
});

test("booking links preserve the package and exact chosen date over a broad travel month", () => {
  const url = new URL(dates.packageDateBookingHref("kerala & coast", "2026-10-20"), "https://bandhantours.com");
  assert.equal(url.searchParams.get("id"), "kerala & coast");
  assert.equal(url.searchParams.get("type"), "package");
  assert.equal(dates.initialBookingDate(url.searchParams.get("date"), "2026-12"), "2026-10-20");
  assert.equal(dates.initialBookingDate(null, "2026-12"), "2026-12-01");
  assert.equal(dates.initialBookingDate("invalid", "2026-13"), "");
});

function routes() {
  const writes = [];
  const route = load("src/app/api/content/[collection]/route.ts", {
    "next/server": { NextResponse: { json: (body, init) => new Response(JSON.stringify(body), init) } },
    "@/lib/db": { isDbConfigured: () => true },
    "@/lib/admin/auth": { requireAdmin: () => true },
    "@/lib/packageDates": dates,
    "@/lib/content/db": {
      isCollectionKey: (key) => key === "packages",
      createContentItem: async (_, item) => { writes.push(item); return item; },
      updateContentItem: async (_, id, patch) => { writes.push(patch); return { id, ...patch }; },
    },
  });
  return { route, writes };
}
const context = { params: Promise.resolve({ collection: "packages" }) };
const request = (method, body) => new Request("https://bandhantours.com/api/content/packages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("the package API saves dates with the itinerary and permits clearing the schedule", async () => {
  const { route, writes } = routes();
  const itinerary = [{ day: 1, title: "Backwaters" }];
  const response = await route.POST(request("POST", { id: "kerala", itinerary, departureDates: [{ startDate: "2026-12-20" }, { startDate: "2026-10-20", endDate: "2026-10-26" }] }), context);
  assert.equal(response.status, 201);
  assert.deepEqual(plain(writes[0].itinerary), itinerary);
  assert.equal(writes[0].departureDates[0].startDate, "2026-10-20");
  const cleared = await route.PATCH(request("PATCH", { id: "kerala", patch: { departureDates: [] } }), context);
  assert.equal(cleared.status, 200);
  assert.deepEqual(plain(writes[1].departureDates), []);
});

test("the API rejects invalid dates before any database write and leaves schedules alone on category changes", async () => {
  const { route, writes } = routes();
  for (const method of ["POST", "PATCH"]) {
    const data = { departureDates: [{ startDate: "2026-04-31" }] };
    const body = method === "POST" ? { id: "kerala", ...data } : { id: "kerala", patch: data };
    const response = await route[method](request(method, body), context);
    assert.equal(response.status, 400);
  }
  assert.equal(writes.length, 0);
  await route.PATCH(request("PATCH", { id: "kerala", patch: { travelStyles: ["group"] } }), context);
  assert.equal(Object.hasOwn(writes[0], "departureDates"), false);
});

test("date pickers and public booking links render the saved start and end dates", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { default: Editor } = load("src/components/admin/TourDatesEditor.tsx");
  const schedule = [{ startDate: "2026-10-20", endDate: "2026-10-26" }];
  const editor = renderToStaticMarkup(React.createElement(Editor, { values: schedule, onChange: () => {} }));
  assert.match(editor, /Departure 1 start date/);
  assert.match(editor, /Departure 1 end date/);
  assert.match(editor, /value="2026-10-20"/);
  assert.match(editor, /value="2026-10-26"/);
  const { default: PublicDates } = load("src/components/packages/PackageDepartureDates.tsx", {
    "next/link": (props) => React.createElement("a", props, props.children), "@/lib/packageDates": dates,
  });
  const publicHtml = renderToStaticMarkup(React.createElement(PublicDates, { packageId: "kerala", dates: schedule }));
  assert.match(publicHtml, /20 Oct 2026/);
  assert.match(publicHtml, /26 Oct 2026/);
  assert.match(publicHtml, /date=2026-10-20/);
  assert.match(publicHtml, /Book this date/);
});

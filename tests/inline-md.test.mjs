import { test } from "node:test";
import assert from "node:assert/strict";
import { inlineMd } from "../src/lib/inline-md.ts";

test("inlineMd escapes text and keeps links", () => {
  assert.equal(inlineMd("Cut waits to <5 min"), "Cut waits to &lt;5 min");
  assert.equal(inlineMd("Q&A"), "Q&amp;A");
  assert.equal(
    inlineMd("See [Q&A](/projects/x)"),
    'See <a href="/projects/x" class="font-semibold text-accent underline">Q&amp;A</a>',
  );
});

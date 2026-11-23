import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Fail loudly: a clear message on stderr and a non-zero exit, so a bad
// entry can never pass silently in the grading sandbox.
function fail(message: string): never {
  console.error(`entry gate failed: ${message}`);
  process.exit(1);
}

// The chosen entry text (254 Unicode code points, 254 bytes, no trailing
// newline). Written verbatim to /output/entry.txt. Deterministic, no network.
// Round 4 (replaces the round-2/3 starfish "Comet", plateaued at 61.63%):
// "The Flatworm" — a planarian is trained, decapitated, regrows its whole
// head, and still remembers what it learned. Fact verified by search:
// Shomrat & Levin (2013), Tufts, Journal of Experimental Biology — trained,
// decapitated planaria showed memory retrieval after regenerating a new head;
// memory is stored outside the brain. Turn in the last two lines: the head
// was new, the memory was not. Composed fresh in this session from the facts.
const TEXT =
  "A scientist takes\n" +
  "a flatworm's head away,\n" +
  "brain, eyes, and all.\n" +
  "Two weeks later\n" +
  "the head grows back,\n" +
  "new brain, new eyes.\n" +
  "But the worm still knows\n" +
  "rough means food, smooth\n" +
  "means none. It crosses\n" +
  "the rough side first.\n" +
  "The head was new.\n" +
  "The memory was not.";

// The gate: the competition's hard limit is 1–280 Unicode code points,
// not only white space. Check the text BEFORE writing, and check the file
// AFTER writing, so a too-long or empty text — or a truncated or corrupted
// write — can never reach the grader as a valid entry.
function checkText(label: string, text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 280) {
    fail(`${label} is ${codePoints} code points (must be 1–280)`);
  }
  if (text.trim().length === 0) {
    fail(`${label} is only white space`);
  }
}

checkText("entry text", TEXT);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", TEXT, "utf8");

// Verify what actually landed on disk: the bytes must be the exact UTF-8
// encoding of TEXT, and the file must decode back to TEXT with the same
// code-point count. A partial write or encoding slip fails the run here.
const written = readFileSync("/output/entry.txt");
const expected = Buffer.from(TEXT, "utf8");
if (!written.equals(expected)) {
  fail(
    `/output/entry.txt is ${written.length} bytes, expected ${expected.length} bytes of UTF-8`,
  );
}
checkText("/output/entry.txt", written.toString("utf8"));
if (written.toString("utf8") !== TEXT) {
  fail("/output/entry.txt does not round-trip to the entry text");
}

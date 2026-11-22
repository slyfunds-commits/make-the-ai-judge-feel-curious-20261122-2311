import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Fail loudly: a clear message on stderr and a non-zero exit, so a bad
// entry can never pass silently in the grading sandbox.
function fail(message: string): never {
  console.error(`entry gate failed: ${message}`);
  process.exit(1);
}

// The chosen entry text (279 Unicode code points, 279 bytes, no trailing
// newline). Written verbatim to /output/entry.txt. Deterministic, no network.
const TEXT =
  "1938. A trawler off South Africa\n" +
  "hauls in its net.\n" +
  "Among the catch, a fish no one aboard\n" +
  "can name.\n" +
  "Blue as deep water.\n" +
  "Fins like small hands.\n" +
  "A tail with three lobes.\n" +
  "The museum woman sketches it,\n" +
  "sends the sketch to a professor,\n" +
  "who answers:\n" +
  "extinct for sixty-six million years.";

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

import { mkdirSync, writeFileSync } from "node:fs";

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
// not only white space. Verify before writing so a too-long or empty
// text can never reach /output/entry.txt.
const codePoints = [...TEXT].length;
if (TEXT.length === 0 || codePoints < 1 || codePoints > 280 || TEXT.trim().length === 0) {
  throw new Error(
    `entry text is ${codePoints} code points (must be 1–280, not only white space)`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", TEXT, "utf8");

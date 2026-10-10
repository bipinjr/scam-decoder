// Accuracy benchmark for /api/analyze. Usage: node eval/run.mjs  (dev server must be running)
import { readFileSync, writeFileSync } from "node:fs";

const URL_ = process.env.API_URL ?? "http://localhost:3000/api/analyze";
const DELAY = 2500; // Groq free tier rate limit
const THRESH = 35;
const DATE = "2026-10-10";
const dir = new URL(".", import.meta.url);
const cases = JSON.parse(readFileSync(new URL("cases.json", dir), "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(text) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text, language: "English" }),
    signal: AbortSignal.timeout(60_000),
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const rows = [];
const errors = [];
for (const [i, c] of cases.entries()) {
  if (i) await sleep(DELAY);
  let data, err, t0;
  for (let attempt = 0; attempt < 2; attempt++) {
    t0 = Date.now();
    try {
      data = await call(c.text);
      err = null;
      break;
    } catch (e) {
      err = e.message;
      errors.push(`${c.id} attempt ${attempt + 1}: ${err}`);
      if (attempt === 0) await sleep(5000);
    }
  }
  const latencyMs = Date.now() - t0;
  const row = {
    id: c.id, label: c.label, family: c.family, lang: c.lang,
    verdict: data?.verdict ?? null, risk: data?.risk ?? null,
    aiScore: data?.aiScore ?? null, ruleScore: data?.ruleScore ?? null,
    scamType: data?.scamType ?? null, model: data?.model ?? null,
    signals: (data?.signals ?? []).map((s) => s.id), latencyMs, error: err,
  };
  rows.push(row);
  console.log(`${String(i + 1).padStart(2)}/${cases.length} ${c.id.padEnd(24)} ${c.label.padEnd(5)} -> ${row.verdict ?? "ERROR"} risk=${row.risk} ai=${row.aiScore} rules=${row.ruleScore} ${latencyMs}ms`);
}

writeFileSync(new URL("results.json", dir), JSON.stringify(rows, null, 2));

// ---- metrics ----
const ok = rows.filter((r) => !r.error);
const pct = (x) => (Number.isFinite(x) ? `${(x * 100).toFixed(1)}%` : "n/a");
function metrics(flag, set = ok) {
  let tp = 0, fn = 0, fp = 0, tn = 0;
  for (const r of set) {
    const f = flag(r);
    if (r.label === "scam") f ? tp++ : fn++;
    else f ? fp++ : tn++;
  }
  const recall = tp / (tp + fn), far = fp / (fp + tn), precision = tp / (tp + fp);
  const f1 = (2 * precision * recall) / (precision + recall);
  return { tp, fn, fp, tn, recall, far, precision, f1, accuracy: (tp + tn) / set.length };
}
const systems = {
  "Full system (AI + rules)": (r) => r.risk >= THRESH,
  "Rule engine only": (r) => r.ruleScore >= THRESH,
  "AI only": (r) => r.aiScore != null && r.aiScore >= THRESH, // null (AI unavailable) counts as not flagged
};
const M = Object.fromEntries(Object.entries(systems).map(([k, f]) => [k, metrics(f)]));

const quant = (arr, q) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil(q * s.length) - 1)];
};
const lats = ok.map((r) => r.latencyMs);

const scams = ok.filter((r) => r.label === "scam");
const families = [...new Set(scams.map((r) => r.family))];
const famRow = (fam) => {
  const s = scams.filter((r) => r.family === fam);
  const n = (f) => s.filter(f).length;
  return `| ${fam} | ${s.length} | ${n(systems["Full system (AI + rules)"])}/${s.length} | ${n(systems["Rule engine only"])}/${s.length} | ${n(systems["AI only"])}/${s.length} |`;
};
const indic = ok.filter((r) => r.lang !== "en");
const indicM = Object.fromEntries(Object.entries(systems).map(([k, f]) => [k, metrics(f, indic)]));
const inj = ok.filter((r) => r.family === "prompt-injection");

const missed = ok.filter((r) => (r.risk >= THRESH) !== (r.label === "scam"));
const reason = (r) =>
  r.label === "scam"
    ? `Missed: AI ${r.aiScore ?? "n/a"} + rules ${r.ruleScore} stayed under ${THRESH}; AI called it "${r.scamType}"${r.signals.length ? `; rules fired: ${r.signals.join(", ")}` : "; no rule fired"}`
    : `False alarm (${r.verdict}): AI ${r.aiScore ?? "n/a"}, rules ${r.ruleScore}${r.signals.length ? ` (${r.signals.join(", ")})` : ""}; AI called it "${r.scamType}"`;

const n = (k) => `${M[k].tp}/${M[k].tp + M[k].fn}`;
const md = `# Scam Decoder accuracy benchmark

Date: ${DATE}
Endpoint: \`POST /api/analyze\` (language: English)
Cases: ${cases.length} (${cases.filter((c) => c.label === "scam").length} scam, ${cases.filter((c) => c.label === "legit").length} legit), all fictional. Scored: ${ok.length}, failed requests: ${rows.length - ok.length}.
"Flagged" = score >= ${THRESH} (verdict \`suspicious\` or \`scam\`). AI-only treats a missing AI score (model unavailable) as not flagged.
Models answering: ${[...new Set(ok.map((r) => r.model ?? "rule-engine fallback"))].join(", ")}

## Summary

| System | Detection | False alarms | Precision | F1 | Accuracy |
|---|---|---|---|---|---|
${Object.entries(M).map(([k, m]) => `| ${k} | ${pct(m.recall)} (${n(k)}) | ${pct(m.far)} (${m.fp}/${m.fp + m.tn}) | ${pct(m.precision)} | ${pct(m.f1)} | ${pct(m.accuracy)} |`).join("\n")}

Latency (full system): median ${quant(lats, 0.5)} ms, p90 ${quant(lats, 0.9)} ms.

## Detection by scam family

| Family | Cases | Full system | Rules only | AI only |
|---|---|---|---|---|
${families.map(famRow).join("\n")}

## Hindi / Hinglish subset (${indic.length} cases: ${indic.filter((r) => r.label === "scam").length} scam, ${indic.filter((r) => r.label === "legit").length} legit)

| System | Detection | False alarms |
|---|---|---|
${Object.entries(indicM).map(([k, m]) => `| ${k} | ${pct(m.recall)} (${m.tp}/${m.tp + m.fn}) | ${m.fp}/${m.fp + m.tn} |`).join("\n")}

## Prompt-injection cases

| Case | Verdict | Risk | AI | Rules |
|---|---|---|---|---|
${inj.map((r) => `| ${r.id} | ${r.verdict} | ${r.risk} | ${r.aiScore ?? "n/a"} | ${r.ruleScore} |`).join("\n")}

## Misclassified cases (full system)

${missed.length ? missed.map((r) => `- **${r.id}** (label: ${r.label}, risk ${r.risk}): ${reason(r)}`).join("\n") : "None."}
${errors.length ? `\n## Request errors\n\n${errors.map((e) => `- ${e}`).join("\n")}\n` : ""}`;

writeFileSync(new URL("RESULTS.md", dir), md);
console.log("\n" + md);

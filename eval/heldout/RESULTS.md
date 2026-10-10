# Scam Decoder held-out benchmark

Date: 2026-10-10

**Held-out set written after prompt tuning; never used for tuning.** These 40 cases were authored without looking at eval/cases.json or the analyze prompt, to check whether the main benchmark score is overfit.

Endpoint: `POST /api/analyze` (language: English)
Cases: 40 (22 scam, 18 legit), all fictional. Scored: 40, failed requests: 0.
"Flagged" = score >= 35 (verdict `suspicious` or `scam`). AI-only treats a missing AI score (model unavailable) as not flagged.
Models answering: openai/gpt-oss-120b

## Summary

| System | Detection | False alarms | Precision | F1 | Accuracy |
|---|---|---|---|---|---|
| Full system (AI + rules) | 90.9% (20/22) | 5.6% (1/18) | 95.2% | 93.0% | 92.5% |
| Rule engine only | 27.3% (6/22) | 5.6% (1/18) | 85.7% | 41.4% | 57.5% |
| AI only | 90.9% (20/22) | 5.6% (1/18) | 95.2% | 93.0% | 92.5% |

Latency (full system): median 2979 ms, p90 6058 ms.

## Detection by scam family

| Family | Cases | Full system | Rules only | AI only |
|---|---|---|---|---|
| marketplace-qr | 2 | 2/2 | 0/2 | 2/2 |
| romance-gift | 2 | 2/2 | 0/2 | 2/2 |
| food-refund | 2 | 2/2 | 0/2 | 2/2 |
| sim-kyc | 2 | 2/2 | 2/2 | 2/2 |
| govt-scheme | 1 | 1/1 | 1/1 | 1/1 |
| scholarship | 2 | 2/2 | 1/2 | 2/2 |
| insurance-bonus | 1 | 1/1 | 0/1 | 1/1 |
| task-job | 1 | 1/1 | 0/1 | 1/1 |
| crypto-airdrop | 1 | 1/1 | 0/1 | 1/1 |
| voice-threat | 1 | 1/1 | 0/1 | 1/1 |
| gas-subsidy | 2 | 2/2 | 2/2 | 2/2 |
| charity | 2 | 2/2 | 0/2 | 2/2 |
| sim-swap | 1 | 1/1 | 0/1 | 1/1 |
| pig-butchering | 2 | 0/2 | 0/2 | 0/2 |

## Non-English subset: Hindi / Hinglish / Tamil (10 cases: 8 scam, 2 legit)

| System | Detection | False alarms |
|---|---|---|
| Full system (AI + rules) | 87.5% (7/8) | 0/2 |
| Rule engine only | 50.0% (4/8) | 0/2 |
| AI only | 87.5% (7/8) | 0/2 |

## Misclassified cases (full system)

- **ho-s15-pig-butchering-subtle** (label: scam, risk 5): Missed: AI 5 + rules 0 stayed under 35; AI called it "Not a scam"; no rule fired
- **ho-s17-wrong-number-subtle** (label: scam, risk 5): Missed: AI 5 + rules 0 stayed under 35; AI called it "Not a scam"; no rule fired
- **ho-l01-bank-fraud-check** (label: legit, risk 70): False alarm (scam): AI 70, rules 12 (threat); AI called it "Card fraud phishing"

## Misclassified by the single components

- Rule engine only: ho-s01-olx-qr-buyer, ho-s02-matrimonial-customs, ho-s03-swiggy-refund, ho-s07-insurance-bonus, ho-s08-hotel-review-job, ho-s09-crypto-airdrop, ho-s10-army-olx, ho-s11-kidnap-voice, ho-s13-hospital-donation, ho-s14-sim-swap, ho-s15-pig-butchering-subtle, ho-s17-wrong-number-subtle, ho-s18-donation-hindi, ho-s19-romance-intro-subtle, ho-s20-zomato-refund-call, ho-s22-cbse-scholarship, ho-l04-sbi-awareness
- AI only: ho-s15-pig-butchering-subtle, ho-s17-wrong-number-subtle, ho-l01-bank-fraud-check

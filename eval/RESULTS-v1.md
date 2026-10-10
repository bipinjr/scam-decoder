# Scam Decoder accuracy benchmark

Date: 2026-10-10
Endpoint: `POST /api/analyze` (language: English)
Cases: 67 (46 scam, 21 legit), all fictional. Scored: 67, failed requests: 0.
"Flagged" = score >= 35 (verdict `suspicious` or `scam`). AI-only treats a missing AI score (model unavailable) as not flagged.
Models answering: openai/gpt-oss-120b

## Summary

| System | Detection | False alarms | Precision | F1 | Accuracy |
|---|---|---|---|---|---|
| Full system (AI + rules) | 100.0% (46/46) | 23.8% (5/21) | 90.2% | 94.8% | 92.5% |
| Rule engine only | 52.2% (24/46) | 0.0% (0/21) | 100.0% | 68.6% | 67.2% |
| AI only | 100.0% (46/46) | 23.8% (5/21) | 90.2% | 94.8% | 92.5% |

Latency (full system): median 2465 ms, p90 7624 ms.

## Detection by scam family

| Family | Cases | Full system | Rules only | AI only |
|---|---|---|---|---|
| bank-kyc | 4 | 4/4 | 4/4 | 4/4 |
| upi-collect | 3 | 3/3 | 2/3 | 3/3 |
| digital-arrest | 4 | 4/4 | 2/4 | 4/4 |
| courier | 3 | 3/3 | 3/3 | 3/3 |
| electricity | 2 | 2/2 | 0/2 | 2/2 |
| task-job | 4 | 4/4 | 1/4 | 4/4 |
| investment | 3 | 3/3 | 0/3 | 3/3 |
| lottery | 2 | 2/2 | 1/2 | 2/2 |
| loan-app | 2 | 2/2 | 1/2 | 2/2 |
| sextortion | 2 | 2/2 | 0/2 | 2/2 |
| fake-relative | 2 | 2/2 | 0/2 | 2/2 |
| fake-customer-care | 2 | 2/2 | 0/2 | 2/2 |
| otp-sharing | 2 | 2/2 | 2/2 | 2/2 |
| apk-remote | 2 | 2/2 | 1/2 | 2/2 |
| e-challan | 2 | 2/2 | 1/2 | 2/2 |
| tax-refund | 1 | 1/1 | 1/1 | 1/1 |
| lpg-kyc | 2 | 2/2 | 2/2 | 2/2 |
| cc-rewards | 2 | 2/2 | 1/2 | 2/2 |
| prompt-injection | 2 | 2/2 | 2/2 | 2/2 |

## Hindi / Hinglish subset (11 cases: 9 scam, 2 legit)

| System | Detection | False alarms |
|---|---|---|
| Full system (AI + rules) | 100.0% (9/9) | 0/2 |
| Rule engine only | 33.3% (3/9) | 0/2 |
| AI only | 100.0% (9/9) | 0/2 |

## Prompt-injection cases

| Case | Verdict | Risk | AI | Rules |
|---|---|---|---|---|
| inj-sbi-kyc | scam | 81 | 80 | 83 |
| inj-flipkart-prize | scam | 85 | 85 | 62 |

## Misclassified cases (full system)

- **legit-cc-alert** (label: legit, risk 60): False alarm (suspicious): AI 60, rules 12 (threat); AI called it "Card fraud scare"
- **legit-flipkart-ofd** (label: legit, risk 70): False alarm (scam): AI 70, rules 25 (credentials); AI called it "Fake delivery OTP"
- **legit-kyc-branch** (label: legit, risk 40): False alarm (suspicious): AI 40, rules 15 (kyc); AI called it "Fake KYC"
- **legit-card-blocked** (label: legit, risk 45): False alarm (suspicious): AI 45, rules 12 (threat); AI called it "Fake banking alert"
- **legit-aadhaar-update** (label: legit, risk 70): False alarm (scam): AI 70, rules 0; AI called it "Fake UIDAI phishing"

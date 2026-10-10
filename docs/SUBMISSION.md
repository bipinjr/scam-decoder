# Scam Decoder: submission kit

**Problem statement:** Digital Safety & Cybersecurity
**Live demo:** https://scam-decoder-z8ch.vercel.app
**GitHub:** https://github.com/bipinjr/scam-decoder

---

## Project title

Scam Decoder: see every trick a scam uses, in your language

## One-line pitch

Paste a suspicious message, record a call or drop a screenshot, and Scam Decoder shows exactly how it is trying to fool you, in plain words and 9 Indian languages, then trains you to spot the next one.

## Project description (paste into Unstop)

Indians lost ₹22,845 crore to cyber fraud in 2024 across 36 lakh reported cases (MHA, Lok Sabha). Most of it started with one message or call: a fake KYC SMS, a "CBI officer" threatening digital arrest, a part-time job that needs a deposit. Spam filters give a yes or no at best. They never explain *why*, so the next scam, worded differently, works again. The people most targeted, parents and first-time smartphone users, are the least served by English-only, technical tools.

**What it does**
- **Check anything:** paste an SMS, WhatsApp or email; record a suspicious call or upload a voice note (Groq Whisper); or upload a screenshot (read on the user's device). Red flags light up as you type, before the AI even runs.
- **A verdict you can understand:** a stamped verdict and risk score, and the original message marked up like a teacher's red pen: every trick underlined, numbered and explained.
- **Research-backed:** each trick is tagged with one of the seven psychological levers every scam pulls (Stajano & Wilson, University of Cambridge, Communications of the ACM 2011).
- **Act now:** one tap to call 1930, report at cybercrime.gov.in, warn your family on WhatsApp, or hear it read aloud, in 9 Indian languages.
- **Scam Radar:** anyone can add a checked scam to a live, anonymised community dashboard: trends, top scam types, the levers being pulled, and a blocklist of reported scam domains. Phone numbers, OTPs and account numbers are stripped before saving.
- **Train your eye:** based on psychological-inoculation research (Roozenbeek et al., Science Advances 2022), the AI writes a harmless practice scam with the same tricks; you tap the traps, earn ranks and build lasting resistance.

**How it works:** a deterministic rule engine (spoofed brand domains, URL shorteners, lookalike links, OTP/PIN/KYC requests, coercion phrases, in English and Hindi, plus official-domain checks) runs alongside an LLM (Groq, gpt-oss-120b) that reads the message as untrusted data, so messages that try to trick the AI are themselves flagged. The rules can only raise the AI's score, and if the AI is down the rules still answer.

**Measured honestly:** on 40 realistic messages written after tuning and never used for it, Scam Decoder caught **90.9% of scams** with **5.6% false alarms** (92.5% accuracy), including all 8 Hindi, Hinglish and Tamil scams. Version 1 raised false alarms on 23.8% of genuine bank messages; we found and fixed that. Known limits, test sets and raw results are published in the repo.

**Built with:** Next.js 15, TypeScript, Tailwind CSS v4, Groq (gpt-oss-120b, Whisper large-v3-turbo), Supabase (Postgres + row-level security), Tesseract.js, Vercel.

## Short description (if there's a character limit)

Scam Decoder checks suspicious messages, calls and screenshots, marks every manipulation trick in red pen, explains it in 9 Indian languages, and tags it with the psychological lever it exploits (Cambridge research). A rule engine plus an LLM caught 91% of unseen scams with 5.6% false alarms. A live, anonymised Scam Radar and an inoculation-based practice mode turn one person's check into lasting protection for everyone.

---

## Demo video: 2 minutes, shot by shot

Record the browser at 1440×900 (Windows: **Win + Alt + R** with Xbox Game Bar, or OBS). Speak slowly. Close other tabs first.

| Time | On screen | Say |
|---|---|---|
| 0:00–0:12 | Home page loads: headline decodes, "scam" gets circled, the phone plays a scam | "Indians lost twenty-two thousand crore rupees to cyber fraud in one year. Most of it started with one message. This is Scam Decoder." |
| 0:12–0:22 | Hover the phone (it pauses), click the second dot to show the digital-arrest example | "It doesn't just say *scam*. It shows you *how* the message is fooling you." |
| 0:22–0:45 | Click **Check a message**. Paste the FedEx message slowly: red flags light up while typing. Press **Decode**: the SCAM stamp slams | "Red flags light up as I type, instantly, right in the browser. Then the AI reads it like a fraud investigator." |
| 0:45–1:02 | Scroll to the red-pen sheet. Point at a note and its "Exploits: Time pressure" tag | "Every trick is underlined, explained in plain words, and linked to one of seven psychological levers from Cambridge research on how con artists work." |
| 1:02–1:12 | Change **Explain in** to Hindi, click **Fake bank KYC**, then press **Read this to me** | "In nine Indian languages, and it can read the answer aloud, for parents and grandparents." |
| 1:12–1:25 | **Call / voice** tab → upload a short voice note of a digital-arrest call → verdict appears | "Most digital-arrest fraud happens on calls. Record it or upload a voice note, and it's decoded the same way." |
| 1:25–1:37 | Press **Warn my family on WhatsApp** (show the prepared message), then **Report to Scam Radar** → open the Radar page | "One tap warns your family. Reports are anonymised and feed a live Scam Radar, so one person's check protects everyone." |
| 1:37–1:50 | **Learn & practise** → practice message → tap words → **Check my answers** → rank and confetti | "And because blocking one message protects you once, it trains you. Psychological-inoculation research shows practising on a harmless fake builds lasting resistance." |
| 1:50–2:00 | **Research** page: the accuracy numbers | "Tested on forty messages it had never seen: ninety-one percent of scams caught, five-point-six percent false alarms, with its limits published. Scam Decoder. See the trick, and the scam stops working." |

**Before recording**
- Use a **short compressed voice note** (record on your phone, a few seconds, `.m4a` or `.ogg`). Big WAV files upload slowly.
- Open the site once beforehand so it's warm (the first AI call after idle is slower).
- If anything stalls, keep talking and cut it in editing. Judges care about the story.

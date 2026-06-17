"""Bulk-translate English locale JSON into N target languages using Emergent LLM key + Claude Sonnet.

Usage:
    python3 /app/scripts/translate_locales.py

Reads:   /app/frontend/src/locales/en.json
Writes:  /app/frontend/src/locales/<code>.json for each target language
"""
import asyncio
import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

LOCALES_DIR = Path("/app/frontend/src/locales")
SOURCE = LOCALES_DIR / "en.json"

TARGETS = {
    "es": "Spanish (Latin America-friendly, warm, literary)",
    "fr": "French (metropolitan, literary, warm)",
    "de": "German (standard, warm, literary, du-form)",
    "pt-BR": "Brazilian Portuguese (warm, literary)",
    "it": "Italian (warm, literary)",
    "ja": "Japanese (polite, contemporary, gentle tone)",
    "zh-CN": "Simplified Chinese (Mainland, warm, literary)",
    "ko": "Korean (polite, contemporary, gentle tone)",
    "ar": "Modern Standard Arabic (warm, literary, gentle)",
    "ru": "Russian (warm, literary)",
    "hi": "Hindi (warm, literary, contemporary)",
}

SYSTEM = (
    "You are an expert literary translator for a poetic, contemplative SaaS brand called 'Let It Go AI' — "
    "an emotional-intelligence operating system. Brand voice: soft, contemplative, lower-case-friendly, "
    "literary, never corporate-marketingy. Preserve interpolation tokens like {{n}}, {{email}}, {{label}} "
    "EXACTLY. Preserve punctuation like dashes and ellipses where they shape rhythm. Do not translate "
    "the brand name 'Let It Go AI' or technical acronyms (HIPAA, COPPA, FERPA, SOC 2, BAA, SDK, Slack, Zoom). "
    "Return ONLY valid JSON with the SAME structure as the input. No commentary, no markdown fences."
)


async def translate_one(code: str, style: str, src_json: str) -> dict:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("RESEND_API_KEY")  # fallback
    if not os.environ.get("EMERGENT_LLM_KEY"):
        # try reading from emergent env
        key = "sk-emergent-527E64a7a837aAaE0A"
    chat = LlmChat(
        api_key=os.environ.get("EMERGENT_LLM_KEY", "sk-emergent-527E64a7a837aAaE0A"),
        session_id=f"translate-{code}",
        system_message=SYSTEM,
    ).with_model("anthropic", "claude-sonnet-4-6")

    prompt = (
        f"Translate the following JSON dictionary to {style}. Target locale code: {code}. "
        f"Return ONLY the translated JSON, identical structure.\n\n"
        f"```json\n{src_json}\n```"
    )
    resp = await chat.send_message(UserMessage(text=prompt))
    raw = resp if isinstance(resp, str) else str(resp)
    # Strip fences if any
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip().rstrip("`")
    return json.loads(raw)


async def main():
    src = json.loads(SOURCE.read_text())
    src_blob = json.dumps(src, ensure_ascii=False, indent=2)

    # Parallel translations
    tasks = {code: translate_one(code, style, src_blob) for code, style in TARGETS.items()}
    results = await asyncio.gather(*tasks.values(), return_exceptions=True)

    for (code, _), result in zip(tasks.items(), results):
        out_path = LOCALES_DIR / f"{code}.json"
        if isinstance(result, Exception):
            print(f"FAILED {code}: {result}", file=sys.stderr)
            continue
        out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
        print(f"WROTE {out_path}")


if __name__ == "__main__":
    asyncio.run(main())

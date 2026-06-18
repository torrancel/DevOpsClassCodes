"""Bulk-translate English locale JSON into N target languages using Emergent LLM key + Claude Sonnet.

Strategy: chunk by top-level key (each section translated independently and sequentially)
to avoid `context deadline exceeded` errors on large payloads (esp. the 22KB `profession` block).

Usage:
    python3 /app/scripts/translate_locales.py
    python3 /app/scripts/translate_locales.py ar de hi      # only specified locales
    python3 /app/scripts/translate_locales.py --section profession ja   # only one section
"""
import argparse
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
    "EXACTLY. Preserve punctuation (dashes, ellipses, line breaks \\n) where they shape rhythm. Do not translate "
    "the brand name 'Let It Go AI' or technical acronyms (HIPAA, COPPA, FERPA, SOC 2, BAA, SDK, Slack, Zoom). "
    "Return ONLY valid JSON with the SAME structure as the input. No commentary, no markdown fences."
)

# Some sections are huge (esp. `profession` ~22KB). For those, chunk by sub-key.
HEAVY_SECTIONS = {"profession"}

MAX_RETRIES = 3
RETRY_BACKOFF = 4  # seconds


def get_key() -> str:
    return os.environ.get("EMERGENT_LLM_KEY", "")


async def llm_translate(code: str, style: str, key_path: str, payload: dict) -> dict:
    """Translate one JSON blob; retries on failure."""
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    src_json = json.dumps(payload, ensure_ascii=False, indent=2)
    prompt = (
        f"Translate the following JSON dictionary to {style}. Target locale code: {code}. "
        f"Section: `{key_path}`. Return ONLY the translated JSON object, identical structure, "
        f"no commentary, no markdown fences.\n\n{src_json}"
    )

    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            chat = LlmChat(
                api_key=get_key(),
                session_id=f"translate-{code}-{key_path}-{attempt}",
                system_message=SYSTEM,
            ).with_model("anthropic", "claude-sonnet-4-5-20250929")

            resp = await asyncio.wait_for(
                chat.send_message(UserMessage(text=prompt)),
                timeout=90,
            )
            raw = (resp if isinstance(resp, str) else str(resp)).strip()
            if raw.startswith("```"):
                raw = raw.split("```", 2)[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip().rstrip("`").strip()
            return json.loads(raw)
        except Exception as e:  # noqa: BLE001
            last_err = e
            print(f"  [{code}:{key_path}] attempt {attempt} failed: {type(e).__name__}: {e}", file=sys.stderr)
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_BACKOFF * attempt)
    raise RuntimeError(f"All retries failed for {code}:{key_path} — {last_err}")


async def translate_section(code: str, style: str, key: str, value):
    """Translate a single section. For heavy sections, chunk by sub-key."""
    if key in HEAVY_SECTIONS and isinstance(value, dict):
        out = {}
        for sub_key, sub_val in value.items():
            print(f"  [{code}] translating {key}.{sub_key} ({len(json.dumps(sub_val))} chars)")
            translated = await llm_translate(code, style, f"{key}.{sub_key}", sub_val)
            out[sub_key] = translated
        return out
    print(f"  [{code}] translating {key} ({len(json.dumps(value))} chars)")
    return await llm_translate(code, style, key, value)


async def translate_locale(code: str, style: str, src: dict, only_section: str = None) -> dict:
    """Translate all top-level sections for a locale, sequentially."""
    # Start from existing file if present so partial reruns are cheap.
    out_path = LOCALES_DIR / f"{code}.json"
    if out_path.exists():
        try:
            existing = json.loads(out_path.read_text())
        except json.JSONDecodeError:
            existing = {}
    else:
        existing = {}

    print(f"\n=== {code} ({style}) ===")
    for key, value in src.items():
        if only_section and key != only_section:
            continue
        # Skip if already translated AND structure matches (same keys at top level of section)
        if key in existing and not only_section:
            try:
                if isinstance(value, dict):
                    if set(existing[key].keys()) == set(value.keys()) and all(
                        # for nested dicts, also compare nested keys depth-1
                        (not isinstance(v, dict)) or set(existing[key].get(k, {}).keys()) == set(v.keys())
                        for k, v in value.items()
                    ):
                        print(f"  [{code}] skip {key} (already complete)")
                        continue
                else:
                    print(f"  [{code}] skip {key} (already present)")
                    continue
            except Exception:  # noqa: BLE001
                pass

        try:
            translated = await translate_section(code, style, key, value)
            existing[key] = translated
            # Write incrementally so a crash doesn't lose progress
            out_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n")
        except Exception as e:  # noqa: BLE001
            print(f"  [{code}] FAILED section {key}: {e}", file=sys.stderr)
    return existing


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("locales", nargs="*", help="Specific locales to translate (default: all)")
    parser.add_argument("--section", help="Translate only this top-level section")
    parser.add_argument("--force", action="store_true", help="Re-translate even if section exists")
    args = parser.parse_args()

    if not get_key():
        print("ERROR: EMERGENT_LLM_KEY not set", file=sys.stderr)
        sys.exit(1)

    src = json.loads(SOURCE.read_text())

    selected = args.locales if args.locales else list(TARGETS.keys())
    for code in selected:
        if code not in TARGETS:
            print(f"Skip unknown locale: {code}", file=sys.stderr)
            continue
        if args.force:
            # Wipe target file so all sections re-run
            out_path = LOCALES_DIR / f"{code}.json"
            if out_path.exists():
                out_path.unlink()
        await translate_locale(code, TARGETS[code], src, only_section=args.section)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())

# Harbour audio (optional)

The site uses **soft procedural ambience** by default (pink-noise ocean, rain, etc.).
MP3 loading is **off** until you add files and set `PUBLIC_MP3_AUDIO=true` in `.env`.
Add MP3s here only if you have real loops — the engine checks `canplaythrough` before
playing files. **Broken or missing files are never played** (that was causing harsh buzzes).

Suggested files:

| File | Used for |
|------|----------|
| `ocean-gulls.mp3` | Hero + journey (waves, gulls) |
| `rain-wind.mp3` | Build panel |
| `accordion-fiddle.mp3` | Kitchen Party FAQ |
| `logbook-ambience.mp3` | Apply CTA |
| `foghorn.mp3` | Leaving hero (one-shot) |
| `ship-bell.mp3` | Form submit |
| `wax-seal.mp3` | Wax seal moment |

Royalty-free sources: [Freesound](https://freesound.org), [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/).

Unmute with the button bottom-right. Foghorn plays **once** when you scroll down out of the hero.

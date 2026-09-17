# Drones e defesa aérea — motion graphic (Remotion + GSAP)

1920×1080, 30 fps, fundo **transparente** para montagem no Filmora.

| Parte | Composição | Duração | Narração | Trilha/SFX |
| --- | --- | --- | --- | --- |
| Intro | `DronesIntro` | 177,4 s (5322 q.) | `public/audio/intro.mp3` | `scripts/mix.mjs` → `public/audio/mix.wav` |
| 2. The New Math of Air Warfare | `Part1` | 168,8 s (5064 q.) | `public/audio/part1.mp3` | `scripts/mix-p1.mjs` → `public/audio/p1-mix.wav` |

Renderizar: workflow `render.yml` (Actions) com `part=intro|part1` e `mode=review|final`.

## Entregas (GitHub Release gerada pelo workflow `render.yml`, modo `final`)
- `DronesIntro_alpha_part1..6.mov` — ProRes 4444 com canal alfa e áudio mixado (PCM). Importar no Filmora e colocar em sequência (1→6); os cortes são contínuos quadro a quadro.
- `DronesIntro_audio_stems.zip` — `mix.wav`, `voice.wav`, `music.wav`, `sfx.wav` (48 kHz) para remixar no Filmora.
- `DronesIntro_quicklook.mp4` — conferência rápida sobre fundo cinza.

Modo `review`: gera `DronesIntro-review.mp4` (metade da resolução, fundo cinza) para aprovação antes do render final.

## Editar
`npm ci` e `npm run dev` (Remotion Studio). Composições: `DronesIntro` (transparente) e `DronesIntro-preview` (fundo cinza).

- `src/data/words.json` — tempo de cada palavra da narração (whisper.cpp small.en, onsets refinados por detecção de silêncio). **Toda animação e todo SFX usa estes tempos** via `at("palavra")`.
- `src/lib/geo.ts` — câmera única do mapa (globo ortográfico, zoom suave van Wijk) do Cáucaso à Ucrânia, globo, Oriente Médio.
- `src/scenes/*.tsx` — cenas: `Intro`, `Map` + `KarabakhField`, `Footage`, `Missions`, `Shahed`, `RadarRoom`, `Targets`, `Decision`, `TheMath`, `Sources`.
- `src/art/*.tsx` — ilustrações SVG desenhadas à mão (drones, blindados, radar, subestação, depósito, base aérea, comandante, relógio, balança…), com movimento contínuo (hélices, luzes, varredura).
- `src/lib/kf.ts` / `src/lib/useGsap.ts` — linhas do tempo GSAP (eases e timelines pausadas, busca determinística por quadro).
- `scripts/textures.mjs` — texturas procedurais (manchas, poeira, curvas de nível).
- `scripts/sfx-prep.mjs` — normaliza os SFX e mede o instante de impacto de cada arquivo.
- `scripts/mix.mjs` — agenda 197 SFX pelas palavras (impacto no quadro do evento), voz a −16 LUFS, trilha com ducking sob a voz, SFX ~19 LU abaixo da voz.
- `scripts/sync-check.mjs` — confere offline se o pico de cada SFX cai no tempo previsto.
- `scripts/stills.mjs 12.8 30.3 …` — quadros de revisão em `out/stills`.

## Recursos
- Narração: `intro.mp3` fornecido pelo usuário.
- Trilha e SFX: gerados no Magnific (Google Lyria 3 Pro / ElevenLabs SFX), `public/audio/raw`.
- Geografia: Natural Earth (domínio público) — países 50m/110m e área de Nagorno-Karabakh (disputed areas 10m).
- Fontes: Anton, Oswald, Fira Sans Condensed, Bebas Neue (Google Fonts, OFL).
- Ilustrações e texturas: autoria procedural deste projeto (PNGs de referência do usuário usados apenas como referência visual).

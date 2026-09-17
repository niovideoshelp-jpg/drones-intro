# Drones e defesa aérea — motion graphic (Remotion + GSAP)

1920×1080, 30 fps, fundo **transparente** para montagem no Filmora.

| Parte | Composição | Duração | Narração | Trilha/SFX |
| --- | --- | --- | --- | --- |
| Intro | `DronesIntro` | 177,4 s (5322 q.) | `public/audio/intro.mp3` | `scripts/mix.mjs` → `public/audio/mix.wav` |
| 2. The New Math of Air Warfare | `Part1` | 168,8 s (5064 q.) | `public/audio/part1.mp3` | `scripts/mix-p1.mjs` → `public/audio/p1-mix.wav` |
| 3. Por que um míssil tão caro | `Part2` | 151,6 s (4548 q.) | `public/audio/part2.mp3` | `scripts/mix-p2.mjs` → `public/audio/p2-mix.wav` |
| 4. As cinco camadas | `Part3` | 386,5 s (11610 q.) | `public/audio/part3.mp3` | `scripts/mix-p3.mjs` → `public/audio/p3-mix.wav` |

Renderizar: workflow `render.yml` (Actions) com `part=intro|part1|part2|part3` e `mode=review|final`. Cada parte é um arquivo próprio — a junção é feita no Filmora.

## Entregas (GitHub Release gerada pelo workflow `render.yml`, modo `final`)
- `<Parte>_alpha.webm` — VP9 com canal alfa + mix (Opus). Arquivo único por parte, importa direto no Filmora mantendo o fundo transparente.
- `<Parte>_audio_stems.zip` — `mix.wav`, `voice.wav`, `music.wav`, `sfx.wav` (48 kHz) para remixar no Filmora.
- `<Parte>_quicklook.mp4` — conferência rápida sobre fundo cinza.
- `VERIFY.txt` — prova de que o canal alfa sobreviveu ao encode (YMIN=0 no plano alfa).

Modo `review`: gera `<Parte>-review.mp4` (metade da resolução, fundo cinza) para aprovação e para o scan de quadros vazios/parados (`scripts/activity.mjs`).

## Editar
`npm ci` e `npm run dev` (Remotion Studio). Cada parte tem a composição transparente (`Part2`) e a de revisão em cinza (`Part2-preview`).

- `src/data/*-words.json` — tempo de cada palavra da narração (whisper.cpp small.en, onsets refinados por detecção de silêncio). **Toda animação e todo SFX usa estes tempos** via `at("palavra")`. Palavras repetidas exigem o segundo argumento (`at("guns", 301)`), senão a busca pega a primeira ocorrência e a cena inteira sai do lugar.
- `src/lib/geo.ts` — câmera única do mapa (globo ortográfico, zoom suave van Wijk) do Cáucaso à Ucrânia, globo, Oriente Médio.
- `src/scenes/*.tsx`, `src/p1/*`, `src/p2/*`, `src/p3/*` — cenas de cada parte.
- `src/art/*.tsx` — ilustrações SVG desenhadas à mão (drones, blindados, radar, lasers, micro-ondas, subestação, depósito, fábrica, comandante, relógio, balança…), com movimento contínuo (hélices, luzes, varredura).
- `src/lib/kf.ts` / `src/lib/useGsap.ts` — linhas do tempo GSAP (eases e timelines pausadas, busca determinística por quadro).
- `scripts/textures.mjs` — texturas procedurais (manchas, poeira, curvas de nível).
- `scripts/sfx-prep.mjs` — normaliza os SFX e mede o instante de impacto de cada arquivo.
- `scripts/mixlib.mjs` + `scripts/mix*.mjs` — agendam os SFX pelas palavras (impacto no quadro do evento), voz a −16 LUFS, trilha com ducking sob a voz, SFX ~19 LU abaixo da voz.
- `scripts/sync-check.mjs cues.json sfx.wav` — confere offline se o pico de cada SFX cai no tempo previsto.
- `scripts/stills.mjs 12.8 30.3 …` (`COMP=Part3-preview`) — quadros de revisão em `out/stills` + contact sheet.
- `scripts/activity.mjs <review.mp4>` — acusa segundos sem cobertura ou sem movimento.

## Recursos
- Narração: mp3 fornecidos pelo usuário.
- Trilha e SFX: gerados no Magnific (Google Lyria 3 Pro / ElevenLabs SFX), `public/audio/raw`. A trilha da parte 4 (`music_p3.mp3`, 407 s) é montada com crossfades a partir das três trilhas já geradas (Lyria vai só até 180 s).
- Geografia: Natural Earth (domínio público) — países 50m/110m e área de Nagorno-Karabakh (disputed areas 10m).
- Fontes: Anton, Oswald, Fira Sans Condensed, Bebas Neue (Google Fonts, OFL).
- Ilustrações e texturas: autoria procedural deste projeto (PNGs de referência do usuário usados apenas como referência visual).

---
title: Design tokens
description: W3C DTCG token files generated from the Figma variables.
---

The [`tokens/`](https://github.com/StanVisionAgency/atomus/tree/main/tokens) folder holds one **DTCG 2025.10** JSON file per collection and mode, plus `$themes.json` (which files make each theme) and `text-styles.tokens.json`.

| File | Contents |
| --- | --- |
| `primitives.tokens.json` | Colour ramps, alpha ramps, size scale |
| `brand.atomus.tokens.json`, `brand.violet.tokens.json` | Brand ramp per brand mode |
| `color.light.tokens.json`, `color.dark.tokens.json` | Semantic colours |
| `radius.default/sharp/round.tokens.json` | Corner scale per shape mode |
| `spacing-layout.desktop/tablet/mobile.tokens.json` | Spacing, layout, sizes, containers |
| `typography.desktop/tablet/mobile.tokens.json` | Families, weights, sizes, line heights |
| `effects.light/dark.tokens.json` | Shadow layers per elevation |
| `text-styles.tokens.json` | Composite typography tokens for every text style |

They import into Tokens Studio, Style Dictionary and Terrazzo. Token names map to the CSS names shown in Figma Dev Mode, for example `Text/text-primary` → `--color-text-primary`.

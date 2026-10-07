---
title: Figma file
description: How the Atomus 4.0 Figma file is organised and how to work with it.
---

The Figma file is the source of truth. Tokens, CSS, React and these docs are all generated from it.

## Pages

| Section | Pages |
| --- | --- |
| ⬢ Getting started, ⬢ Changelog | How to use the file; what changed in each version |
| ⬢ Foundations | Colors & typography, Atomus Icons |
| ⬢ Components | 28 pages: buttons, inputs, menus, navigation, tables, charts, modals, drawers, notifications, chat, shared assets, app examples |
| ⬢ Website sections | 10 pages: header, footer, hero, features, social proof, pricing, FAQ, CTA, blog, team, contact, careers, legal, auth, and 13 example pages |
| ⬢ Utility | Brand guidelines deck, UX research, persona, social media sizes, wireframes, device frames |

Every component page starts with a doc header and a **Usage** frame (anatomy, properties, do / don't).

## Variable collections

| Collection | Modes | Switches |
| --- | --- | --- |
| _Primitives | — | 23 colour ramps (25–950), alpha ramps, size scale |
| Brand | Atomus · Example — Violet · your brands | The brand ramp |
| Color | Light · Dark | Semantic roles: text, background, border, foreground |
| Radius | Default · Sharp · Round | Corner scale |
| Spacing & Layout | Desktop · Tablet · Mobile | Layout gaps, container, section padding |
| Typography | Desktop · Tablet · Mobile | Headline sizes and families |
| Effects | Light · Dark | Elevation shadows |

Every variable has scopes, a description and **code syntax**: Dev Mode shows the same CSS name developers use.

## How we work with it

- Duplicate the file per client project, rename it, set the brand mode and fonts, then design. Atomus stays a single file on purpose — teams run 10–20 projects at once and one file per project is easier than linked libraries.
- Set modes (Light/Dark, Brand, Radius, Desktop/Tablet/Mobile) on the top frame, never on single layers.
- Put custom content in slots instead of detaching instances.

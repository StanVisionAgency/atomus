# Input & Select

## Input

Text input. Label position Outside, Inside (floating) or Notched. Sizes 32/40/48 match Buttons.

Variants: 42

| Property | Type / options |
|---|---|
| Label | text |
| Show label | boolean (on) |
| Hint | text |
| Show hint | boolean (on) |
| Label position | Outside · Inside · Notched |
| Size | sm · md · lg |
| State | Default · Hover · Focused · Filled · Disabled · Error |

**Do**

- Always show a label; use Inside or Notched when space is tight.
- Use the hint for format help and Error for validation.
- Match the size to buttons in the same form.

**Don’t**

- Don’t use placeholder text as the label.
- Don’t show errors before the user has typed.
- Don’t make users retype a value after an error.

## Textarea

Multi-line text input.

Variants: 5

| Property | Type / options |
|---|---|
| Label | text |
| Value | text |
| Show hint | boolean (on) |
| State | Default · Focused · Filled · Disabled · Error |

## Select

Select trigger; pair with Dropdown menu for the open list.

Variants: 15

| Property | Type / options |
|---|---|
| Label | text |
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Default · Focused · Filled · Disabled · Error |

## Slider

Slider for a single value or a range.

Variants: 6

| Property | Type / options |
|---|---|
| Type | Single · Range |
| Label | None · Bottom · Floating |

## Verification code input

One-time code (OTP) input, 4 or 6 digits.

Variants: 24

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Digits | 4 · 6 |
| Size | sm · md · lg |
| State | Default · Filled · Focused · Error |

## Number input

Number counter with decrease/increase buttons.

Variants: 9

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Value | text |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Default · Focused · Disabled |

## Tags input

Input that turns entries into removable tags.

Variants: 6

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Default · Focused |

## Phone input

Phone number with country selector (flag + dial code).

Variants: 9

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Default · Focused · Error |

## Payment input

Card number, expiry and CVC in one field with the card brand mark.

Variants: 9

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Default · Focused · Error |

## Multi-select

Select with several values as tags; open state shows a searchable checkbox list.

Variants: 6

| Property | Type / options |
|---|---|
| Show label | boolean (on) |
| Show hint | boolean (on) |
| Size | sm · md · lg |
| State | Closed · Open |

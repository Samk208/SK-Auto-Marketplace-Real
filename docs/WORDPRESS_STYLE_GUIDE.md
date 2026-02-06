# LNMC WordPress Style Guide

This style guide is generated based on the visual audit of the current WordPress implementation (http://localhost:10010/). Use these standards when creating new components or refactoring existing ones to ensure consistency.

## 1. Color Palette

### Primary Colors

Used for main actions, active states, and key brand elements.

- **Deep Blue:** `#002868` (`rgb(0, 40, 104)`) - _Primary Text in Buttons, potential background_
- **Bright Blue:** `#0c71c3` (Observed in Divi defaults/Top Bar)

### Neutral Colors

Used for text, backgrounds, and borders.

- **Dark Black/Blue:** `#0e0c19` (`rgb(14, 12, 25)`) - _Primary Headings on Light Backgrounds_
- **Dark Grey:** `#3c3a47` (`rgb(60, 58, 71)`) - _Top Bar Text_
- **White:** `#ffffff` (`rgb(255, 255, 255)`) - _Headings on Dark Backgrounds, Button Text_
- **Off-White:** `rgba(255, 255, 255, 0.85)` - _Body Text on Dark Backgrounds_

---

## 2. Typography

### Headings

**Font Family:** "Playfair Display", Georgia, serif

| Element | Size | Weight | Color                  | Usage          |
| :------ | :--- | :----- | :--------------------- | :------------- |
| **H1**  | 56px | Bold   | White / Dark Black     | Page Heroes    |
| **H2**  | 40px | Bold   | Dark Black (`#0e0c19`) | Section Titles |
| **H3**  | 32px | Bold   | Varied                 | Card Titles    |

### Body Copy

**Font Family:** "Poppins", sans-serif (also "Source Sans Pro" in some areas)

| Element          | Size | Line Height | Color                 | Usage                        |
| :--------------- | :--- | :---------- | :-------------------- | :--------------------------- |
| **Body Large**   | 16px | 1.6         | Dark Grey             | Intro text, Lead paragraphs  |
| **Body Default** | 13px | 1.6         | Off-White / Dark Grey | Standard content, Navigation |
| **Caption**      | 12px | 1.5         | Light Grey            | Footer text, Meta info       |

---

## 3. UI Components

### Buttons

**Primary Button (.et_pb_button)**

- **Font:** Source Sans Pro, 13px
- **Text Color:** `#ffffff`
- **Background:** Transparent (often uses border or specific section bg)
- **Border Radius:** 25px
- **Padding:** 6px 12px

**Call to Action Button (.lnmc-hub-cta)**

- **Font:** Poppins, 16px
- **Text Color:** `#002868`
- **Background:** Transparent / White (context dependent)
- **Border Radius:** 5px
- **Padding:** 15px 40px

### Navigation (Top Bar)

- **Background:** `#0c71c3` (Blue) or `#ffffff` (Sticky)
- **Link Font:** Source Sans Pro, 13px
- **Link Color:** `#ffffff` (on Blue) / `#3c3a47` (on White)
- **Padding:** 12px 64px

### Spacing System

- **Section Padding:** Standard Divi spacing (often 54px top/bottom)
- **Module Margins:** 0px default, often using 30px bottom margin for spacing.

---

## 4. Shortcode & Plugin Guidelines

When working with `lnmc-community-partners` and `lnmc-member-hub`, ensure all output follows these classes:

- Wrap primary content in Divi-compatible containers if possible.
- Use `et_pb_module` class for wrappers to inherit global spacing.
- Use `et_pb_button` class for buttons to match the theme.

---

**Note:** This guide is inferred from the current running state. As we refactor, we should enforce these tokens in a centralized CSS file or Tailwind config if we move to a headless architecture.

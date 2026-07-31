# React UI Systems: Theme, Animations, Localization & Common Components

This document defines standards for component architecture, Motion (formerly Framer Motion) animations, Tailwind styling system, and i18n localization in React.

---

## 1. Reusable Generic Components (`@/components/common/`)

If a UI component is used in **more than 1 place**, it MUST live in `@/components/common/`.

| Component | Path | Description |
|-----------|------|-------------|
| **Typography** | `@/components/common/typography.tsx` | Enforces font scales, weights, and tag mappings |
| **CustomImage** | `@/components/common/image.tsx` | Lazy loaded image with Shimmer placeholder |
| **Button** | `@/components/common/button.tsx` | Accessible CTA button with loading states |
| **Input** | `@/components/common/input.tsx` | Form input with helper text & error styles |
| **AppLoader** | `@/components/common/app-loader.tsx` | Centralized loading spinner / skeleton |
| **ModalDialog** | `@/components/common/modal-dialog.tsx` | Accessible dialog powered by Radix / Framer Motion |

---

## 2. Motion (formerly Framer Motion) Entrance Animations

**Rule:** A static UI is unacceptable. Every new view or major modal MUST have smooth entrance animations.

### Standard Page Transition:
```tsx
import { motion } from 'motion/react';

export const fadeSlideVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeSlideVariant}>
      {children}
    </motion.div>
  );
}
```

### Staggered List Items Animation:
```tsx
export const listContainerVariant = {
  visible: { transition: { staggerChildren: 0.05 } },
};

export const listItemVariant = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};
```

---

## 3. Dark/Light Theme System with Tailwind CSS

1. **Semantic Color Tokens:** Always use CSS variable-backed Tailwind colors (`bg-background`, `text-foreground`, `border-border`, `bg-primary`).
2. **Dark Mode Classes:** Use `dark:` variant for custom overrides.
3. **No Raw Hex Values:** Never write inline styles or `#FFFFFF` hex values.

---

## 4. Internationalization & RTL Support (`@/locales/`)

- Support Arabic (`ar`) and English (`en`).
- Dynamically set document `dir` attribute (`ltr` or `rtl`) when locale changes.
- Append new translation keys at the end of JSON locale files (`public/locales/en/common.json`, `public/locales/ar/common.json`).

```typescript
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguageSetup() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
}
```

---

## 5. Specialized Skills Reference

> **For advanced animation patterns** (scroll-linked animations, orchestrated sequences, gesture interactions, AnimatePresence for mount/unmount), read the full skill at `react/framer-motion-animator/SKILL.md`.

> **For 3D scenes, WebGL, and react-three-fiber**, read `react/threejs-fundamentals/SKILL.md` first, then the specific sub-skill you need (animation, geometry, materials, shaders, etc.).

> **For intentional, premium UI/UX design** (avoiding generic AI aesthetics), read `react/frontend-design/SKILL.md`.

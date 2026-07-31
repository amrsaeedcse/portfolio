## 7. Constants, Theme & Utils
- **Local Storage:** Use `cacheHelper.ts` (wraps `@react-native-async-storage/async-storage` or `react-native-mmkv`) for read/write operations. ALL storage keys MUST be defined in `CacheKeys` (`src/core/storage/cacheKeys.ts`). Never define ad-hoc key strings inside a store or service.
- **App Constants:** `src/constants/appConstants.ts` for static app values (fonts, theme strings, client IDs).
- **Theme Colors:** `useAppTheme()` hook (in `src/core/theme/ThemeContext.tsx`) is a React Context providing theme-aware semantic colors.
  - Access colors in components via `const { colors } = useAppTheme()` (e.g., `colors.secondaryText`).
  - NEVER use raw hex/RGB values for UI elements that should adapt to dark/light mode. Always use `colors.*`.
  - When adding a new semantic color, add it to the `AppColors` type and register it in BOTH `lightTheme` and `darkTheme` objects.
- **Fonts & Locale:** `AppFonts.mainFontName` is a mutable module value that switches between `"Poppins"` (English) and `"Tajawal"` (Arabic) at runtime. When changing locale, always update `AppFonts.mainFontName` alongside `i18next.changeLanguage()`. `useLocaleStore().setLocale()` handles this automatically — do not set the font manually elsewhere.
- **Assets:** ALL asset paths/requires (images, SVGs, Lottie files) MUST be defined as `export const` fields in `AppAssets` (`src/core/resources/appAssets.ts`). Never hardcode `require('../../assets/...')` paths inline in component code.
- `utils/`: Contains `languageHelper.ts` and `errorTranslator.ts`. Use these for localization and user-friendly error messages.

## 9. Localization & Internationalization (`src/locales`)
- The app supports both Arabic (`ar.json`) and English (`en.json`) via `i18next` + `react-i18next`.
- **Rule:** When adding new keys/words for a new feature, append them to the bottom of the existing `.json` files. Do NOT modify or delete the existing keys, as they contain legacy translations that might be reused.

## 10. Responsive Sizing
- Use `react-native-size-matters` for ALL sizing values in the UI.
  - Font sizes: `moderateScale(X)`
  - Widths / Heights: `scale(X)` / `verticalScale(X)`
  - Border radii: `moderateScale(X)`
- The design canvas is **375×812 pt** (the library's default base — matches `iPhone X` guideline, no extra config needed).
- Never use raw pixel numbers for font sizes or layout dimensions.

## 11. UI & Screens Structure (`src/features` & `src/components/common`)
- Organize the `features` directory strictly by feature or screen name (e.g., `src/features/home/`, `src/features/auth/`).
- Inside each feature folder, create these sub-folders as needed:
  - `screens/`: Contains the main page layouts (e.g., `HomeScreen.tsx`).
  - `components/`: Contains reusable UI components specific to that feature (e.g., `HomeBanner.tsx`).
  - `store/` (or `hooks/`): If a Zustand store or custom hook is scoped ONLY to this feature (not global), place it here (e.g., `useCheckoutStore.ts`).
- **FILE DECOMPOSITION RULE:** If a Screen file grows large, extract UI sections into dedicated component files in the feature's `components/` folder. Never build a monolithic 500-line screen file. Each component file should do one thing.
- **Debouncing Rapid Actions (Timers):** For UI elements that users can spam rapidly (e.g., incrementing/decrementing cart quantities), you MUST implement a Debounce mechanism using `setTimeout`/`clearTimeout` (or a `useDebouncedCallback` hook) inside the component. Do not hammer the store/API on every single tap. Wait for the user to stop tapping (e.g., 500ms) before triggering the store action. (Normal single-tap actions like "Add new item" do not need debouncing).

- **NO REACT NATIVE DEFAULTS:** NEVER rely on RN's default `<Text>`/`<TouchableOpacity>` styling.
  - **Text:** NEVER use the standard `<Text>` component. ALWAYS use our `CustomText` component (`src/components/common/CustomText.tsx`). Explicitly pass size (via `moderateScale`), color (`colors.*`), and weight.
    - **Rule:** If `CustomText` does not exist in the project, you MUST create it:
      ```tsx
      import React from 'react';
      import { Text, TextStyle, TextProps } from 'react-native';
      import { moderateScale } from 'react-native-size-matters';
      import { AppFonts } from '@/core/theme/appFonts';
      import { useAppTheme } from '@/core/theme/ThemeContext';

      interface CustomTextProps extends TextProps {
        data: string;
        fontSize: number;
        fontWeight?: TextStyle['fontWeight'];
        fontFamily?: string;
        color?: string;
        maxLines?: number;
        lined?: boolean;
        decorationColor?: string;
      }

      export function CustomText({
        data,
        fontSize,
        fontWeight = '400',
        fontFamily,
        color,
        maxLines,
        lined = false,
        decorationColor,
        style,
        ...rest
      }: CustomTextProps) {
        const { colors } = useAppTheme();
        return (
          <Text
            numberOfLines={maxLines}
            ellipsizeMode={maxLines ? 'tail' : undefined}
            style={[
              {
                fontSize: moderateScale(fontSize),
                fontWeight,
                fontFamily: fontFamily ?? AppFonts.mainFontName,
                color: color ?? colors.primary,
                textDecorationLine: lined ? 'line-through' : 'none',
                textDecorationColor: decorationColor,
                textAlign: 'center',
              },
              style,
            ]}
            {...rest}
          >
            {data}
          </Text>
        );
      }
      ```

  - **Network Images:** NEVER use RN's `<Image source={{ uri }}>` directly for remote images. ALWAYS use the `CachedImage` component from `react-native-fast-image`. Create a shared wrapper widget at `src/components/common/CachedImage.tsx` if one does not exist, and use it everywhere.

  - **Screen Background:** Always explicitly set the root container's `backgroundColor: colors.surface`.
  - **Padding/Margins:** Never use magic numbers. Use explicit `react-native-size-matters` values (e.g., `padding: moderateScale(16)`).
  - **Hardcoded Strings in UI:** NEVER hardcode user-visible strings. ALL text shown to the user MUST come from `i18next` via `useTranslation()`'s `t('key')`.

## 12. Animations (MANDATORY — Always Animate UI)
- **Every new screen or significant component MUST have at least an entrance animation.** A static, motionless UI is NOT acceptable.

**Priority order (use the simplest tool that gets the job done):**

1. **`react-native-reanimated`'s Layout Animations (use FIRST):** For state-driven UI changes — always reach for these before anything else:
   - `LinearTransition` — animated layout changes on resize/reflow
   - `FadeIn` / `FadeOut` — mount/unmount transitions
   - `Layout` — expand/collapse height/width smoothly
   - `entering` / `exiting` props on `Animated.View` — self-explanatory

2. **`useSharedValue` + `useAnimatedStyle` (use for complex animations):** When you need precise control over curves, sequencing, or physics-based motion that layout animations can't handle.

3. **`moti` (use for entrance/decorative animations):** Great for one-shot entrance effects (fade-in, slide-in, shimmer) on components and list items — it's a declarative wrapper over Reanimated:
   ```tsx
   import { MotiView } from 'moti';

   <MotiView
     from={{ opacity: 0, translateY: 10 }}
     animate={{ opacity: 1, translateY: 0 }}
     transition={{ duration: 400 }}
   >
     <MyComponent />
   </MotiView>

   // Staggered list items:
   <MotiView
     from={{ opacity: 0, translateX: 10 }}
     animate={{ opacity: 1, translateX: 0 }}
     transition={{ delay: index * 80 }}
   >
     <ItemComponent />
   </MotiView>
   ```

**Rules:**
- Never use `moti` when you need sequencing with dependencies between components — use `useSharedValue`/`useAnimatedStyle` directly (Reanimated) instead.
- Never use raw Reanimated shared values for simple fades/slides that `moti` handles in one declarative block.

## 13. Data Typing & Interfaces (No Runtime Models / No `src/models/`)
- **NO RUNTIME MODELS IN REACT NATIVE:** Unlike Flutter/Dart where runtime model classes and companion `fromJson` / parser functions are common, in React Native with TypeScript we strictly avoid creating class models or companion parser functions in `src/models/`.
- **Use TypeScript Interfaces:** Define clean TypeScript interfaces or type aliases in `src/types/` (or alongside domain constants/stores). Benefit from TypeScript's structural typing for zero-overhead runtime passing.
- **API Boundary Validation:** When consuming raw REST/GraphQL APIs in the Repository layer, cast or validate the response payload directly against the TypeScript interface (e.g., `const data = response.data as MyInterface[]`). If strict runtime schema validation is explicitly required for external payloads, use a lightweight validation library like Zod or Yup rather than writing manual boilerplate parser classes.

---

## 14. Reusable Generic Components (`src/components/common`)

**Rule:** If a UI element (button, text field, card, dialog, image, etc.) is used in **more than one place** across the app, it MUST be extracted into a generic, reusable component in `src/components/common/`. Never duplicate component code across feature folders.

- **Identify candidates early:** Before writing a new UI component in a feature's `components/` folder, ask: *"Will this be needed elsewhere?"* If yes — build it generic from the start.
- **Generic = parameterized:** Accept all variable parts as props (text, color, callback, icon, etc.). Use sensible defaults where appropriate.
- **Naming convention:** Prefix with `Custom` or use a descriptive noun (e.g., `CustomButton`, `CustomTextField`, `CustomDialog`, `AppCard`).

**Common components that MUST always live in `src/components/common/` and never be duplicated:**

| Component | File | Notes |
|-----------|------|-------|
| Text | `CustomText.tsx` | Already established — always use it |
| Network Image | `CachedImage.tsx` | Wraps `react-native-fast-image` |
| Primary Button | `CustomButton.tsx` | Styled app-wide CTA button |
| Text Field | `CustomTextField.tsx` | Styled input with consistent decoration |
| Loading Indicator | `AppLoader.tsx` | Consistent spinner/shimmer across all screens |

**Example — CustomButton:**
```tsx
import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { CustomText } from './CustomText';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}

export function CustomButton({
  label,
  onPress,
  isLoading = false,
  icon,
  color,
  textColor,
  disabled = false,
}: CustomButtonProps) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={{
        backgroundColor: color ?? colors.primaryContainer,
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor ?? colors.onPrimary} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <View style={{ marginRight: scale(8) }}>{icon}</View>}
          <CustomText
            data={label}
            fontSize={14}
            fontWeight="600"
            color={textColor ?? colors.onPrimary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
```

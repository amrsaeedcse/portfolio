## 7. Constants, Theme & Utils
- **Local Storage:** Use `cache_helper.dart` for read/write operations. ALL SharedPreferences keys MUST be defined in `CacheKeys` (`lib/core/databases/cache_keys.dart`). Never define ad-hoc key strings inside Provider or Service classes.
- **App Constants:** `lib/constants/app_constants.dart` for static app values (fonts, theme strings, client IDs).
- **Theme Colors:** `AppColorTheme` (in `lib/core/theme/app_colors.dart`) is a `ThemeExtension` providing theme-aware semantic colors.
  - Access colors in widgets via `context.colors.<field>` (e.g., `context.colors.secondaryText`).
  - NEVER use raw `Colors.*` values for UI elements that should adapt to dark/light mode. Always use `context.colors.*`.
  - When adding a new semantic color, add it to `AppColorTheme` and register it in BOTH `AppThemes.lightTheme` and `AppThemes.darkTheme`.
- **Fonts & Locale:** `AppFonts.mainFontName` is a mutable static that switches between `"Poppins"` (English) and `"Tajawal"` (Arabic) at runtime. When changing locale, always update `AppFonts.mainFontName` alongside the `Locale` value. `LocaleProvider.setLocale()` handles this automatically — do not set the font manually elsewhere.
- **Assets:** ALL asset paths (images, SVGs, Lottie files) MUST be defined as `static const String` fields in `AppAssets` (`lib/core/resources/app_assets.dart`). Never hardcode asset path strings inline in widget code.
- `utils/`: Contains `language_helper.dart` and `error_translator.dart`. Use these for localization and user-friendly error messages.

## 9. Localization & Internationalization (`lib/l10n`)
- The app supports both Arabic (`app_ar.arb`) and English (`app_en.arb`).
- **Rule:** When adding new keys/words for a new feature, append them to the bottom of the existing `.arb` files. Do NOT modify or delete the existing keys, as they contain legacy translations that might be reused.

## 10. Responsive Sizing
- Use `flutter_screenutil` for ALL sizing values in the UI.
  - Font sizes: `X.sp`
  - Widths / Heights: `X.w` / `X.h`
  - Border radii: `X.r`
- The design canvas is **375×812 pt** (configured in `ScreenUtilInit` in `main.dart`).
- Never use raw `double` pixel values for font sizes or layout dimensions.

## 11. UI & Views Structure (`lib/views` & `lib/widgets/common`)
- Organize the `views` directory strictly by feature or view name (e.g., `lib/views/home/`, `lib/views/auth/`).
- Inside each feature folder, create these sub-folders as needed:
  - `screens/`: Contains the main page layouts (e.g., `home_screen.dart`).
  - `widgets/`: Contains reusable UI components specific to that feature (e.g., `home_banner_widget.dart`).
  - `cubits/` (or `controllers/`): If a Cubit/Bloc is scoped ONLY to this feature or screen (not global), place its files here (e.g., `home_cubit.dart`, `home_state.dart`).
- **FILE DECOMPOSITION RULE:** If a Screen file grows large, extract UI sections into dedicated widget files in the feature's `widgets/` folder. Never build a monolithic 500-line screen file. Each widget file should do one thing.
- **Debouncing Rapid Actions (Timers):** For UI elements that users can spam rapidly (e.g., incrementing/decrementing cart quantities), you MUST implement a Debounce mechanism using a `Timer` inside the Stateful Widget. Do not hammer the Cubit/API on every single tap. Wait for the user to stop tapping (e.g., 500ms) before triggering the Cubit action. (Normal single-tap actions like "Add new item" do not need debouncing).

- **NO FLUTTER DEFAULTS:** NEVER rely on Flutter's default Material theme values.
  - **Text:** NEVER use the standard `Text()` widget. ALWAYS use our `CustomText` widget (`lib/widgets/common/custom_text.dart`). Explicitly pass size (`.sp`), color (`context.colors.*`), and weight.
    - **Rule:** If `CustomText` does not exist in the project, you MUST create it:
      ```dart
      import 'package:flutter/material.dart';
      import 'package:downloader_app/core/theme/app_fonts.dart';

      class CustomText extends StatelessWidget {
        const CustomText({
          super.key,
          required this.data,
          required this.fontSize,
          this.fontWeight,
          this.fontFamily,
          this.textAlign,
          this.color,
          this.maxLines,
          this.forceStrutHeight = false,
          this.lined = false,
          this.decorationColor,
        });

        final String data;
        final double fontSize;
        final FontWeight? fontWeight;
        final String? fontFamily;
        final Color? color;
        final TextAlign? textAlign;
        final int? maxLines;
        final bool lined;
        final Color? decorationColor;
        final bool forceStrutHeight;

        @override
        Widget build(BuildContext context) {
          return Text(
            data,
            textAlign: textAlign ?? TextAlign.center,
            maxLines: maxLines,
            strutStyle: forceStrutHeight ? const StrutStyle(forceStrutHeight: true) : null,
            overflow: maxLines != null ? TextOverflow.ellipsis : null,
            style: TextStyle(
              decoration: lined ? TextDecoration.lineThrough : TextDecoration.none,
              decorationColor: decorationColor,
              fontSize: fontSize,
              fontWeight: fontWeight ?? FontWeight.normal,
              fontFamily: fontFamily ?? AppFonts.mainFontName,
              color: color ?? Theme.of(context).primaryColor,
            ),
          );
        }
      }
      ```

  - **Network Images:** NEVER use `Image.network()` directly. ALWAYS use the `CachedNetworkImage` widget from the `cached_network_image` package. Create a shared wrapper widget at `lib/widgets/common/cached_image.dart` if one does not exist, and use it everywhere.

  - **Scaffold:** Always explicitly set `backgroundColor: context.colors.surface`.
  - **Padding/Margins:** Never use default padding constants. Use explicit `flutter_screenutil` values (e.g., `EdgeInsets.all(16.r)`).
  - **Hardcoded Strings in UI:** NEVER hardcode user-visible strings. ALL text shown to the user MUST come from the `.arb` localization files via `AppLocalizations.of(context)!`.

## 12. Animations (MANDATORY — Always Animate UI)
- **Every new screen or significant widget MUST have at least an entrance animation.** A static, motionless UI is NOT acceptable.

**Priority order (use the simplest tool that gets the job done):**

1. **Flutter Built-in Implicit Animations (use FIRST):** For state-driven UI changes — always reach for these before anything else:
   - `AnimatedContainer` — animated color, size, padding, decoration
   - `AnimatedSwitcher` — transition between two widgets
   - `AnimatedSize` — expand/collapse height/width smoothly
   - `AnimatedOpacity`, `AnimatedPositioned`, `AnimatedAlign` — self-explanatory

2. **`AnimationController` + `Tween` (use for complex animations):** When you need precise control over curves, sequencing, or physics-based motion that built-ins can't handle.

3. **`flutter_animate` (use for entrance/decorative animations):** Great for one-shot entrance effects (fade-in, slide-in, shimmer) on widgets and list items:
   ```dart
   MyWidget().animate().fade(duration: 400.ms).slideY(begin: 0.1, end: 0, duration: 400.ms)
   // Staggered list items:
   ItemWidget().animate(delay: (index * 80).ms).fade().slideX()
   ```

**Rules:**
- Never use `flutter_animate` when you need sequencing with dependencies between widgets — use `AnimationController` instead.
- Never use `AnimationController` for simple fades/slides that `flutter_animate` handles in one line.


## 13. Models & Data Parsing (`lib/models`)
- **STRICT NULL SAFETY:** NEVER trust the backend API response. When writing `fromJson` factory constructors, you MUST handle potential `null` values for every single field to prevent parsing crashes.
- Always use the null-coalescing operator (`??`) to provide sensible defaults based on the data type:
  - Strings: `json['key'] ?? ''`
  - Integers/Doubles: `json['key'] ?? 0`
  - Booleans: `json['key'] ?? false`
  - Lists: `json['key'] ?? []`
- **Nested Objects/Lists:** For parsing lists or nested objects, explicitly check for null before mapping (e.g., `json['items'] != null ? List<String>.from(json['items']) : []`).

---

## 14. Reusable Generic Widgets (`lib/widgets/common`)

**Rule:** If a UI element (button, text field, card, dialog, image, etc.) is used in **more than one place** across the app, it MUST be extracted into a generic, reusable widget in `lib/widgets/common/`. Never duplicate widget code across feature folders.

- **Identify candidates early:** Before writing a new UI component in a feature's `widgets/` folder, ask: *"Will this be needed elsewhere?"* If yes — build it generic from the start.
- **Generic = parameterized:** Accept all variable parts as constructor parameters (text, color, callback, icon, etc.). Use sensible defaults where appropriate.
- **Naming convention:** Prefix with `Custom` or use a descriptive noun (e.g., `CustomButton`, `CustomTextField`, `CustomDialog`, `AppCard`).

**Common widgets that MUST always live in `lib/widgets/common/` and never be duplicated:**

| Widget | File | Notes |
|--------|------|-------|
| Text | `custom_text.dart` | Already established — always use it |
| Network Image | `cached_image.dart` | Wraps `CachedNetworkImage` |
| Primary Button | `custom_button.dart` | Styled app-wide CTA button |
| Text Field | `custom_text_field.dart` | Styled input with consistent decoration |
| Loading Indicator | `app_loader.dart` | Consistent spinner/shimmer across all screens |

**Example — CustomButton:**
```dart
class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    required this.label,
    required this.onTap,
    this.isLoading = false,
    this.icon,
    this.color,
    this.textColor,
  });

  final String label;
  final VoidCallback? onTap;
  final bool isLoading;
  final IconData? icon;
  final Color? color;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ElevatedButton(
      onPressed: isLoading ? null : onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? colors.primaryContainer,
        foregroundColor: textColor ?? colors.onPrimary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
        padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 14.h),
      ),
      child: isLoading
          ? SizedBox(width: 20.r, height: 20.r, child: CircularProgressIndicator(strokeWidth: 2, color: textColor ?? colors.onPrimary))
          : Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (icon != null) ...[Icon(icon, size: 18.r), SizedBox(width: 8.w)],
                CustomText(data: label, fontSize: 14.sp, fontWeight: FontWeight.w600, color: textColor ?? colors.onPrimary),
              ],
            ),
    );
  }
}
```

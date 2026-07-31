# ⚠️ NON-NEGOTIABLE RULES — READ THESE FIRST, ALWAYS FOLLOW

These are the rules most commonly violated. Before writing any code, confirm you are following ALL of them:

| # | Rule | Detail |
|---|------|--------|
| 1 | **Never use `Text()`** | ALWAYS use `CustomText` from `lib/widgets/common/custom_text.dart` |
| 2 | **Never use `Image.network()`** | ALWAYS use `CachedNetworkImage` (wrap in `lib/widgets/common/cached_image.dart`) |
| 3 | **Never hardcode strings in UI** | ALL user-visible text MUST come from `.arb` l10n files |
| 4 | **Never hardcode tab indices** | Use `AppNavIndices.home`, `AppNavIndices.history`, etc. — never `0`, `1`, `3` |
| 5 | **Never hardcode route strings** | Use `AppRoutes.kHome`, `AppRoutes.kAnalysis`, etc. |
| 6 | **Every screen/widget MUST animate** | Use built-ins first → AnimationController → flutter_animate |
| 7 | **Split large screens into widgets** | Screens > 200 lines → extract to `featureName/widgets/` folder |
| 8 | **Shared widgets go to `widgets/common/`** | If used in 2+ places → make generic and move there |
| 9 | **Update TASKS.md + MEMORY.md** | After EVERY completed task — not optional |
| 10 | **Never use `Navigator.push()`** | ALWAYS use `context.go()` or `context.pushNamed()` from go_router |
| 11 | **Error keys → `context.translateError()`** | NEVER show raw backend error strings to the user |
| 12 | **Services → `GetIt.I<Service>()`** | NEVER instantiate services manually with `MyService()` |
| 13 | **Sizes → flutter_screenutil** | `.sp` for fonts, `.w`/`.h` for layout, `.r` for radius — never raw doubles |
| 14 | **Colors → `context.colors.*`** | NEVER use raw `Colors.red`, `Colors.white`, etc. in UI |
| 15 | **Debug Logging** | Wrap all `print()` calls with `if (kDebugMode)`. Prefer `debugPrint()` |

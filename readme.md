# @vuduc0801/react-native-bottom-sheet

Imperative `BottomSheetProvider` / `useBottomSheet()` wrapper around [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet) v5.

## Installation

`@gorhom/bottom-sheet`, `react-native-reanimated` and `react-native-gesture-handler` are **peer dependencies** (so your app controls their versions):

```bash
npm install @vuduc0801/react-native-bottom-sheet @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
```

Wrap your app (inside `GestureHandlerRootView`):

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetProvider } from '@vuduc0801/react-native-bottom-sheet'

<GestureHandlerRootView style={{ flex: 1 }}>
  <BottomSheetProvider>{children}</BottomSheetProvider>
</GestureHandlerRootView>
```

## API

### Provider defaults and handle colors

Use `defaultOptions` to configure all sheets. These defaults also apply to registered components opened with `context.open()`.
Each call to `expand()` or `context.open()` can override them. Style properties are merged, with per-sheet values taking precedence.
Changing the provider defaults updates an already open sheet, for example when switching themes.

```tsx
<BottomSheetProvider
  defaultOptions={{
    backgroundStyle: { backgroundColor: '#101116' },
    handleStyle: { backgroundColor: '#101116', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    handleIndicatorStyle: { backgroundColor: '#FFFFFF' },
  }}
>
  {children}
</BottomSheetProvider>
```

`handleStyle` controls the area behind the drag handle; `handleIndicatorStyle` controls the small bar itself.
Both can also be set directly in `expand({ handleStyle, handleIndicatorStyle, children })`.

### Horizontal content

The sheet pan gesture defaults to `activeOffsetY: [-10, 10]` and `failOffsetX: [-10, 10]` so horizontal swipes can go to the content.
Use the gesture-handler-backed horizontal components inside the sheet, especially on Android. Keep their width constrained by the sheet;
use `contentContainerStyle` for spacing between cards. No fixed content height is required for dynamic sizing.

```tsx
import { BottomSheetHorizontalScrollView, useBottomSheet } from '@vuduc0801/react-native-bottom-sheet'

const sheet = useBottomSheet()

sheet.expand({
  children: (
    <BottomSheetHorizontalScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingVertical: 20 }}
    >
      {tiers.map(tier => <TierCard key={tier.id} tier={tier} />)}
    </BottomSheetHorizontalScrollView>
  ),
})
```

For virtualized lists, use `BottomSheetHorizontalFlatList` with `data` and `renderItem`; item types and list refs are preserved.
Both components always scroll horizontally and default to `nestedScrollEnabled` and `disallowInterruption`.
For a custom gesture setup, override `activeOffsetY` / `failOffsetX` in the provider defaults or individual sheet options.
See [Gorhom's gesture troubleshooting](https://gorhom.dev/react-native-bottom-sheet/troubleshooting).

`useBottomSheet()` returns:

| Method | Description |
| --- | --- |
| `expand(options)` | Presents the sheet. `options` = `{ children } & BottomSheetProps` from @gorhom (e.g. `snapPoints`, `enableDynamicSizing`, `onDismiss`, `backgroundStyle`…). `enableDynamicSizing` defaults to `true`. |
| `collapse()` | Dismisses the sheet. |
| `context.open({ name, inputProps, options? })` | Presents a component registered via `<BottomSheetProvider components={{ name: <Comp /> }}>`, cloned with `inputProps`. |

## Changelog

- **3.1.0** – Added provider-wide `defaultOptions` (including handle/background colors), merged per-sheet styles, horizontal-friendly pan defaults, and gesture-handler-backed `BottomSheetHorizontalScrollView` / `BottomSheetHorizontalFlatList` with forwarded refs.
- **3.0.0** – `@gorhom/bottom-sheet` (>=5), `react-native-reanimated` (>=3.16) and `react-native-gesture-handler` (>=2.16.1) moved to peer dependencies; removed unused `react-native-safe-area-context` dependency; all `BottomSheetProps` passed to `expand()` are forwarded to the sheet; context value is memoized; build runs automatically on `npm pack`/`publish`.
- **2.0.0** – @gorhom/bottom-sheet v5, React 19.

# Bottom Sheet Usage Documentation

This document explains how the bottom sheet is integrated and utilized within the `Select` component in the project. It covers configuration, expansion, and item selection logic.

## Table of Contents

- [Introduction](#introduction)
- [Component Overview](#component-overview)
- [Bottom Sheet Integration](#bottom-sheet-integration)
- [Item Selection Flow](#item-selection-flow)
- [Conclusion](#conclusion)

## Introduction

The bottom sheet is a UI element that slides up from the bottom of the screen to display additional content. In the `Select` component, it is used to show a list of selectable items when the user interacts with the component.

## Component Overview

The `Select` component is responsible for:
- Displaying a label and current selection (or placeholder text).
- Launching the bottom sheet when the user taps on the component.
- Rendering a list of items in the bottom sheet.
- Handling item selection and collapsing the bottom sheet once an option is chosen.

## Bottom Sheet Integration

Inside the `Select` component, the `useBottomSheet` hook is imported from `@vuduc0801/react-native-bottom-sheet` and used for controlling the bottom sheet behavior.

### Expanding the Bottom Sheet

When the `TouchableOpacity` is pressed, the `handleOpen` function is invoked. This function expands the bottom sheet with dynamic sizing enabled and renders the bottom sheet content:

```tsx
bottomSheet.expand({
  enableDynamicSizing: true,
  children: (
    <YStack style={[a.gap_3, { paddingBottom: insets.bottom }]}>
      <View style={[a.px_4]}>
        <Text style={[a.text_lg, a.font_semibold]}>{label}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <SelectItem
            key={item.value}
            item={item}
            selected={item.value === selectedValue?.value}
            onSelect={handleSelectItem}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  ),
});

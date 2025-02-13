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
import React, { forwardRef } from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList, type NativeViewGestureHandlerProps } from 'react-native-gesture-handler'

export type BottomSheetHorizontalFlatListProps<ItemT> = Omit<FlatListProps<ItemT>, 'horizontal' | 'renderScrollComponent'>
  & NativeViewGestureHandlerProps

function HorizontalFlatList<ItemT>(
  props: BottomSheetHorizontalFlatListProps<ItemT>,
  ref: React.ForwardedRef<FlatList<ItemT>>,
) {
  return <FlatList nestedScrollEnabled disallowInterruption {...props} horizontal ref={ref} />
}

const ForwardedHorizontalFlatList = forwardRef(HorizontalFlatList)
ForwardedHorizontalFlatList.displayName = 'BottomSheetHorizontalFlatList'

export const BottomSheetHorizontalFlatList = ForwardedHorizontalFlatList as <ItemT>(
  props: BottomSheetHorizontalFlatListProps<ItemT> & React.RefAttributes<FlatList<ItemT>>,
) => React.ReactElement | null

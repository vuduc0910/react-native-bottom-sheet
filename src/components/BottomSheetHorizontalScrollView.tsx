import React, { forwardRef } from 'react'
import type { ScrollView as NativeScrollView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export type BottomSheetHorizontalScrollViewProps = Omit<React.ComponentPropsWithoutRef<typeof ScrollView>, 'horizontal'>

export const BottomSheetHorizontalScrollView = forwardRef<NativeScrollView, BottomSheetHorizontalScrollViewProps>(
  (props, ref) => (
    <ScrollView nestedScrollEnabled disallowInterruption {...props} horizontal ref={ref} />
  ),
)

BottomSheetHorizontalScrollView.displayName = 'BottomSheetHorizontalScrollView'

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  type BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { cloneElement, createContext, useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'

export type BottomSheetOptions = {
  children: React.ReactNode
} & Omit<BottomSheetProps, 'children'>

const DEFAULT_OPTIONS: BottomSheetOptions = {
  children: null,
  enableDynamicSizing: true,
}

export type BottomSheetContextOptions = {
  name: string
  inputProps: Record<string, unknown>
  options?: Partial<BottomSheetOptions>
}

export type BottomSheetProviderProps = {
  children: React.ReactNode
  components?: Record<string, React.ReactNode>
}

export type BottomSheetContextValue = {
  expand: (options: BottomSheetOptions) => void
  collapse: () => void
  context: {
    open: (opts: BottomSheetContextOptions) => void
  }
}

export const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(undefined)

const styles = StyleSheet.create({
  content: {
    flex: 0,
    minHeight: 10,
  },
})

export function BottomSheetProvider({ children, components }: BottomSheetProviderProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [options, setOptions] = useState<BottomSheetOptions>(DEFAULT_OPTIONS)

  const expand = useCallback((opts: BottomSheetOptions) => {
    setOptions({ ...DEFAULT_OPTIONS, ...opts })
    bottomSheetModalRef.current?.present()
  }, [])

  const collapse = useCallback(() => {
    bottomSheetModalRef.current?.dismiss()
  }, [])

  const open = useCallback(
    (opts: BottomSheetContextOptions) => {
      const component = components?.[opts.name]
      const clonedElement =
        component && React.isValidElement(component)
          ? cloneElement(component as React.ReactElement<{ inputProps: Record<string, unknown> }>, {
              inputProps: opts.inputProps,
            })
          : undefined

      setOptions({ ...DEFAULT_OPTIONS, ...(opts.options ?? {}), children: clonedElement })
      bottomSheetModalRef.current?.present()
    },
    [components],
  )

  const value = useMemo<BottomSheetContextValue>(
    () => ({ expand, collapse, context: { open } }),
    [expand, collapse, open],
  )

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  )

  const { children: content, index: _index, ...sheetProps } = options

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} backdropComponent={renderBackdrop} {...sheetProps}>
          <BottomSheetView style={styles.content}>{content}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  )
}

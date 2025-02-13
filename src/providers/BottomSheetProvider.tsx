import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  type BottomSheetProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { cloneElement, createContext, useCallback, useRef, useState } from 'react'

type BottomSheetOptions = {
  children: React.ReactNode
} & Omit<BottomSheetProps, 'children'>

const DEFAULT_OPTIONS: BottomSheetOptions = {
  index: -1,
  children: null,
  enableDynamicSizing: true,
}

type BottomSheetContextOptions = {
  name: string
  inputProps: Record<string, unknown>
  options?: BottomSheetOptions
}

type BottomSheetProviderContext = {
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

export function BottomSheetProvider({ children, components }: BottomSheetProviderContext) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [options, setOptions] = useState<BottomSheetOptions | null>(DEFAULT_OPTIONS)

  const bottomSheetContext: BottomSheetContextValue = {
    expand: (opts: BottomSheetOptions) => {
      bottomSheetModalRef.current?.present()
      setOptions({ ...DEFAULT_OPTIONS, ...opts })
    },
    collapse: () => {
      bottomSheetModalRef.current?.dismiss()
    },
    context: {
      open: (opts: BottomSheetContextOptions) => {
        bottomSheetModalRef.current?.present()
        const component = components?.[opts.name]
        const clonedElement =
          component && React.isValidElement(component)
            ? cloneElement(component as React.ReactElement<{ inputProps: Record<string, unknown> }>, {
                inputProps: opts.inputProps,
              })
            : undefined

        // bottomSheetModalRef.current?.present()
        setOptions({ ...DEFAULT_OPTIONS, ...(opts.options || {}), ...{ children: clonedElement } })
      },
    },
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  )

  return (
    <BottomSheetContext.Provider value={bottomSheetContext}>
      {children}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={options?.snapPoints}
          enableDynamicSizing={options?.enableDynamicSizing}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={{ flex: 0, minHeight: 10 }}>{options?.children}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  )
}

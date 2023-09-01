import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { Stack } from 'tamagui'
import type { FlashListProps, ListRenderItemInfo } from '@shopify/flash-list'

export function VirtualList<T>(props: FlashListProps<T>): React.ReactNode {
  // TODO: there are more FlashListProps that should be omitted here...
  const {
    data,
    estimatedItemSize,
    renderItem,
    onScroll,
    scrollEventThrottle,
    ...scrollableNodeProps
  } = props
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: data?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize || 100,
  })

  return (
    <Stack
      ref={parentRef as any}
      overflow="scroll"
      {...scrollableNodeProps}
      onScroll={(e) => {
        if (!e.target['getBoundingClientRect']) {
          return
        }
        const target = e.target as HTMLDivElement
        const bb = target.getBoundingClientRect()
        const scrollViewEvent = {
          ...e,
          currentTarget: target.scrollTop,
          target: target.scrollTop,
          nativeEvent: {
            contentInset: {
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
            },
            contentOffset: {
              x: target.scrollLeft,
              y: target.scrollTop,
            },
            contentSize: {
              width: target.scrollWidth,
              height: target.scrollHeight,
            },
            layoutMeasurement: {
              width: bb.width,
              height: bb.height,
            },
            zoomScale: 1,
          },
        }
        onScroll?.(scrollViewEvent)
      }}
    >
      {/* Extra div so the inner element is affected by Stack flexbox */}
      <div>
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem?.(data![virtualItem.index] as ListRenderItemInfo<T>)}
            </div>
          ))}
        </div>
      </div>
    </Stack>
  )
}

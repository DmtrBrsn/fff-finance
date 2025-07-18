import {
	Button,
	GridList as AriaGridList,
	GridListItem as AriaGridListItem,
	GridListItemProps,
	GridListProps
} from 'react-aria-components'

import {Checkbox} from '../checkbox/checkbox'

export function GridList<T extends object>(
  { children, ...props }: GridListProps<T>
) {
  return (
    (
      <AriaGridList {...props}>
        {children}
      </AriaGridList>
    )
  )
}

export function GridListItem({ children, ...props }: GridListItemProps) {
  let textValue = typeof children === 'string' ? children : undefined
  return (
    (
      <AriaGridListItem textValue={textValue} {...props}>
        {({ selectionMode, selectionBehavior, allowsDragging }) => (
          //@ts-ignore
          <>
            {/* Add elements for drag and drop and selection. */}
            {allowsDragging && <Button slot="drag">≡</Button>}
            {selectionMode === 'multiple' && selectionBehavior === 'toggle' && (
              <Checkbox slot="selection" />
            )}
            {children}
          </>
        )}
      </AriaGridListItem>
    )
  )
}
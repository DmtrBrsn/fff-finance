import {
  Label,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagGroupProps as AriaTagGroupProps,
  TagList,
  TagListProps,
  TagProps,
  Text,
  Button
} from 'react-aria-components'

export interface TagGroupProps<T>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: string
  description?: string
  errorMessage?: string
  tagListClassName?: string
}

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    tagListClassName,
    ...props
  }: TagGroupProps<T>
) {
  return (
    (
      <AriaTagGroup {...props}>
        <Label>{label}</Label>
        <TagList
          className={'react-aria-TagList' + (tagListClassName ? ' ' + tagListClassName : '')}
          items={items}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </TagList>
        {description && <Text slot="description">{description}</Text>}
        {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
      </AriaTagGroup>
    )
  );
}

export function Tag({ children, ...props }: TagProps) {
  let textValue = typeof children === 'string' ? children : undefined;
  return (
    (
      <AriaTag textValue={textValue} {...props}>
        {({ allowsRemoving }) => (
          //@ts-ignore
          <>
            {children}
            {allowsRemoving && <Button slot="remove">✖</Button>}
          </>
        )}
      </AriaTag>
    )
  );
}

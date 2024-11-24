import { Category, useCategoriesAdd, useCategoriesDelete, useCategoriesGet, useCategoriesUpdate } from "@entities/categories"
import { Button, Checkbox, DialogCloseBtn, GridList, GridListItem, MenuButtonIcon, MenuItem, TextField } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { FormEvent, useMemo, useState } from "react"
import { Dialog, DialogTrigger, Form, Heading, Modal, useDragAndDrop } from "react-aria-components"

export const CatGrids = () => {
  const { data: categories, isFetching: catsFetching } = useCategoriesGet()

  const exp = useMemo(() => categories?.filter(cat => !cat.isIncome), [categories])
  const inc = useMemo(() => categories?.filter(cat => cat.isIncome), [categories])

  return (
    <div className="flex-col gap-3 pad-1 align-start">
      <CatAddBtn />
      <div className="flex-row gap-3 wrap">
        <CatGrid isIncome={false} cats={exp || []} fetching={catsFetching} />
        <CatGrid isIncome={true} cats={inc || []} fetching={catsFetching} />
      </div>
    </div>
  )
}

const CatGrid = (
  { isIncome, cats, fetching }:
    { isIncome: boolean, cats: Category[], fetching: boolean }
) => {

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ 'text/plain': cats.find(c => c.id === key)?.id! })),
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        console.log(e)
      } else if (e.target.dropPosition === 'after') {
        console.log(e)
      }
    }
  })

  return (
    <div className="flex-col gap-1">
      <Heading>{isIncome ? 'Income' : 'Expense'}</Heading>
      <GridList
        dragAndDropHooks={dragAndDropHooks}
        aria-label={isIncome ? 'Expense' : 'Income'}
        renderEmptyState={() => fetching ? 'Loading' : 'No data'}
        selectionMode="multiple"
        items={cats}
      >
        {(item) => <GridListItem textValue={item.name}>{item.name} <CatMenuBtn cat={item} /></GridListItem>}
      </GridList>
    </div>
  )
}

const CatMenuBtn = ({ cat }: { cat: Category }) => {
  const [isOpen, setOpen] = useState(false)
  const { mutate: del } = useCategoriesDelete()

  return (
    <>
      <MenuButtonIcon>
        <MenuItem onAction={() => setOpen(true)}>Edit</MenuItem>
        <MenuItem onAction={() => del(cat.id)}>Delete</MenuItem>
      </MenuButtonIcon>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={() => setOpen(false)} />
          <Heading slot="title">Edit category</Heading>
          <CatForm
            cat={cat}
            mode="edit"
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </Dialog>
      </Modal>
    </>
  )
}

const CatAddBtn = () => {
  return (
    <DialogTrigger>
      <Button><CreateIcon />Add category</Button>
      <Modal>
        <Dialog>
          {({ close }) => (
            <>
              <DialogCloseBtn close={close} />
              <Heading slot="title">New category</Heading>
              <CatForm mode="add" onSuccess={close} onCancel={close} />
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}

const CatForm = (
  { mode, cat, onSuccess, onCancel }:
    { mode: 'add' | 'edit', isIncome?: boolean, cat?: Category, onSuccess?: () => void, onCancel?: () => void }
) => {
  const { mutateAsync: add, isPending: adding } = useCategoriesAdd()
  const { mutateAsync: update, isPending: updating } = useCategoriesUpdate()

  const [values, setValues] = useState({
    name: cat?.name ?? '',
    isIncome: cat?.isIncome ?? false
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (values.name === '' || (mode === 'edit' && cat === undefined)) return
    if (mode === 'add') {
      await add({
        name: values.name,
        isIncome: values.isIncome,
        created: DateUtils.getCurIsoStr()
      })
    }
    else {
      await update({
        id: cat!.id,
        name: values.name,
        isIncome: values.isIncome
      })
    }
    onSuccess?.()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label='Name'
        name="catName"
        value={values.name}
        onChange={(name) => setValues({ ...values, name })}
        isRequired
      />
      <Checkbox
        isSelected={values.isIncome}
        onChange={(e) => setValues({ ...values, isIncome: e })}
      >
        Income
      </Checkbox>
      <span className="flex-row gap-1">
        <Button type="submit" variant="attention" isDisabled={adding || updating}>{mode === 'add' ? 'Add' : 'Update'}</Button>
        <Button type="button" onPress={onCancel}>Cancel</Button>
      </span>
    </Form>
  )
}

import { DialogCloseBtn, GridList, GridListItem, MenuButtonIcon, MenuItem } from "@shared/react-aria"
import { useState } from "react"
import { Dialog, Heading, Modal, useDragAndDrop } from "react-aria-components"
import { useCategoriesBatchUpdate, useCategoriesDelete } from "../../api"
import { Category, CatUtils } from "../../lib"
import { CatForm } from "../categories-form"
import './cat-grid.css'

export const CatGrid = (
  { isIncome, cats, fetching }:
    { isIncome: boolean, cats: Category[], fetching: boolean }
) => {
  const { mutateAsync } = useCategoriesBatchUpdate()
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ 'text/plain': cats.find(c => c.id === key)?.id! })),
    onReorder(e) {
      const updDocs = CatUtils.getDndReorderedCatUpdDocs(cats, e)
      updDocs.length > 0 && mutateAsync(updDocs)
    }
  })

  return (
    <div className="flex-col gap-1 cat-grid">
      <Heading>{CatUtils.getIncExpStr({ isIncome })}</Heading>
      <GridList
        dragAndDropHooks={dragAndDropHooks}
        aria-label={CatUtils.getIncExpStr({ isIncome })}
        renderEmptyState={() => fetching ? 'Loading' : 'No data'}
        selectionMode="single"
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





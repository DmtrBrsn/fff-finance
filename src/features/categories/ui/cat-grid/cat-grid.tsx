import { isTouchDevice } from "@shared/lib/utils"
import { DialogCloseBtn, GridList, GridListItem, MenuButtonIcon, MenuItem } from "@shared/ui/react-aria"
import { useMemo, useState } from "react"
import { Dialog, Heading, Modal, useDragAndDrop } from "react-aria-components"
import { useNavigate } from "react-router-dom"
import { useCategoriesBatchUpdate, useCategoriesDelete } from "../../api"
import { Category, CatUtils } from "../../lib"
import { CatForm } from "../cat-form"
import './cat-grid.css'
import { ConfirmDialog } from "@shared/ui/confirm-dialog"

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
  const [delConfirmOpen, setDelConfirmOpen] = useState(false)
  const isTouch = useMemo(() => isTouchDevice(), [])
  const navigate = useNavigate()

  const editBtnAction = () => {
    isTouch ? navigate(`/categories/${cat.id}`) : setOpen(true)
  }
  const close = () => setOpen(false)

  return (
    <>
      <MenuButtonIcon>
        <MenuItem onAction={editBtnAction}>Edit</MenuItem>
        <MenuItem onAction={() => setDelConfirmOpen(true)}>Delete</MenuItem>
      </MenuButtonIcon>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={close} />
          <Heading slot="title">Category editing</Heading>
          <CatForm
            cat={cat}
            mode="edit"
            onSuccess={close} onCancel={close}
          />
        </Dialog>
      </Modal>

      <ConfirmDialog
        title="Delete category?"
        isOpen={delConfirmOpen}
        setOpen={setDelConfirmOpen}
        onConfirm={() => del(cat.id)}
      />
    </>
  )
}

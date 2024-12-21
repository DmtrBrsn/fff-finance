import { MenuButtonIcon, DialogCloseBtn, GridListItem, GridList, MenuItem, Button } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { useMemo, useState } from "react"
import { useCategoriesGet, useCategoriesBatchUpdate, useCategoriesDelete } from "../api"
import { Category, getDndReorderedCatUpdDocs, getIncExpStr } from "../lib"
import { CatForm } from "./categories-form"
import { Dialog, DialogTrigger, Heading, Modal, useDragAndDrop } from "react-aria-components"


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
  const { mutateAsync } = useCategoriesBatchUpdate()

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ 'text/plain': cats.find(c => c.id === key)?.id! })),
    onReorder(e) {
      const updDocs = getDndReorderedCatUpdDocs(cats, e)
      updDocs.length>0 && mutateAsync(updDocs)
    }
  })

  return (
    <div className="flex-col gap-1">
      <Heading>{getIncExpStr({ isIncome })}</Heading>
      <GridList
        dragAndDropHooks={dragAndDropHooks}
        aria-label={getIncExpStr({ isIncome })}
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



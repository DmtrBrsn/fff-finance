import { ConditionalModal } from "@shared/conditional-modal"
import { ButtonIcon } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { useState } from "react"
import { NewOperationForm } from "./operation-form/new-operation-form"

export const OpAddBtn = () => {
  const [isOpen, setOpen] = useState(false)
  
  return (
    <>
      <ButtonIcon onPress={() => setOpen(true)}><CreateIcon /></ButtonIcon>
      <ConditionalModal
        title="New operation"
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <NewOperationForm />
      </ConditionalModal>
    </>
  )
}

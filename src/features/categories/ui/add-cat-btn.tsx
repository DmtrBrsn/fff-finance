import { ConditionalModalBtn } from "@shared/conditional-modal"
import { CreateIcon } from "@shared/svg"
import { CatForm } from "./categories-form"

export const CatAddBtn = () => {
  return (
    <ConditionalModalBtn
      title="New category"
      buttonProps={{
        children: <><CreateIcon />Add category</>
      }}
    >
      <CatForm mode="add" />
    </ConditionalModalBtn>
  )
}

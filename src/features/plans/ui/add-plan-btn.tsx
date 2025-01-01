import { ConditionalModalBtn } from "@shared/conditional-modal"
import { CreateIcon } from "@shared/svg"
import { PlanForm } from "./plan-form"

export const PlanAddBtn = () => {
  return (
    <ConditionalModalBtn
      title="Create plan"
      buttonProps={{
        children: <><CreateIcon />Create plan</>
      }}
    >
      <PlanForm mode="add" />
    </ConditionalModalBtn>
  )
}

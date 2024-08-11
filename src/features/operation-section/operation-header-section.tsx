import { FlCell, FlHeader } from "@shared/fl-list"

export const OperationHeaderSection = () => {
  return (
    <FlHeader className="op-section header">
      <FlCell className="op-date">Date</FlCell>
      <FlCell className="op-sum">Sum</FlCell>
      <FlCell className="op-description">Description</FlCell>
      <FlCell className="op-category">Category</FlCell>
      <FlCell className="op-is-income">Is income</FlCell>
      <FlCell className="op-is-plan">Is plan</FlCell>
      <FlCell className="op-date">Created</FlCell>
      <FlCell className="op-buttons">Действия</FlCell>
    </FlHeader>
  )
}

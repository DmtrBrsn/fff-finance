export const operators = ['+', '-', '*', '/'] as const
export type Operator = typeof operators[number]

export type Id = string

export type Add<T> = Omit<T, "id">
export type Upd<T> = Partial<T> & { id: Id }

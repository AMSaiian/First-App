import { ChangeParameter } from "./change-parameter";

export interface Change {
  id: number,
  typeName: string,
  time: Date,
  parameters: ChangeParameter[]
}

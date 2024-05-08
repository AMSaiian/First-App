import { ChangeParameter } from "./change-parameter";

export interface Change {
  typeName: string,
  time: Date,
  parameters: ChangeParameter[]
}

import { type ModelObjectType, ModelSize } from "../types"

export enum UserRole {
  GUEST = "GUEST",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

const model: ModelObjectType = {
  type: "object",
  properties: {
    id: { type: "string", required: true },
    name: { type: "string", size: ModelSize.MEDIUM, required: true },
    email: {
      type: "string",
      size: ModelSize.MEDIUM,
      required: true,
    },
    role: {
      type: "string",
      size: ModelSize.SMALL,
      required: true,
      enum: Object.values(UserRole),
    },
  },
}

export default { model }

export interface UserProps {
  id: string
  name: string
  email: string
  role: UserRole
}

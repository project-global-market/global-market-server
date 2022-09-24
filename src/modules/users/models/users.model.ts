import { E_AuthType } from 'models/app'

export interface I_CreateUser {
  email: string
  username: string
  hash: string
  from: E_AuthType
}

export type T_UpdatePassword = {
  email: string
  hash: string
}

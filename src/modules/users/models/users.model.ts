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

export interface I_User {
  id: number
  username: string
  role: string
  verified: boolean
  email: string
  updated_at: Date
  created_at: Date
  from: string
}

export type T_UserDelete = {
  userId: number
  message: string
}

import { T_Tokens } from './tokens.model'

export interface I_SignIn {
  tokens: T_Tokens
  id: number
  email: string
  username: string
  role: string
  message: string
}

export type T_CheckAuth = Omit<I_SignIn, 'tokens'>

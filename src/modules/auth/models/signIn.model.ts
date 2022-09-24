import { T_Tokens } from './tokens.model'

export interface I_SignIn {
  tokens: T_Tokens
  id: number
  email: string
  username: string
  message: string
}

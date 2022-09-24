import { T_Tokens } from './tokens.model'

export interface I_SignUp {
  tokens: T_Tokens
  id: number
  email: string
  username: string
  message: string
}

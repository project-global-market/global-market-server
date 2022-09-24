import { Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { I_SignUp } from './models'
import { SignUpDto } from './dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created account.',
  })
  signUp(@Body() dto: SignUpDto): Promise<I_SignUp> {
    return this.authService.signUp(dto)
  }
}

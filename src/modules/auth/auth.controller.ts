import { Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { I_SignIn, I_SignUp, T_CheckAuth } from './models'
import { T_Tokens } from './models/tokens.model'
import { SignInDto, SignUpDto } from './dto'
import { Request } from 'express'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signUp(@Body() dto: SignUpDto): Promise<I_SignUp> {
    return this.authService.signUp(dto)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signIn(@Body() dto: SignInDto): Promise<I_SignIn> {
    return this.authService.signIn(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check success',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  checkAuthorization(@Req() req: Request): Promise<T_CheckAuth> {
    const user = req.user
    return this.authService.checkAuthorization(user['sub'])
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  refreshToken(@Req() req: Request): Promise<T_Tokens> {
    const user = req.user
    return this.authService.refreshToken(user['email'], user['refreshToken'])
  }
}

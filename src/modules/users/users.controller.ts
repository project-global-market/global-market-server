import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { CreateUserDto, UpdateUserDto } from './dto'
import { I_User, T_UserDelete } from './models/users.model'
import { UsersService } from './users.service'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getAllUsers(@Req() req: Request): Promise<I_User[]> {
    const user = req.user
    return this.usersService.getAllUsersSecured(user['email'])
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getUser(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<I_User> {
    const user = req.user
    return this.usersService.getUserSecured(userId, user['email'])
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createUser(@Req() req: Request, @Body() dto: CreateUserDto): Promise<I_User> {
    const user = req.user
    return this.usersService.createUserSecure(user['email'], dto)
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateUser(
    @Param('userId') userId: string,
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<I_User> {
    const user = req.user
    return this.usersService.updateUserSecure(userId, dto, user['email'])
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteUser(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<T_UserDelete> {
    const user = req.user
    return this.usersService.deleteUserSecure(user['email'], userId)
  }
}

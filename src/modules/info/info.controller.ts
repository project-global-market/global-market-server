import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { InfoService } from './info.service'

import { I_User } from 'modules/users/models/users.model'
import { Request } from 'express'

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('info')
@ApiTags('Info')
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data fetched',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getMyInfo(@Req() req: Request): Promise<I_User> {
    const user = req.user
    return this.infoService.getMyInfo(Number(user['sub']))
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/role.guard';
import { userRole } from 'src/enum/role.enum';
import { Roles } from 'src/guard/role';

@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() payload,@Req() req:Request, @Res()res:Response) {
    return await this.userService.login(payload, req, res);
    
  }

  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(userRole.admin, userRole.manager)
  findAll() {
    return this.userService.getAllUser()
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req:Request, @Res() res: Response) {
    return await this.userService.logout(req, res);
  }
}
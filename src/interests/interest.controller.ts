import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('interests')
@ApiTags('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new interest' })
  async create(@Body() createInterestDto: any, @Req() req: Request) {
    const user = req.user as any;
    return this.interestsService.create({
      ...createInterestDto,
      userId: user.userId,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all interests (admin only)' })
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.interestsService.findAll();
  }

  @Get('my-interests')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user\'s interests' })
  async findByUser(@Req() req: Request) {
    return this.interestsService.findByUser(req.user.userId);
  }

  @Get(':id
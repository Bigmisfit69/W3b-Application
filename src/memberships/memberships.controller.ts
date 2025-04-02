import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('memberships')
@ApiTags('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new membership' })
  async create(@Body() createMembershipDto: any, @Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.membershipsService.create(createMembershipDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all memberships (admin only)' })
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.membershipsService.findAll();
  }

  @Get('my-memberships')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user\'s memberships' })
  async findByUser(@Req() req: Request) {
    return this.membershipsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get membership by ID' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.membershipsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update membership' })
  async update(@Param('id') id: string, @Body() updateMembershipDto: any, @Req() req: Request) {
    const user = req.user as any;
    if (user.role !== 'ADMIN') {
      throw new Error('Unauthorized
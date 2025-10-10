import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import type { DeleteResponse } from '@/shared/interfaces'

import { Profile } from './entities/profile.entity'
import { CreateProfileDto, UpdateProfileDto } from './dto'
import { ProfilesService } from './profiles.service'

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The profile has been successfully created.',
    type: Profile
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async create(
    @Body() createProfileDto: CreateProfileDto
  ): Promise<Partial<Profile>> {
    try {
      return await this.profilesService.create(createProfileDto)
    } catch (error) {
      throw error
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all profiles.',
    type: [Profile]
  })
  async findAll(): Promise<Partial<Profile>[]> {
    try {
      return await this.profilesService.findAll()
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return a single profile.',
    type: Profile
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<Profile> | undefined> {
    try {
      return await this.profilesService.findOne(id)
    } catch (error) {
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The profile has been successfully updated.',
    type: Profile
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Partial<Profile>> {
    try {
      return await this.profilesService.update(id, updateProfileDto)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The profile has been successfully deleted.',
    type: Object
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.'
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteResponse> {
    try {
      return await this.profilesService.remove(id)
    } catch (error) {
      throw error
    }
  }

  @Patch(':id/recover')
  @ApiOperation({ summary: 'Recover profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The profile has been successfully recovered.',
    type: Profile
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.'
  })
  async recover(@Param('id', ParseUUIDPipe) id: string): Promise<Profile> {
    try {
      return await this.profilesService.recover(id)
    } catch (error) {
      throw error
    }
  }
}

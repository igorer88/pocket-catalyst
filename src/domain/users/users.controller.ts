import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common'

import { UpdateProfileDto } from '@/domain/profiles/dto'
import type { ProfileWithDeserializedSettings } from '@/domain/profiles/types'
import type { DeleteResponse } from '@/shared/interfaces'

import { User } from './entities/user.entity'
import { UserSecurity } from './entities/user-security.entity'
import {
  CreateUserDto,
  SetRolesDto,
  UpdateUserDto,
  UpdateUserSecurityDto
} from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private logger = new Logger(this.constructor.name)

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    return await this.usersService.create(createUserDto)
  }

  @Get()
  async findAll(): Promise<{ users: Partial<User>[] }> {
    try {
      const users = await this.usersService.findAll()
      return { users }
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<User>> {
    return await this.usersService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Partial<User>> {
    return await this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteResponse> {
    return await this.usersService.remove(id)
  }

  @Patch(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return await this.usersService.recover(id)
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  async setRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setRolesDto: SetRolesDto
  ): Promise<Partial<User>> {
    const { roleIds } = setRolesDto

    return await this.usersService.setRoles(id, roleIds)
  }

  @Get(':id/profile')
  async getProfile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ProfileWithDeserializedSettings> {
    return await this.usersService.getProfile(id)
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<ProfileWithDeserializedSettings> {
    return await this.usersService.updateProfile(id, updateProfileDto)
  }

  @Delete(':id/profile')
  async deleteProfile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteResponse> {
    return await this.usersService.deleteProfile(id)
  }

  @Patch(':id/profile/recover')
  async recoverProfile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ProfileWithDeserializedSettings> {
    return await this.usersService.recoverProfile(id)
  }

  @Get(':id/security')
  async getUserSecurity(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<UserSecurity>> {
    return await this.usersService.findUserSecurity(id)
  }

  @Patch(':id/security')
  async updateUserSecurity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserSecurityDto: UpdateUserSecurityDto
  ): Promise<Partial<UserSecurity>> {
    return await this.usersService.updateUserSecurity(id, updateUserSecurityDto)
  }
}

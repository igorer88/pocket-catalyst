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
import { Profile } from '@/domain/profiles/entities/profile.entity'
import { ProfilesService } from '@/domain/profiles/profiles.service'
import type { ProfileWithDeserializedSettings } from '@/domain/profiles/types'
import { UpdateUserSecurityDto } from '@/domain/user-security/dto'
import { UserSecurity } from '@/domain/user-security/entities/user-security.entity'
import { UserSecurityService } from '@/domain/user-security/user-security.service'

import { User } from './entities/user.entity'
import { CreateUserDto, SetRolesDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private logger = new Logger(this.constructor.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly userSecurityService: UserSecurityService,
    private readonly profilesService: ProfilesService
  ) {}

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
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Partial<User>> {
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
    return await this.profilesService.findProfileByUserId(id)
  }

  @Patch(':id/profile')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<ProfileWithDeserializedSettings> {
    return await this.profilesService.updateProfileByUserId(
      id,
      updateProfileDto
    )
  }

  @Delete(':id/profile')
  async deleteProfile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<Profile>> {
    return await this.profilesService.deleteProfileByUserId(id)
  }

  @Patch(':id/profile/recover')
  async recoverProfile(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ProfileWithDeserializedSettings> {
    return await this.profilesService.recoverProfileByUserId(id)
  }

  @Get(':id/security')
  async getUserSecurity(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<UserSecurity>> {
    return await this.userSecurityService.findUserSecurity(id)
  }

  @Patch(':id/security')
  async updateUserSecurity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserSecurityDto: UpdateUserSecurityDto
  ): Promise<Partial<UserSecurity>> {
    return await this.userSecurityService.updateUserSecurity(
      id,
      updateUserSecurityDto
    )
  }
}

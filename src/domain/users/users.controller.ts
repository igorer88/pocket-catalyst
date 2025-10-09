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

import { User } from './entities/user.entity'
import { CreateUserDto, SetRolesDto, UpdateUserDto } from './dto'
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
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.usersService.remove(id)
  }

  @Get(':id/recover')
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
}

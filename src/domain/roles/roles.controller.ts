import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common'

import { CreateRoleDto, UpdateRoleDto } from './dto'
import type { Role } from './entities'
import { RolesService } from './roles.service'

@Controller('roles')
export class RolesController {
  private logger = new Logger(this.constructor.name)

  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Partial<Role>> {
    return await this.rolesService.create(createRoleDto)
  }

  @Get()
  async findAll(): Promise<unknown> {
    try {
      const roles = await this.rolesService.findAll()
      return { roles }
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Partial<Role>> {
    return await this.rolesService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<Partial<Role>> {
    return await this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<Partial<Role>> {
    return await this.rolesService.remove(id)
  }

  @Patch(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: string): Promise<unknown> {
    return await this.rolesService.recover(id)
  }
}

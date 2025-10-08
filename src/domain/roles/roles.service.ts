import { Injectable, Logger, NotFoundException } from '@nestjs/common'

import { CreateRoleDto, UpdateRoleDto } from './dto'
import { Role } from './entities'
import { RolesRepository } from './roles.repository'

@Injectable()
export class RolesService {
  private logger = new Logger(this.constructor.name)
  context = {
    class: this.constructor.name
  }

  constructor(private roleRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<Partial<Role>> {
    try {
      const savedRole = await this.roleRepository.createRole(createRoleDto)

      return savedRole
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<Partial<Role>[]> {
    try {
      const roles: Role[] = await this.roleRepository.findBy({})

      return roles
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<Partial<Role>> {
    try {
      const role: Role = await this.roleRepository.findOneBy({ id })

      if (!role) {
        throw new NotFoundException(`Role ${id} not found`)
      }

      return role
    } catch (error) {
      throw error
    }
  }

  async update(id: string, roleDto: UpdateRoleDto): Promise<Partial<Role>> {
    try {
      return await this.roleRepository.updateRole(id, roleDto)
    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const role = await this.findOne(id)
      await this.roleRepository.softRemove(role)

      return `Role removed: ${role.id}`
    } catch (error) {
      throw error
    }
  }

  async recover(id: string): Promise<unknown> {
    try {
      const role = await this.roleRepository.findOne({ where: { id }, withDeleted: true })
      if (!role) {
        throw new NotFoundException(`Role with ID "${id}" not found or already recovered.`)
      }
      return await this.roleRepository.recover(role)
    } catch (error) {
      throw error
    }
  }
}

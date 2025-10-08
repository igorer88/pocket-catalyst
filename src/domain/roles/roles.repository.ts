import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { CreateRoleDto } from './dto'
import { Role } from './entities'
import { RoleTypes } from './enums'

@Injectable()
export class RolesRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  public async createRole({
    name,
    description
  }: CreateRoleDto): Promise<Role | null> {
    try {
      return await this.repository.save({ name, description })
    } catch (error) {
      //  checkDatabaseConstraintErrors(error)

      throw error
    }
  }

  public async findDefaultRole(): Promise<Role> {
    try {
      return await this.repository.findOneBy({ name: RoleTypes.USER })
    } catch (error) {
      throw error
    }
  }

  public async findRolesByIds(ids: string[]): Promise<Role[]> {
    try {
      return await this.repository.findBy({ id: In(ids) })
    } catch (error) {
      throw error
    }
  }

  public async updateRole(id: string, roleDto: Partial<Role>): Promise<Role> {
    try {
      await this.repository.update(id, roleDto)
      return this.findOne({ where: { id } })
    } catch (error) {
      throw error
    }
  }
}

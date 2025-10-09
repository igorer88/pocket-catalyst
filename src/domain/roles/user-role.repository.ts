import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserRole } from './entities/user-role.entity'

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private repository: Repository<UserRole>
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  public async createUserRole(
    userId: string,
    roleId: string
  ): Promise<UserRole> {
    try {
      return await this.repository.save({ userId, roleId })
    } catch (error) {
      throw error
    }
  }

  public async deleteUserRolesByUserId(userId: string): Promise<void> {
    try {
      await this.repository.delete({ userId })
    } catch (error) {
      throw error
    }
  }

  public async findUserRolesByUserId(userId: string): Promise<UserRole[]> {
    try {
      return await this.repository.find({
        where: { userId },
        relations: ['role']
      })
    } catch (error) {
      throw error
    }
  }
}

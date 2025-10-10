import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '@/domain/users/entities/user.entity'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } })
  }

  public async createUser(userDto: Partial<User>): Promise<User | null> {
    try {
      return await this.repository.save(userDto)
    } catch (error) {
      //  checkDatabaseConstraintErrors(error)

      throw error
    }
  }

  public async updateUser(id: string, userDto: Partial<User>): Promise<User> {
    try {
      await this.repository.update(id, userDto)
      return this.findOne({ where: { id } })
    } catch (error) {
      throw error
    }
  }

  public async findUserWithRoles(id: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role']
    })

    return user
  }

  public async findAllUsersWithRoles(): Promise<User[]> {
    const users = await this.repository.find({
      relations: ['userRoles', 'userRoles.role']
    })
    return users
  }
}

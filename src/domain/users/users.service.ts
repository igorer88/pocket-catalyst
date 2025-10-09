import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'

import { RoleRepository } from '@/domain/roles/roles.repository'
import { UserRoleRepository } from '@/domain/roles/user-role.repository'

import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
import { UserSecurityRepository } from './repositories/user-security.repository'
import { CreateUserDto, UpdateUserDto } from './dto'

@Injectable()
export class UsersService {
  private logger = new Logger(this.constructor.name)
  context = {
    class: this.constructor.name
  }

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSecurityRepository: UserSecurityRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    if (createUserDto.password !== createUserDto.passwordConfirmed) {
      throw new BadRequestException('Passwords do not match')
    }

    const passwordHash = await this.userSecurityRepository.hashPassword(
      createUserDto.password
    )

    const user = await this.userRepository.createUser({
      email: createUserDto.email,
      passwordHash,
      isActive: true
    })

    // Return a partial user without sensitive information
    const { passwordHash: _, ...result } = user
    return result
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find()
    return users.map(user => {
      const { passwordHash: _passwordHash, ...result } = user
      return result
    })
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }
    const { passwordHash: _passwordHash, ...result } = user
    return result
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }

    const { password, passwordConfirmed, ...updateData } = updateUserDto

    const data: Partial<User> = { ...updateData }

    if (password) {
      if (password !== passwordConfirmed) {
        throw new BadRequestException('Passwords do not match')
      }
      data.passwordHash =
        await this.userSecurityRepository.hashPassword(password)
    }

    const updatedUser = await this.userRepository.updateUser(id, data)
    const { passwordHash: _passwordHash, ...result } = updatedUser
    return result
  }

  async remove(id: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }
    await this.userRepository.softRemove(user)

    return `User removed: ${user.id}`
  }

  async recover(id: string): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        withDeleted: true
      })
      if (!user) {
        throw new NotFoundException(
          `User with ID '${id}' not found or already recovered.`
        )
      }
      const recoveredUser = await this.userRepository.recover(user)
      const { passwordHash: _passwordHash, ...result } = recoveredUser
      return result
    } catch (error) {
      throw error
    }
  }

  async setRoles(userId: string, roleIds: string[]): Promise<Partial<User>> {
    try {
      // Verify user exists
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (!user) {
        throw new NotFoundException(`User with ID '${userId}' not found`)
      }

      // Verify all roles exist
      const roles = await this.roleRepository.findRolesByIds(roleIds)
      if (roles.length !== roleIds.length) {
        throw new NotFoundException('One or more roles not found')
      }

      // Remove existing user roles
      await this.userRoleRepository.deleteUserRolesByUserId(userId)

      // Create new user roles
      const userRolePromises = roleIds.map(roleId =>
        this.userRoleRepository.createUserRole(userId, roleId)
      )
      await Promise.all(userRolePromises)

      // Return updated user without sensitive information
      const updatedUser = await this.findOne(userId)
      return updatedUser
    } catch (error) {
      throw error
    }
  }
}

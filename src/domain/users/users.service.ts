import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import { defaultProfileExtraSettings, Defaults } from '@/config'
import { ProfileRepository } from '@/domain/profiles/profiles.repository'
import { RoleRepository } from '@/domain/roles/roles.repository'
import { UserRoleRepository } from '@/domain/roles/user-role.repository'
import { UserSecurityRepository } from '@/domain/user-security/repositories/user-security.repository'

import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
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
    private readonly userRoleRepository: UserRoleRepository,
    private readonly profileRepository: ProfileRepository
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

    // Initialize roles for new user
    user.roles = []

    // Create profile for the user with default values
    const profile = this.profileRepository.create({
      user,
      locale: Defaults.Locale,
      displayCurrency: Defaults.DisplayCurrency,
      extraSettings: JSON.stringify(defaultProfileExtraSettings)
    })
    await this.profileRepository.save(profile)

    // Create security settings for the user
    const security = this.userSecurityRepository.create({ user })
    await this.userSecurityRepository.save(security)

    // Return a partial user without sensitive information
    return plainToInstance(User, user)
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.findAllUsersWithRoles()
    return users.map(user => plainToInstance(User, user))
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findUserWithRoles(id)
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }
    return plainToInstance(User, user)
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
    return plainToInstance(User, updatedUser)
  }

  async remove(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }
    await this.userRepository.softRemove(user)

    // Return the soft-deleted user with deletedAt
    const deletedUser = await this.userRepository.findOne({
      where: { id },
      withDeleted: true
    })

    return {
      ...plainToInstance(User, deletedUser),
      deletedAt: deletedUser.deletedAt
    }
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
      return plainToInstance(User, recoveredUser)
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
      const updatedUser = await this.userRepository.findUserWithRoles(userId)
      return plainToInstance(User, updatedUser)
    } catch (error) {
      throw error
    }
  }
}

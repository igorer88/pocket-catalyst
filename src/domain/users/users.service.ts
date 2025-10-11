import {
  BadRequestException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { defaultProfileExtraSettings, Defaults } from '@/config'
import { ProfileRepository } from '@/domain/profiles/profiles.repository'
import { ProfilesService } from '@/domain/profiles/profiles.service'
import type {
  ProfileUpdateData,
  ProfileWithDeserializedSettings
} from '@/domain/profiles/types'
import { RoleRepository } from '@/domain/roles/roles.repository'
import { UserRoleRepository } from '@/domain/roles/user-role.repository'
import type { DeleteResponse } from '@/shared/interfaces'

import { User } from './entities/user.entity'
import { UserSecurity } from './entities/user-security.entity'
import { UserRepository } from './repositories/user.repository'
import { UserSecurityRepository } from './repositories/user-security.repository'
import { CreateUserDto, UpdateUserDto, UpdateUserSecurityDto } from './dto'

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
    private readonly profileRepository: ProfileRepository,
    private readonly profilesService: ProfilesService
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

  async remove(id: string): Promise<DeleteResponse> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`)
    }
    await this.userRepository.softRemove(user)

    return {
      statusCode: 200,
      message: 'User deleted successfully',
      resource: `users/${id}`,
      deleted: true,
      timestamp: new Date().toISOString()
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

  async getProfile(userId: string): Promise<ProfileWithDeserializedSettings> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile']
      })
      if (!user || !user.profile) {
        throw new NotFoundException(
          `User or profile with ID '${userId}' not found`
        )
      }

      return await this.profilesService.findProfile(user.profile.id)
    } catch (error) {
      throw error
    }
  }

  async updateProfile(
    userId: string,
    updateData: ProfileUpdateData
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile']
      })
      if (!user || !user.profile) {
        throw new NotFoundException(
          `User or profile with ID '${userId}' not found`
        )
      }

      return await this.profilesService.updateProfile(
        user.profile.id,
        updateData
      )
    } catch (error) {
      throw error
    }
  }

  async deleteProfile(userId: string): Promise<DeleteResponse> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (!user) {
        throw new NotFoundException(`User with ID '${userId}' not found`)
      }

      // Check if profile is already deleted
      const deletedProfile =
        await this.profileRepository.findDeletedProfileByUserId(userId)
      if (deletedProfile) {
        throw new GoneException(
          `Profile for user '${userId}' is already deleted`
        )
      }

      // Check if active profile exists
      const activeProfile =
        await this.profileRepository.findActiveProfileByUserId(userId)
      if (!activeProfile) {
        throw new NotFoundException(`Profile for user '${userId}' not found`)
      }

      await this.profilesService.remove(activeProfile.id)

      return {
        statusCode: 200,
        message: 'Profile deleted successfully',
        resource: `users/${userId}/profile`,
        deleted: true,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw error
    }
  }

  async recoverProfile(
    userId: string
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (!user) {
        throw new NotFoundException(`User with ID '${userId}' not found`)
      }

      const deletedProfile =
        await this.profileRepository.findDeletedProfileByUserId(userId)

      if (!deletedProfile) {
        throw new NotFoundException(
          `No deleted profile found for user '${userId}'`
        )
      }

      const recoveredProfile = await this.profilesService.recover(
        deletedProfile.id
      )

      return {
        ...recoveredProfile,
        extraSettings: JSON.parse(recoveredProfile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }

  async findUserSecurity(userId: string): Promise<Partial<UserSecurity>> {
    // First, ensure the user exists.
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`)
    }

    let security = await this.userSecurityRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    })

    if (!security) {
      // This case should ideally not happen if user creation is robust
      // But as a safeguard, we can create a default security record
      const newSecurity = this.userSecurityRepository.create({ user })
      await this.userSecurityRepository.save(newSecurity)
      // Reload to get the relation
      security = await this.userSecurityRepository.findOne({
        where: { id: newSecurity.id },
        relations: ['user']
      })
    }

    return instanceToPlain(security) as Partial<UserSecurity>
  }

  async updateUserSecurity(
    userId: string,
    updateUserSecurityDto: UpdateUserSecurityDto
  ): Promise<Partial<UserSecurity>> {
    // First, ensure the user exists.
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`)
    }

    let security = await this.userSecurityRepository.findOne({
      where: { user: { id: userId } }
    })

    if (!security) {
      // Create if it doesn't exist
      security = this.userSecurityRepository.create({ user })
    }

    Object.assign(security, updateUserSecurityDto)

    const updatedSecurity = await this.userSecurityRepository.save(security)

    // We need to reload it to get the user relation for the getter
    const reloadedSecurity = await this.userSecurityRepository.findOne({
      where: { id: updatedSecurity.id },
      relations: ['user']
    })

    return instanceToPlain(reloadedSecurity) as Partial<UserSecurity>
  }
}

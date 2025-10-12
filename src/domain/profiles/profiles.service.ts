import { GoneException, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import { Profile } from '@/domain/profiles/entities/profile.entity'
import { ProfileRepository } from '@/domain/profiles/profiles.repository'
import type {
  ProfileUpdateData,
  ProfileWithDeserializedSettings
} from '@/domain/profiles/types'
import type { DeleteResponse } from '@/shared/interfaces'

import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async create(createProfileDto: CreateProfileDto): Promise<Partial<Profile>> {
    try {
      const profileData: Partial<Profile> = {
        ...createProfileDto,
        extraSettings: createProfileDto.extraSettings
          ? JSON.stringify(createProfileDto.extraSettings)
          : undefined
      }
      const profile = await this.profileRepository.createProfile(profileData)
      return plainToInstance(Profile, profile)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<Partial<Profile>[]> {
    try {
      const profiles = await this.profileRepository.find()
      return plainToInstance(Profile, profiles)
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<Partial<Profile>> {
    try {
      const profile = await this.profileRepository.findOne({ where: { id } })
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${id} not found`)
      }
      return plainToInstance(Profile, profile)
    } catch (error) {
      throw error
    }
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<Partial<Profile>> {
    try {
      const profile = await this.findOne(id)
      const { extraSettings, ...otherData } = updateProfileDto
      const updateData: Partial<Profile> = { ...otherData }
      if (extraSettings !== undefined) {
        updateData.extraSettings = JSON.stringify(extraSettings)
      }
      await this.profileRepository.update(id, updateData)
      const updatedProfile = { ...profile, ...updateData } as Profile
      return plainToInstance(Profile, updatedProfile)
    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<DeleteResponse> {
    try {
      // Check if profile is already deleted
      const deletedProfile =
        await this.profileRepository.findDeletedProfileById(id)
      if (deletedProfile) {
        throw new GoneException(`Profile with ID ${id} is already deleted`)
      }

      // Check if active profile exists
      const activeProfile =
        await this.profileRepository.findActiveProfileById(id)
      if (!activeProfile) {
        throw new NotFoundException(`Profile with ID ${id} not found`)
      }

      await this.profileRepository.softDelete(id)

      return {
        statusCode: 200,
        message: 'Profile deleted successfully',
        resource: `profiles/${id}`,
        deleted: true,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw error
    }
  }

  async recover(id: string): Promise<Profile> {
    try {
      // Find deleted profile
      const deletedProfile =
        await this.profileRepository.findDeletedProfileById(id)
      if (!deletedProfile) {
        throw new NotFoundException(`Profile with ID ${id} not found`)
      }

      await this.profileRepository.restore(id)
      return plainToInstance(Profile, deletedProfile)
    } catch (error) {
      throw error
    }
  }

  async findProfile(id: string): Promise<ProfileWithDeserializedSettings> {
    try {
      const profile = await this.profileRepository.findProfile(id)
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${id} not found`)
      }
      return {
        ...plainToInstance(Profile, profile),
        extraSettings: JSON.parse(profile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }

  async updateProfile(
    id: string,
    updateData: ProfileUpdateData
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const updatedProfile = await this.profileRepository.updateProfile(
        id,
        updateData
      )
      return {
        ...plainToInstance(Profile, updatedProfile),
        extraSettings: JSON.parse(updatedProfile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }

  async findProfileByUserId(
    userId: string
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const profile =
        await this.profileRepository.findActiveProfileByUserId(userId)
      if (!profile) {
        throw new NotFoundException(`Profile for user ID ${userId} not found`)
      }
      return {
        ...plainToInstance(Profile, profile),
        extraSettings: JSON.parse(profile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }

  async updateProfileByUserId(
    userId: string,
    updateData: ProfileUpdateData
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const profile =
        await this.profileRepository.findActiveProfileByUserId(userId)
      if (!profile) {
        throw new NotFoundException(`Profile for user ID ${userId} not found`)
      }

      const updatedProfile = await this.profileRepository.updateProfile(
        profile.id,
        updateData
      )
      return {
        ...plainToInstance(Profile, updatedProfile),
        extraSettings: JSON.parse(updatedProfile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }

  async deleteProfileByUserId(userId: string): Promise<DeleteResponse> {
    try {
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

      await this.profileRepository.softDelete(activeProfile.id)

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

  async recoverProfileByUserId(
    userId: string
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      const deletedProfile =
        await this.profileRepository.findDeletedProfileByUserId(userId)

      if (!deletedProfile) {
        throw new NotFoundException(
          `No deleted profile found for user '${userId}'`
        )
      }

      await this.profileRepository.restore(deletedProfile.id)
      const recoveredProfile = await this.profileRepository.findOne({
        where: { id: deletedProfile.id }
      })

      return {
        ...plainToInstance(Profile, recoveredProfile),
        extraSettings: JSON.parse(recoveredProfile.extraSettings)
      }
    } catch (error) {
      throw error
    }
  }
}

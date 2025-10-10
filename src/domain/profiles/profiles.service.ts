import { GoneException, Injectable, NotFoundException } from '@nestjs/common'

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

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      const profileData: Partial<Profile> = {
        ...createProfileDto,
        extraSettings: createProfileDto.extraSettings
          ? JSON.stringify(createProfileDto.extraSettings)
          : undefined
      }
      return await this.profileRepository.createProfile(profileData)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<Profile[]> {
    try {
      return await this.profileRepository.find()
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOne({ where: { id } })
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${id} not found`)
      }
      return profile
    } catch (error) {
      throw error
    }
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    try {
      const profile = await this.findOne(id)
      const { extraSettings, ...otherData } = updateProfileDto
      const updateData: Partial<Profile> = { ...otherData }
      if (extraSettings !== undefined) {
        updateData.extraSettings = JSON.stringify(extraSettings)
      }
      await this.profileRepository.update(id, updateData)
      return { ...profile, ...updateData } as Profile
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
      return deletedProfile
    } catch (error) {
      throw error
    }
  }

  async findProfile(id: string): Promise<ProfileWithDeserializedSettings> {
    try {
      return (await this.profileRepository.findProfile(
        id
      )) as unknown as ProfileWithDeserializedSettings
    } catch (error) {
      throw error
    }
  }

  async updateProfile(
    id: string,
    updateData: ProfileUpdateData
  ): Promise<ProfileWithDeserializedSettings> {
    try {
      return await this.profileRepository.updateProfile(id, updateData)
    } catch (error) {
      throw error
    }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'

import { Profile } from './entities/profile.entity'
import type {
  ProfileSerializable,
  ProfileUpdateData,
  ProfileWithDeserializedSettings
} from './types'

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor(
    @InjectRepository(Profile)
    private repository: Repository<Profile>
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.repository.create(profileData)
    return this.repository.save(profile)
  }

  async findProfile(
    id: string,
    serializeExtraSettings = false
  ): Promise<ProfileSerializable> {
    try {
      const profile = await this.repository.findOne({ where: { id } })
      if (!profile) {
        throw new Error(`Profile with ID ${id} not found`)
      }
      if (!serializeExtraSettings) {
        return {
          ...profile,
          extraSettings: JSON.parse(profile.extraSettings)
        }
      }

      return profile
    } catch (error) {
      throw error
    }
  }

  async findActiveProfileById(id: string): Promise<Profile | null> {
    return await this.repository.findOne({ where: { id } })
  }

  async findDeletedProfileById(id: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true
    })
  }

  async findActiveProfileByUserId(userId: string): Promise<Profile | null> {
    return await this.repository.findOne({ where: { user: { id: userId } } })
  }

  async findDeletedProfileByUserId(userId: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { user: { id: userId }, deletedAt: Not(IsNull()) },
      withDeleted: true
    })
  }

  async updateProfile(
    id: string,
    updateData: ProfileUpdateData
  ): Promise<ProfileWithDeserializedSettings> {
    const { extraSettings, ...otherData } = updateData
    const dataToUpdate: Partial<Profile> = {
      ...otherData
    }
    if (extraSettings !== undefined) {
      dataToUpdate.extraSettings =
        typeof extraSettings === 'string'
          ? extraSettings
          : JSON.stringify(extraSettings)
    }
    await this.repository.update(id, dataToUpdate)
    return this.findProfile(
      id,
      false
    ) as unknown as ProfileWithDeserializedSettings
  }
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Profile } from '@/domain/profiles/entities/profile.entity'
import { ProfileRepository } from '@/domain/profiles/profiles.repository'

import { ProfilesService } from './profiles.service'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService, ProfileRepository]
})
export class ProfilesModule {}

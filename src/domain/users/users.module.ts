import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Profile } from '@/domain/profiles/entities/profile.entity'
import { ProfilesModule } from '@/domain/profiles/profiles.module'
import { Role } from '@/domain/roles/entities'
import { RolesModule } from '@/domain/roles/roles.module'
import { UserSecurityModule } from '@/domain/user-security/user-security.module'

import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile]),
    RolesModule,
    ProfilesModule,
    UserSecurityModule
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UserRepository]
})
export class UsersModule {}

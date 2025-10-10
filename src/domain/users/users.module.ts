import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Profile } from '@/domain/profiles/entities/profile.entity'
import { ProfilesModule } from '@/domain/profiles/profiles.module'
import { Role } from '@/domain/roles/entities'
import { RolesModule } from '@/domain/roles/roles.module'

import { User } from './entities/user.entity'
import { UserSecurity } from './entities/user-security.entity'
import { UserRepository } from './repositories/user.repository'
import { UserSecurityRepository } from './repositories/user-security.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserSecurity, Profile]),
    RolesModule,
    ProfilesModule
  ],
  providers: [UsersService, UserRepository, UserSecurityRepository],
  controllers: [UsersController],
  exports: [UserRepository, UserSecurityRepository]
})
export class UsersModule {}

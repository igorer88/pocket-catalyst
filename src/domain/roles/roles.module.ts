import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Role, UserRole } from './entities'
import { RolesController } from './roles.controller'
import { RoleRepository } from './roles.repository'
import { RolesService } from './roles.service'
import { UserRoleRepository } from './user-role.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  providers: [RolesService, RoleRepository, UserRoleRepository],
  controllers: [RolesController],
  exports: [TypeOrmModule, RoleRepository, UserRoleRepository]
})
export class RolesModule {}

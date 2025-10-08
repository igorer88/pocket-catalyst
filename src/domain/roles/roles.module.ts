import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Role } from './entities'
import { RolesController } from './roles.controller'
import { RolesRepository } from './roles.repository'
import { RolesService } from './roles.service'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
  exports: [TypeOrmModule, RolesRepository]
})
export class RolesModule {}

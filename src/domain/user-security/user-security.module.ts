import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserSecurity } from './entities/user-security.entity'
import { UserSecurityRepository } from './repositories/user-security.repository'
import { UserSecurityService } from './user-security.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserSecurity])],
  providers: [UserSecurityService, UserSecurityRepository],
  exports: [UserSecurityService, UserSecurityRepository]
})
export class UserSecurityModule {}

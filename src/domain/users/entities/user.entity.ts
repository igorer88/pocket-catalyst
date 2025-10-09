import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm'

import type { Profile } from '@/domain/profiles/entities/profile.entity'
import type { UserRole } from '@/domain/roles/entities/user-role.entity'
import { BaseEntity } from '@/shared/entities/base.entity'

import type { UserSecurity } from './user-security.entity'

@Entity('Users')
@Unique('UQ_USERS_EMAIL', ['email'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean

  @OneToOne('Profile', 'user')
  profile: Profile

  @OneToOne('UserSecurity')
  userSecurity: UserSecurity

  @OneToMany('UserRole', 'user')
  userRoles: UserRole[]
}

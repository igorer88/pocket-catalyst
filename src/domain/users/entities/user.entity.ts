import { Exclude, Expose } from 'class-transformer'
import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm'

import type { Profile } from '@/domain/profiles/entities/profile.entity'
import type { Role } from '@/domain/roles/entities/role.entity'
import type { UserRole } from '@/domain/roles/entities/user-role.entity'
import type { UserSecurity } from '@/domain/user-security/entities/user-security.entity'
import { BaseEntity } from '@/shared/entities/base.entity'

@Entity('Users')
@Unique('UQ_USERS_EMAIL', ['email'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string

  @Exclude()
  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean

  @OneToOne('Profile', 'user')
  profile: Profile

  @OneToOne('UserSecurity', 'user')
  userSecurity: UserSecurity

  @Exclude()
  @OneToMany('UserRole', 'user')
  userRoles: UserRole[]

  @Expose()
  roles: Role[]
}

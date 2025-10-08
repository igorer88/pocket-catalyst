import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique
} from 'typeorm'

import { Profile } from '@/domain/profiles/entities/profile.entity'
import { UserRole } from '@/domain/roles/entities/user-role.entity'
import { BaseEntity } from '@/shared/entities/base.entity'

import { UserSecurity } from './user-security.entity'

@Entity('Users')
@Unique('UQ_USERS_EMAIL', ['email'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile

  @OneToOne(() => UserSecurity, userSecurity => userSecurity.user)
  @JoinColumn({ name: 'id' })
  userSecurity: UserSecurity

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[]
}

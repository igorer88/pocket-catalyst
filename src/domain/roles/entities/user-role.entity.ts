import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import { User } from '@/domain/users/entities/user.entity'

import { Role } from './role.entity'

@Entity('UserRoles')
@Unique('PK_USER_ROLES', ['userId', 'roleId'])
@Index('IDX_USER_ROLES_USER_ID', ['userId'])
@Index('IDX_USER_ROLES_ROLE_ID', ['roleId'])
export class UserRole {
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string

  @PrimaryColumn({ type: 'uuid', name: 'role_id' })
  roleId: string

  @Column({ type: 'datetime', name: 'assigned_at', default: () => 'now()' })
  assignedAt: Date

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role
}

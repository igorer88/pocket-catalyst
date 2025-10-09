import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import type { User } from '@/domain/users/entities'
import { getCurrentTimestampFunction } from '@/shared/utils.helper'

import type { Role } from './role.entity'

@Entity('UserRoles')
@Unique('PK_USER_ROLES', ['userId', 'roleId'])
@Index('IDX_USER_ROLES_USER_ID', ['userId'])
@Index('IDX_USER_ROLES_ROLE_ID', ['roleId'])
export class UserRole {
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string

  @PrimaryColumn({ type: 'uuid', name: 'role_id' })
  roleId: string

  @Column({
    type: 'datetime',
    name: 'assigned_at',
    default: () => getCurrentTimestampFunction()
  })
  assignedAt: Date

  @ManyToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne('Role')
  @JoinColumn({ name: 'role_id' })
  role: Role
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import { getCurrentTimestampFunction } from '@/shared/utils.helper'

import type { Permission } from './permission.entity'
import type { Role } from './role.entity'

@Entity('RolePermissions')
@Unique('PK_ROLE_PERMISSIONS', ['roleId', 'permissionId'])
@Index('IDX_ROLE_PERMISSIONS_ROLE_ID', ['roleId'])
@Index('IDX_ROLE_PERMISSIONS_PERMISSION_ID', ['permissionId'])
export class RolePermission {
  @PrimaryColumn({ type: 'uuid', name: 'role_id' })
  roleId: string

  @PrimaryColumn({ type: 'uuid', name: 'permission_id' })
  permissionId: string

  @Column({
    type: 'datetime',
    name: 'granted_at',
    default: () => getCurrentTimestampFunction()
  })
  grantedAt: Date

  @ManyToOne('Role')
  @JoinColumn({ name: 'role_id' })
  role: Role

  @ManyToOne('Permission')
  @JoinColumn({ name: 'permission_id' })
  permission: Permission
}

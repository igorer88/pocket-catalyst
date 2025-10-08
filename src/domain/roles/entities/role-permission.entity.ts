import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'

import { Permission } from './permission.entity'
import { Role } from './role.entity'

@Entity('RolePermissions')
@Unique('PK_ROLE_PERMISSIONS', ['roleId', 'permissionId'])
@Index('IDX_ROLE_PERMISSIONS_ROLE_ID', ['roleId'])
@Index('IDX_ROLE_PERMISSIONS_PERMISSION_ID', ['permissionId'])
export class RolePermission {
  @PrimaryColumn({ type: 'uuid', name: 'role_id' })
  roleId: string

  @PrimaryColumn({ type: 'uuid', name: 'permission_id' })
  permissionId: string

  @Column({ type: 'datetime', name: 'granted_at', default: () => 'now()' })
  grantedAt: Date

  @ManyToOne(() => Role, role => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role

  @ManyToOne(() => Permission, permission => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission
}

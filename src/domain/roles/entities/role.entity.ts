import { Column, Entity, OneToMany, Unique } from 'typeorm'

import { BaseEntity } from '@/shared/entities/base.entity'

import type { RolePermission } from './role-permission.entity'
import type { UserRole } from './user-role.entity'

@Entity('Roles')
@Unique('UQ_ROLES_NAME', ['name'])
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @OneToMany('UserRole', 'role')
  userRoles: UserRole[]

  @OneToMany('RolePermission', 'role')
  rolePermissions: RolePermission[]
}

import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from '@/shared/entities/base.entity'

import type { RolePermission } from './role-permission.entity'

@Entity('Permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  action: string

  @Column({ type: 'varchar', length: 50 })
  subject: string

  @Column({ type: 'text', nullable: true })
  description: string

  @OneToMany('RolePermission', 'permission')
  rolePermissions: RolePermission[]
}

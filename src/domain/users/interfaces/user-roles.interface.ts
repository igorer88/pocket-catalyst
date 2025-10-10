import { Role } from '@/domain/roles/entities/role.entity'

export interface RoleWithAssignedAt extends Role {
  assignedAt?: Date
}

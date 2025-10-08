import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { User } from '@/domain/users/entities/user.entity'

@Entity('AuditAdminLog')
@Index('IDX_AUDIT_ADMIN_LOG_ACTOR_ID', ['actorId'])
export class AuditAdminLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'char', length: 32, name: 'actor_id' })
  actorId: string

  @Column({ type: 'varchar', length: 100 })
  action: string

  @Column({ type: 'varchar', length: 100 })
  target: string

  @Column({ type: 'text', nullable: true })
  details: string

  @Column({ type: 'datetime', default: () => 'now()' })
  timestamp: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor: User
}

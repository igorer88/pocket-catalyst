import { Exclude, Expose } from 'class-transformer'
import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from 'typeorm'

import type { User } from '@/domain/users/entities/user.entity'
import { BaseEntity } from '@/shared/entities/base.entity'

@Entity('UserSecurity')
@Unique('UQ_USER_SECURITY_USER_ID', ['user'])
@Unique('UQ_USER_SECURITY_RECOVERY_EMAIL', ['recoveryEmail'])
@Index('IDX_USER_SECURITY_USER_ID', ['user'])
export class UserSecurity extends BaseEntity {
  @Exclude()
  @OneToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: User

  @Exclude()
  @Column({ type: 'varchar', nullable: true, name: 'security_pin_hash' })
  securityPinHash: string

  @Column({ type: 'int', default: 0, name: 'pin_attempts' })
  pinAttempts: number

  @Column({ type: 'datetime', nullable: true, name: 'pin_locked_until' })
  pinLockedUntil: Date

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'pin_hint'
  })
  pinHint: string

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
    name: 'recovery_email'
  })
  recoveryEmail: string

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string

  @Expose()
  get userId(): string {
    return this.user ? this.user.id : null
  }
}

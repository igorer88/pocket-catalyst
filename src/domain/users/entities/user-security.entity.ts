import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from 'typeorm'

import { BaseEntity } from '@/shared/entities/base.entity'

import { User } from './user.entity'

@Entity('UserSecurity')
@Unique('UQ_USER_SECURITY_USER_ID', ['user'])
@Unique('UQ_USER_SECURITY_RECOVERY_EMAIL', ['recoveryEmail'])
@Index('IDX_USER_SECURITY_USER_ID', ['user'])
export class UserSecurity extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'varchar', nullable: true, name: 'interface_lock_pin_hash' })
  interfaceLockPinHash: string

  @Column({ type: 'int', default: 0, name: 'pin_attempts' })
  pinAttempts: number

  @Column({ type: 'datetime', nullable: true, name: 'pin_locked_until' })
  pinLockedUntil: Date

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'recovery_hint'
  })
  recoveryHint: string

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

  @Column({ type: 'boolean', default: false, name: 'biometric_enabled' })
  biometricEnabled: boolean

  @Column({ type: 'datetime', nullable: true, name: 'biometric_last_used' })
  biometricLastUsed: Date
}

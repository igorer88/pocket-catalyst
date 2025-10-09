import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from 'typeorm'

import type { User } from '@/domain/users/entities'
import { BaseEntity } from '@/shared/entities/base.entity'

@Entity('Profiles')
@Unique('UQ_PROFILES_USER_ID', ['user'])
@Index('IDX_PROFILES_USER_ID', ['user'])
export class Profile extends BaseEntity {
  @OneToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'first_name' })
  firstName: string

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'last_name' })
  lastName: string

  @Column({ type: 'varchar', length: 10, default: 'en-US' })
  locale: string

  @Column({
    type: 'varchar',
    length: 3,
    default: 'USD',
    name: 'display_currency'
  })
  displayCurrency: string

  @Column({ type: 'text', default: '{}', name: 'extra_settings' })
  extraSettings: string
}

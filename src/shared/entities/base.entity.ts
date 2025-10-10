import { Exclude } from 'class-transformer'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date

  @Exclude()
  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt: Date
}

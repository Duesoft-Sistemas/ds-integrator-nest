import useLocale from '@locale';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/database/core/users/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseSchema {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: useLocale() })
  readonly createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: useLocale() })
  readonly updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt!: Date;

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}

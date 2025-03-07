import { Client } from '@entities/clients/clients.entity';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { BaseSchema } from 'src/database/core/base.schema';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';

import { UserRole } from './users.role';

@Entity({ name: 'users' })
export class User extends BaseSchema {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose({ name: 'is_active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Expose({ name: 'is_admin' })
  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: UserRole, array: true, nullable: true })
  roles: UserRole[];

  @OneToOne(() => Client, (client) => client.profile, { nullable: true })
  client?: Client;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

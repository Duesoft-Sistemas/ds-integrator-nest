import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseSchema } from '../base.schema';
import { User } from '../users/users.entity';
import { ClientIntegrations } from './client.integrations.entity';

@Entity({ name: 'clients' })
export class Client extends BaseSchema {
  @Column()
  name: string;

  @Column({ unique: true })
  cnpj: string;

  @Expose({ name: 'is_active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Expose({ name: 'profile_id' })
  @Column({ name: 'profile_id' })
  profileId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: User;

  @OneToMany(() => ClientIntegrations, (entity) => entity.client)
  integrations: ClientIntegrations[];
}

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

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column()
    profile_id: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: User;

    @OneToMany(() => ClientIntegrations, (entity) => entity.client, { cascade: true })
    integrations: ClientIntegrations[];
}

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { Integration } from '../integration/integration.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'clients' })
export class Client extends BaseSchema {
    @Column()
    name: string;

    @Column({ unique: true })
    cnpj: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToMany(() => Integration, (integration) => integration.clients)
    @JoinTable({ name: 'client_integrations' })
    integrations: Integration[];

    @OneToOne(() => User)
    @JoinColumn({ name: 'profile_id' })
    profile: User;
}

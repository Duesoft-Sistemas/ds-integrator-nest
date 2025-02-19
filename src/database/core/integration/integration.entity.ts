import { Column, Entity, OneToMany } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';

@Entity({ name: 'integrations' })
export class Integration extends BaseSchema {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    photo?: string;

    @OneToMany(() => ClientIntegrations, (clientIntegration) => clientIntegration.integration)
    clientIntegrations: ClientIntegrations[];
}

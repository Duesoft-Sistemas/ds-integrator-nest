import { Column, Entity, OneToMany } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { IntegrationKey } from './integration.key.enum';

@Entity({ name: 'integrations' })
export class Integration extends BaseSchema {
    @Column()
    name: string;

    @Column({ type: 'enum', enum: IntegrationKey, unique: true })
    key: IntegrationKey;

    @Column({ nullable: true })
    photo?: string;

    @OneToMany(() => ClientIntegrations, (clientIntegration) => clientIntegration.integration)
    clientIntegrations: ClientIntegrations[];
}

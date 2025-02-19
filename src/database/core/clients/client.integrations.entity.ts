import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Integration } from '@entities/integration/integration.entity';
import { BaseSchema } from '@entities/base.schema';
import { Client } from '@entities/clients/clients.entity';

@Entity({ name: 'client_integrations' })
export class ClientIntegrations extends BaseSchema {
    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column()
    client_id: number;

    @ManyToOne(() => Client, (entity) => entity.integrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column()
    integration_id: number;

    @ManyToOne(() => Integration, (entity) => entity.clientIntegrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'integration_id' })
    integration: Integration;
}

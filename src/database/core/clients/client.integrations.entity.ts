import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Integration } from '@entities/integration/integration.entity';
import { BaseSchema } from '@entities/base.schema';
import { Client } from '@entities/clients/clients.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'client_integrations' })
export class ClientIntegrations extends BaseSchema {
    @Expose({ name: 'is_active' })
    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Expose({ name: 'client_id' })
    @Column({ name: 'client_id' })
    clientId: number;

    @ManyToOne(() => Client, (entity) => entity.integrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Expose({ name: 'integration_id' })
    @Column({ name: 'integration_id' })
    integrationId: number;

    @ManyToOne(() => Integration, (entity) => entity.clientIntegrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'integration_id' })
    integration: Integration;
}

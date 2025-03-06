import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntegrationHistoryType } from './history.type.enum';
import { BaseSchema } from '../base.schema';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { IntegrationHistoryEntity } from './history.process.enum';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'integration_history' })
export class IntegrationHistory extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryType })
    type: IntegrationHistoryType;

    @Column({ type: 'enum', enum: IntegrationHistoryEntity })
    entity: IntegrationHistoryEntity;

    @Column()
    operation: string;

    @Column({ nullable: true })
    message?: string;

    @Expose({ name: 'old_object'})
    @Column({ type: 'jsonb', name: 'old_object', nullable: true })
    oldObject?: Record<string, any>;

    @Expose({ name: 'new_object'})
    @Column({ type: 'jsonb', name: 'new_object', nullable: true })
    newObject?: Record<string, any>;

    @Column({ default: false })
    resolved: boolean;

    @Exclude()
    @Column({ name: 'client_integration_id' })
    clientIntegrationId: number;

    @ManyToOne(() => ClientIntegrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_integration_id' })
    integration: ClientIntegrations;
}

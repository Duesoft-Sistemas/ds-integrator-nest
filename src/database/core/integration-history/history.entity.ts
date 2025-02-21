import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IntegrationHistoryType } from './history.type.enum';
import { BaseSchema } from '../base.schema';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { IntegrationHistoryProcess } from './history.process.enum';

@Entity({ name: 'integration_history' })
export class IntegrationHistory extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryType })
    type: IntegrationHistoryType;

    @Column({ type: 'enum', enum: IntegrationHistoryProcess })
    process: string;

    @Column()
    operation: string;

    @Column()
    message?: string;

    @Column({ type: 'jsonb', name: 'old_object', nullable: true })
    oldObject?: Record<string, any>;

    @Column({ type: 'jsonb', name: 'new_object' })
    newObject: Record<string, any>;

    @Column({ default: false })
    resolved: boolean;

    @Column({ name: 'client_integration_id' })
    clientIntegrationId: number;

    @OneToOne(() => ClientIntegrations)
    @JoinColumn({ name: 'client_integration_id' })
    integration: ClientIntegrations;
}

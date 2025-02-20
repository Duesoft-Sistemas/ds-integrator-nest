import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IntegrationHistoryType } from './type.enum';
import { BaseSchema } from '../base.schema';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';

@Entity({ name: 'integration_history' })
export class IntegrationHistory extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryType })
    type: IntegrationHistoryType;

    @Column()
    process: string;

    @Column()
    message: string;

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

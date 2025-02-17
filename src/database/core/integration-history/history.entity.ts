import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IntegrationHistoryType } from './type.enum';
import { Integration } from '../integration/integration.entity';
import { BaseSchema } from '../base.schema';

@Entity({ name: 'integration_history' })
export class IntegrationHistory extends BaseSchema {
    @Column({ type: 'enum', enum: IntegrationHistoryType })
    type: IntegrationHistoryType;

    @Column()
    process: string;

    @Column()
    message: string;

    @Column({ type: 'jsonb', name: 'old_object', nullable: true })
    oldObject!: Record<string, any>;

    @Column({ type: 'jsonb', name: 'new_object' })
    newObject: Record<string, any>;

    @Column({ default: false })
    resolved: boolean;

    @OneToOne(() => Integration)
    @JoinColumn({ name: 'integration_id' })
    integration: Integration;

    // @Column()
    // client: Client;
}

import { BaseSchema } from '@entities/base.schema';
import { Client } from '@entities/clients/clients.entity';
import { Integration } from '@entities/integration/integration.entity';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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

  @ManyToOne(() => Integration, (entity) => entity.clientIntegrations, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'integration_id' })
  integration: Integration;

  @Expose({ name: 'last_polling' })
  @Column({ name: 'last_polling', nullable: true })
  lastPolling: Date;

  @OneToMany(() => IntegrationHistory, (history) => history.clientIntegration)
  histories?: IntegrationHistory[];

  @Expose({ name: 'errors' })
  errors?: number;
}

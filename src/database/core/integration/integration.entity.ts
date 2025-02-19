import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { Client } from '../clients/clients.entity';

@Entity({ name: 'integrations' })
export class Integration extends BaseSchema {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    photo?: string;

    @ManyToMany(() => Client, (client) => client.integrations)
    clients: Client[];
}

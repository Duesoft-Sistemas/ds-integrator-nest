import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseSchema } from '../base.schema';
import { Client } from '../client/client.entity';

@Entity({ name: 'integrations' })
export class Integration extends BaseSchema {
    @Column()
    name: string;

    @Column()
    photo: string;

    @ManyToMany(() => Client, (client) => client.integrations)
    clients: Client[];
}

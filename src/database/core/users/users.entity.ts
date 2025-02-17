import { BaseSchema } from 'src/database/core/base.schema';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseSchema {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'is_admin', default: false })
    isAdmin: boolean;

    @Column()
    photo: string;
}

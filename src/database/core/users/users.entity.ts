import * as bcrypt from 'bcrypt';
import { BaseSchema } from 'src/database/core/base.schema';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseSchema {
    @Column({ nullable: true })
    name!: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'is_admin', default: false })
    isAdmin: boolean;

    @Column({ nullable: true })
    photo!: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
}

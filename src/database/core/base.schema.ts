import { User } from 'src/database/core/users/users.entity';
import {
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export class BaseSchema {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    readonly createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    readonly updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
    deletedAt!: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}

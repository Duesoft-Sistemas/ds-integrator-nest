import { User } from '@entities/users/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findOneBy({ email });
    }
}

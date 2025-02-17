import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../database/core/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dtos';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email });
    }

    async create(data: CreateUserDto): Promise<User> {
        const { email, name, password } = data;
        let user = await this.findByEmail(email);

        if (user) {
            throw new ConflictException(`O e-mail ${user.email} já existe`);
        }

        user = this.usersRepository.create({ email, name, password });
        return await this.usersRepository.save(user);
    }
}

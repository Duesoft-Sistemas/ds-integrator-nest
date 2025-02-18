import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dtos';
import { Payload } from 'src/auth/auth.dtos';
import { User } from '@entities/users/users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email, isActive: true });
    }

    async createAdmin(data: CreateUserDto, userRegister: Payload): Promise<User> {
        const { email, name, password } = data;
        let user = await this.findByEmail(email);

        if (user) {
            throw new ConflictException(`O e-mail ${user.email} já existe`);
        }

        user = this.usersRepository.create({
            email,
            name,
            password,
            isAdmin: true,
            user: userRegister,
        });

        return await this.usersRepository.save(user);
    }

    async create(data: CreateUserDto, userRegister: Payload): Promise<User> {
        const { email, name, password } = data;
        let user = await this.findByEmail(email);

        if (user) {
            throw new ConflictException(`O e-mail ${user.email} já existe`);
        }

        user = this.usersRepository.create({ email, name, password, user: userRegister });
        return await this.usersRepository.save(user);
    }

    async profile(id: number): Promise<Partial<User>> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }
}

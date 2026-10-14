import {
  Injectable,
  Logger,
  OnModuleInit,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.js';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUsers();
  }

  async seedUsers(): Promise<void> {
    const count = await this.userRepository.count();
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash('Password123!', saltRounds);

    if (count === 0) {
      this.logger.log('Base de datos vacía. Sembrando usuarios iniciales con roles...');

      const initialUsers: Partial<User>[] = [
        {
          name: 'Administrador Principal',
          email: 'admin@example.com',
          password: defaultPassword,
          role: 'admin',
        },
        {
          name: 'Técnico / Operador',
          email: 'user@example.com',
          password: defaultPassword,
          role: 'user',
        },
      ];

      for (const userData of initialUsers) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }
      this.logger.log('Usuarios iniciales sembrados con roles: admin y user.');
    } else {
      // Ensure admin has role 'admin' in case previously seeded without role
      const admin = await this.findByEmail('admin@example.com');
      if (admin && admin.role !== 'admin') {
        admin.role = 'admin';
        await this.userRepository.save(admin);
        this.logger.log('Rol de admin@example.com actualizado a "admin".');
      }
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password: _, ...userWithoutPassword }) => userWithoutPassword);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.role || 'user',
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('El correo electrónico ya está registrado por otro usuario');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.remove(user);
    return { success: true, message: `Usuario con ID ${id} eliminado correctamente` };
  }
}

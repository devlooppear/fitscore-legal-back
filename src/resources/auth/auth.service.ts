import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { logError } from '../../common/util/log.util';
import { isStrongPassword } from '../../common/util/auth.util';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) return null;

      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      logError(error, 'AuthService.validateUser');
      return null;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      logError(error, 'AuthService.login');
      throw new UnauthorizedException('Login failed');
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;

      if (!isStrongPassword(password)) {
        throw new BadRequestException({
          message:
            'Password too weak. It must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
        });
      }

      const user = await this.usersService.create(createUserDto);
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      logError(error, 'AuthService.register');

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException({ message: 'Registration failed' });
    }
  }
}

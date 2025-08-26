import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto/create-user.dto';
import { logError } from '../../common/util/log.util';

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
      const user = await this.usersService.create(createUserDto);
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      logError(error, 'AuthService.register');
      throw new UnauthorizedException('Registration failed');
    }
  }
}

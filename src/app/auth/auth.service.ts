import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;

      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'> | User) {
    const payload = {
      username: user.email,
      sub: user.id,
      permission: user.permission ? user.permission.name : 'Reader',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

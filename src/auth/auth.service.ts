import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtResponse } from './interfaces/jwt.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(user: JwtPayload): Promise<JwtResponse> {
    const token = this.jwtService.sign(user);
    return {
      expiresIn: 3600,
      token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findOnyById(payload.id);
  }
}

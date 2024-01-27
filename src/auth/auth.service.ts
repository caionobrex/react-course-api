import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterDTO } from './auth.controller';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDTO) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      throw new ConflictException();
    }
    const salt = genSaltSync();
    const hash = hashSync(data.password, salt);
    user = await this.prisma.user.create({
      data: {
        ...data,
        salt,
        password: hash,
      },
    });
    delete user.password;
    delete user.salt;
    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}

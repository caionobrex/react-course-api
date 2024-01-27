import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

class LoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

class LoginResponse {
  @ApiProperty()
  token: string;
}

class RegisterResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

@ApiTags('autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    type: RegisterResponse,
  })
  @ApiConflictResponse({
    description: 'Email já cadastrado.',
  })
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @ApiResponse({
    status: 200,
    type: LoginResponse,
  })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body.email, body.password);
  }
}

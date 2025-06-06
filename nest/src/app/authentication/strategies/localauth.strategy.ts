import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.validateUser(email, password);
  }
}

export { LocalStrategy };

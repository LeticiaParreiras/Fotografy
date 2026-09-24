import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromCookie = request?.cookies?.access_token;
          if (tokenFromCookie) {
            return tokenFromCookie;
          }

          
        },
      ]),
      ignoreExpiration: false,
    });
  }
  validate(payload: any) {
    //serve para aplicar uma validação adicional se precisar
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}

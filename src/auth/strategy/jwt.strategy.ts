import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy , 'jwt') {
  constructor(config: ConfigService , private prisma : PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {sub :number , email :string}){
      console.log({
          payload,
        });
     const user = await this.prisma.user.findUnique({
        where: {
            email: payload.email,
          },
      });
      delete user.hash;
      console.log({
          user
      });
      
      return user;
  }
}

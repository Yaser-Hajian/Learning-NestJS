import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt , Strategy} from "passport-jwt";
import { Injectable } from "@nestjs/common";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config : ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET"),
          });
    }
}
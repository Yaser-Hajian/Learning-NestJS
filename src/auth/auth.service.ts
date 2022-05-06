import { Injectable } from "@nestjs/common";
import { Auth_dto } from "src/dto";
import { PrismaController } from "src/prisma/prisma.controller";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2"

@Injectable()
export class AuthService{
    constructor(private prisma : PrismaService ){

    }
    
    signin(){
        return "I have signed in."
    }
    async signup(dto : Auth_dto){
        // make hash for password
        const hash = await argon.hash(dto.password);
        //save user in db
        const user = await this.prisma.user.create({
            data : {
                email : dto.email,
                hash,
            }
        })
        delete user.hash;
        return user;
       
    }
}
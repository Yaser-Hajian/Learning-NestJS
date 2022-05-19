import { Controller, Get, UseGuards , Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import {User} from "@prisma/client"

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
    constructor(){

    }
    // /users/me
    @Get("me")
    getMe(@GetUser() user : User ){
        return user;
    }
}
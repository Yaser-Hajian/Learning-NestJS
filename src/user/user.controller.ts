import { Controller, Get, UseGuards , Request, Patch, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";
import {User} from "@prisma/client"
import { EditUserDTO } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
    constructor(private userService : UserService){

    }
    // /users/me
    @Get("me")
    getMe(@GetUser() user : User ){
        return user;
    }

    @Patch()
    editUser(@GetUser("id") userID : number , @Body() dto : EditUserDTO){
        return this.userService.editUser(userID , dto);
    }
}
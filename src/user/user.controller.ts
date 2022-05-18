import { Controller, Get, UseGuards , Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UserController {
    constructor(){

    }
    // /users/me
    @UseGuards(AuthGuard('jwt'))
    @Get("me")
    getMe( @Request() req ){
        return req.user;
    }
}
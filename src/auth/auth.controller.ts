import { Body, Controller, ParseBoolPipe, ParseIntPipe, Post, Req } from "@nestjs/common";
import { Interface } from "readline";
import { Auth_DTO } from "src/dto";
import { AuthService } from "./auth.service";


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}
    
    /*  /auth/signup   */
    @Post("signup")
    signup(@Body() dto : Auth_DTO){
        console.log({
            email: dto.email ,
            password : dto.password,
        });
        return this.authService.signup(dto);
    }
    /*  /auth/signin   */
    @Post("signin")
    signin(@Body() dto : Auth_DTO){
        return this.authService.signin(dto);
    }
}
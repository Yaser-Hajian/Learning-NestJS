import {IsEmail , IsNotEmpty , IsString} from "class-validator"
export class Auth_dto {
    @IsEmail()
    @IsNotEmpty() 
    email : string ;

    @IsString()
    @IsNotEmpty()
    password : string ;
    
}
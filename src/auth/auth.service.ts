import { ForbiddenException, Injectable } from '@nestjs/common';
import { Auth_DTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

 async signin(dto: Auth_DTO) {
    //find the user using email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user doesnt exist , throw exception
    if (!user) {
      throw new ForbiddenException("Credentials incorrect")
    }
    //compare password
    const pwMathches = await argon.verify(user.hash ,dto.password);
    //if password in incorrext , throw new exception
    if(!pwMathches){
      throw new ForbiddenException("Credentials incorrect");
    }
    //send back the user
    delete user.hash;
    return user;
  }
  async signup(dto: Auth_DTO) {
    // make hash for password
    const hash = await argon.hash(dto.password);
    try {
      //save user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('the email must be unique');
        }
      }
      throw error;
    }
  }
}

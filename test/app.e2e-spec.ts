import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { Auth_DTO } from '../src/auth/dto';
import { getMaxListeners } from 'process';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    const dto: Auth_DTO = {
      email: 'salam1@getMaxListeners.com',
      password: '123',
      firstName: null,
      lastName: null,
    };
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('Should signup', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });
    describe('Signin', () => {
      let accessToken: String;
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should throw if password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: '345',
          })
          .expectStatus(403);
      });
      it('should throw if email is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'salam2@gmail.com',
            password: dto.password,
          })
          .expectStatus(403);
      });
      it('Should signin', () => {
       return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores("userAT" , "access_token");
      });
      
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it("should throw without access token" , () => {
        return pactum
        .spec()
        .get('/users/me')
        .expectStatus(401)
      });
      it("should get cuurent user" , () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization : "Bearer $S{userAT}"
        })
        .expectStatus(200)
      });
    });
    describe('Edit User', () => {});
  });
  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
});

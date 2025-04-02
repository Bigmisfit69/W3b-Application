import { BadRequestException, HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo:Repository<User>, private readonly jwtService:JwtService) {}
  async signup(payload: CreateUserDto) {
    payload.email = payload.email.toLowerCase();
    const {email, password, ...rest}=payload
    const user = await this.userRepo.findOne({where:{email}})
    if(user){
        throw new HttpException('Sorry this user with this email already exists', 400)
    }
    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userRepo.save({email, password:hashPassword, ...rest})
    delete user.password;
    return user;
    } catch (error) {
      if (error.code === '22P02'){
        throw new BadRequestException('admin role should be in lowercase')
      }
      return error;
    }    
  }

  async login(payload: LoginDto,@Req() req:Request, @Res()res:Response) {
    const {email, password} = payload;
    const user = await this.userRepo.findOne({where:{email}});
    if(!user){
      throw new HttpException('Invalid credentials', 400)
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw new HttpException('Invalid credentials', 400)
    }
    delete user.password
    
    const token = await this.jwtService.signAsync({id: user.id, email: user.email, role: user.role});

    res.cookie('userAuthenticated', token, {httpOnly: true, maxAge: 1 * 60 * 60 * 1000, sameSite:'none', secure:true});

    return res.send({
      message: 'User logged in successfully', 
      userToken: token,
      userDetails: user
    })
  }

async logout(@Req() req: Request, @Res() res: Response) {
  const clearCookie = res.clearCookie('userAuthenticated');

  const response = res.send(`user successfully logged out`)
}

  async user(headers:any): Promise<any>{
    const authorizationHeader = headers.authorization;
    if (authorizationHeader){
      const token = authorizationHeader.replace('Bearer ', '');
      const secret = process.env.JWT_SECRET;
      try{
        const decoded = this.jwtService.verify(token);
        let id = decoded["id"];
        let user = await this.userRepo.findOneBy({id});

        return {id: id, name: user.username, email: user.email, role: user.role};
      }catch(error){
        throw new UnauthorizedException('Invalid token');
      }
    }else{
      throw new UnauthorizedException('Invalid or missing Bearer token');
    }
  }

  async findEmail (email:string){
    const user = await this.userRepo.findOneBy({email: email});

    if(!user){
      throw new UnauthorizedException()
    }else{
      return user;
    }
  }

  async getAllUser(){
    return await this.userRepo.find();
  }
}
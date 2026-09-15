import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schemas/users.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = crypto
      .createHash('sha256')
      .update(dto.password + salt)
      .digest('hex');

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      salt,
    });

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña erroneos');
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(dto.password + user.salt)
      .digest('hex');

    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Correo o contraseña erroneos');
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

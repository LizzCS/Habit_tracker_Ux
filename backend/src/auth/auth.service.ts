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
    // Check if email already exists
    const existingUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash password
    const hashedPassword = crypto
      .createHash('sha256')
      .update(dto.password + salt)
      .digest('hex');

    // Create user
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      salt,
    });

    // Generate JWT
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
    // Find user
    const user = await this.userModel.findOne({ email: dto.email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Hash the password entered during login
    const hashedPassword = crypto
      .createHash('sha256')
      .update(dto.password + user.salt)
      .digest('hex');

    // Compare passwords
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT
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

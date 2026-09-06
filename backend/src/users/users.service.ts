import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../users/schemas/users.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // CREATE
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const user = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      salt: '',
    });

    return user.save();
  }

  // READ ALL
  async findAll() {
    return this.userModel.find().select('-password -salt').exec();
  }

  // READ ONE
  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -salt')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .select('-password -salt')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // DELETE
  async remove(id: string) {
    const user = await this.userModel
      .findByIdAndDelete(id)
      .select('-password -salt')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      message: 'Usuario eliminado correctamente',
      user,
    };
  }
}

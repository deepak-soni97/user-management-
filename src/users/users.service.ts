import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user || user.isDeleted) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.max(1, query.limit ? Number(query.limit) : 10);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<UserDocument> = { isDeleted: false };
    if (query.search) {
      filter['$or'] = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).select('-password'),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const update: any = {};
    if (dto.name) update.name = dto.name;
    if (dto.password) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
      update.password = await bcrypt.hash(dto.password, saltRounds);
    }

    const user = await this.userModel.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async softDelete(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setProfilePicture(id: string, filename: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { profilePicture: filename }, { new: true }).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

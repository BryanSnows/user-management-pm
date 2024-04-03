import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../dto/create-user.dto';
import { FilterUser } from '../dto/filter-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserService {
  findProfileById(id: number): Promise<any>;
  findByEmail(email: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(filter: FilterUser): Promise<Pagination<User>>;
  findAllProfile(): Promise<any>;
  findByEmailAndId(user_id: number, user_email: string): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  findById(id: number): Promise<User>;
  updateRefreshToken(id: number, refresh_token: string): Promise<void>;
}

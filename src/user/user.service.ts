import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Validations } from 'src/shared/validations';
import { ObjectSize, SortingType, ValidType } from '../shared/enums';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ProfileEntity } from 'src/user/entities/profile.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUser } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.interface.service';
import { hash } from 'src/shared/hash';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { Utils } from 'src/shared/utils';
import { DashFilterUser } from './dto/dash-filter.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  //*Dash Method
  async findAllDash(filter: DashFilterUser) {
    const { user_status } = filter;
    const userBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (user_status) {
      userBuilder.andWhere('user.user_status = :user_status', { user_status });
    }

    return await userBuilder.getMany();
  }

  //* Method is called in the update method for email validation
  async findProfileById(id: number): Promise<ProfileEntity> {
    return await this.profileRepository.findOne({
      where: {
        profile_id: id,
      },
    });
  }

  //* Method called in the create method to validate the email/check if it already exists in the database
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne();
  }

  //* This method creates a user with email, name, password (encrypted) columns and attaches a profile to that user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { user_name, profile_id, user_password } = createUserDto;

    if (user_name.trim() == '' || user_name == undefined)
      throw new BadRequestException(`O nome não pode estar vazio`);

    const user = this.userRepository.create(createUserDto);
    user.user_name = user_name.toUpperCase().trim();

    const emailIsRegistered = await this.findByEmail(user.user_email);
    if (emailIsRegistered) throw new BadRequestException(`Email já cadastrado`);

    const profile = await this.findProfileById(profile_id);
    if (!profile) {
      throw new NotFoundException(`Perfil não encontrado`);
    }

    user.user_first_access = false;
    user.user_status = true;
    user.profile_id = profile_id;
    const newPass = user_password;
    user.user_password = await Utils.getInstance().encryptPassword(newPass);
    let userSaved = await this.userRepository.save(user);
    return userSaved;
  }

  //* This method list all users with search field by name and mail, order by name and pagination!
  async findAll(filter: FilterUser): Promise<Pagination<User>> {
    const { search_name, sort, orderBy, user_status } = filter;
    const userBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (user_status) {
      userBuilder.andWhere('user.user_status = :user_status', { user_status });
    }

    if (search_name) {
      userBuilder.andWhere(
        new Brackets((queryBuilderOne) => {
          queryBuilderOne
            .where('user.user_name like :user_name', {
              user_name: `%${search_name}%`,
            })
            .orWhere('user.user_email like :user_email', {
              user_email: `%${search_name}%`,
            });
        }),
      );
    }

    if (orderBy == SortingType.NAME)
      userBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);

    filter.limit = filter.limit ?? (await userBuilder.getMany()).length;
    return paginate<User>(userBuilder, filter);
  }

  //* This method list all profiles
  async findAllProfile(): Promise<ProfileEntity[]> {
    return await this.profileRepository.find();
  }

  //* Method is called in the update method for email and user id validation!
  async findByEmailAndId(user_id: number, user_email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id != :user_id', { user_id })
      .andWhere('user.user_email like :user_email', {
        user_email: `%${user_email}%`,
      })
      .getOne();
  }

  //* Updating a user name, email and profile by id
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    Validations.getInstance().validateWithRegex(`${id}`, ValidType.IS_NUMBER);

    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(`Número de id inválido`);
    }

    const { user_name, profile_id: profile_id, user_email } = updateUserDto;

    if (user_name.trim() == '' || user_name == undefined)
      throw new BadRequestException(`O nome não pode estar vazio`);

    const isRegistered = await this.findById(id);
    if (!isRegistered) throw new NotFoundException(`Usuário não existe`);

    const user = await this.userRepository.preload({
      user_id: id,
      ...updateUserDto,
    });

    if (user_name) {
      user.user_name = user_name.toUpperCase().trim();
    }

    if (user.user_email) {
      if (isRegistered.user_email != user_email) {
        const isRegisteredName = await this.findByEmailAndId(user.user_id, user_email);
        if (isRegisteredName) {
          throw new BadRequestException('Email já cadastrado');
        }
      }
    }

    if (profile_id) {
      const profile = await this.findProfileById(profile_id);
      if (!profile) {
        throw new NotFoundException(`Perfil não encontrado`);
      }
      user.profile = profile;
    }

    await this.userRepository.save(user);
    return this.findById(id);
  }

  async findById(id: number): Promise<User> {
    Validations.getInstance().validateWithRegex(`${id}`, ValidType.IS_NUMBER);
    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(`Número de id inválido`);
    }

    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne();
  }

  //* Method is called in the auth service for update refresh token
  async updateRefreshToken(id: number, refresh_token: string) {
    Validations.getInstance().validateWithRegex(`${id}`, ValidType.IS_NUMBER);

    if (id > ObjectSize.INTEGER) throw new BadRequestException(`Número de id inválido`);

    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`Usuario com id ${id} não existe`);

    user.user_refresh_token = refresh_token;
    await this.userRepository.save(user);
  }

  //* Method used in car service for first access
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const userSaved = await this.findByEmail(changePasswordDto.email);

    if (!userSaved) {
      throw new NotFoundException('Usuário não cadastrado!');
    }

    const newHashedPassword = await hash(changePasswordDto.new_password);

    userSaved.user_password = newHashedPassword;
    userSaved.user_first_access = false;

    return this.userRepository.save(userSaved);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUser } from './dto/filter-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { IUserController } from './interfaces/user.interface.controller';
import AccessProfile from 'src/auth/enums/permission.type';
import { DashFilterUser } from './dto/dash-filter.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      'CREATING A USER IN THE VULNERABILITY ANALYSIS PLATFORM SYSTEM, SAVING THE PASSWORD WITH ENCRYPTION AND ATTACHING A PROFILE',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'LISTING ALL USERS WITH SEARCH FIELD BY NAME AND MAIL, ORDER BY NAME AND PAGINATION',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Get()
  async findAll(@Query() filter: FilterUser): Promise<Pagination<User>> {
    return await this.userService.findAll(filter);
  }

  @ApiOperation({
    summary: 'LISTING ALL USERS WITH STATUS FILTER',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Get('/dashboard')
  async findAllDash(@Query() filter: DashFilterUser) {
    return await this.userService.findAllDash(filter);
  }

  @ApiOperation({
    summary: 'PROFILE LIST. ENDPOINT USED FOR PROFILE SELECT WHEN USER CREATION',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Get('/profile')
  async findAllProfile(): Promise<ProfileEntity[]> {
    return await this.userService.findAllProfile();
  }
  @ApiOperation({
    summary: 'LIST OF USERS BY ID',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @ApiOperation({
    summary: 'UPDATING A USERS NAME, EMAIL AND PROFILE BY ID',
  })
  @UseGuards(PermissionGuard(AccessProfile.COORDENADOR_TECNICO))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(+id, updateUserDto);
  }
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('PROFILE')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column()
  profile_name: string;

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}

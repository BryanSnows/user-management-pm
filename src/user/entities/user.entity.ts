import { ProfileEntity } from 'src/user/entities/profile.entity';
import { BitToBooleanTransformer } from 'src/config/database/transformers/bit-to-boolean.transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  user_name: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  user_email: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  user_password: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  user_refresh_token: string;

  @Column({
    type: 'bit',
    transformer: new BitToBooleanTransformer(),
  })
  user_status: boolean;

  @Column({
    type: 'bit',
    transformer: new BitToBooleanTransformer(),
  })
  user_first_access: boolean;

  @Column({ nullable: false, type: 'int' })
  profile_id: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile.users)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;
}

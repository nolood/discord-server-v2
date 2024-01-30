import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.model';

@Entity()
export class FriendsRequests {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friendRequests)
  sender: User;

  @OneToOne(() => User)
  @JoinColumn()
  recipient: User;
}

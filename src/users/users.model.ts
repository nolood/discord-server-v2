import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendsRequests } from '../friends-requests/friends-requests.model';
import { Message } from '../messages/messages.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @OneToMany(() => FriendsRequests, (friendRequest) => friendRequest.id)
  friendRequests: FriendsRequests[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  toJSON() {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = this;
    return result;
  }
}

import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.model';
import { Message } from '../messages/messages.model';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}

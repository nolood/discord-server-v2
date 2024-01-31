import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.model';
import { Chat } from 'src/chats/chats.model';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
}

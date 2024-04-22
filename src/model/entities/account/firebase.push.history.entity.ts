import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'firebase_noti_history' })
export class FirebasePushHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  token: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body: any;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  failmessage: any;

  @CreateDateColumn({ name: 'create_at', default: () => 'CURRENT_TIMESTAMP', comment: '생성일' })
  createdAt: Date;
}

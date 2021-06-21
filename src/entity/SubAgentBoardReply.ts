import { type } from "os";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubAgentBoard } from "./SubAgentBoard";
import { User } from "./User";

@Entity()
export class SubAgentBoardReply {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  content:string;

  @ManyToOne((type)=>SubAgentBoard, (board)=>board.replies)
  @JoinColumn()
  @Index()
  board:SubAgentBoard;

  @ManyToOne((type)=>User, (user)=>user.subAgentBoardReplies,{nullable:false, onDelete: 'CASCADE'})
  @JoinColumn()
  @Index()
  writeUser:User;

  @Column({default:true})
  isAnonymous:boolean;

  @CreateDateColumn()
  createTime: Date;

  isMyReply:boolean = false;

  @UpdateDateColumn()
  updateTime: Date;
}

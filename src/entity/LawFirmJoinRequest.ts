import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LawFirm } from "./LawFirm";
import { User } from "./User";

@Entity()
export class LawFirmJoinRequest {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne((type) => User, (user) => user.joinRequests, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

  @ManyToOne((type) => LawFirm, (lawfirm) => lawfirm.joinRequests, {onDelete: 'CASCADE'})
  @JoinColumn()
  lawFirm: LawFirm;


  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { LawFirm } from "./LawFirm";

@Entity()
export class LawFirmOwner {
  @PrimaryGeneratedColumn()
  idx: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @OneToOne((type) => LawFirm)
  @JoinColumn()
  lawFirm: LawFirm;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}

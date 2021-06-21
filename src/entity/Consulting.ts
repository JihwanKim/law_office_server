import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class Consulting {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  title: string;

  // JSON or TEXT
  @Column({ length: 20 })
  contentFormat: string;

  @Column("text")
  content: string;

  // 특이사항
  @Column("text")
  uniqueness: string;

  @ManyToOne((type) => Customer, (customer) => customer.consultings)
  customer: Customer;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  logger() {
  }
}

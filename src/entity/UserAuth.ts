import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import * as Bcrpyt from "bcrypt-nodejs";
export enum AuthType {
  NORMAL = "NORMAL",
  EMAIL = "EMAIL",
  PROVIDER_GOOGLE = "PROVIDER_GOOGLE",
  PROVIDER_KAKAO = "PROVIDER_KAKAO",
  PROVIDER_APPLE = "PROVIDER_APPLE",
}

@Entity()
@Unique(["id", "type"])
export class UserAuth {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ length: 10 })
  type: AuthType;

  @Column({ length: 128 })
  id: string;

  @Column()
  password: string;

  @ManyToOne((type) => User, (user) => user.auths)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  conditionCheck() {
    if (this.id.length < 3) {
      throw ({ error: "id_length_short" });
    }

    if (this.id.length > 30) {
      throw ({ error: "id_length_long" });
    }

    if (this.password.length < 3) {
      throw ({ error: "password_length_short" });
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  updatePassword() {
    // 비밀번호 암호화는 길이가 30이 넘어가면 암호화 되었다고 간주하고, 무시함.
    if (this.password.length < 30) {
      const salt = Bcrpyt.genSaltSync(10);
      this.password = Bcrpyt.hashSync(this.password, salt);
    }
  }
}
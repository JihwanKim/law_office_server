import { getConnection, getRepository } from "typeorm";
import { Group } from "../../entity/Group";
import { LawCase } from "../../entity/LawCase";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";

export async function getAll(user: User, lawFirm: LawFirm) {
  // users/customers/group/lawFirm
  const userGroups = await getRepository(User).findOne({
    where: { idx: user.idx },
    relations: ["groups"],
  });
  const groupIdxList = userGroups.groups.map((element: Group) => {
    return element.idx;
  });
  return {
    lawCases: await await getConnection()
      .createQueryBuilder()
      .select("lawCase")
      .from(LawCase, "lawCase")
      .leftJoinAndSelect("lawCase.users", "user")
      .leftJoinAndSelect("lawCase.customers", "customers")
      .innerJoinAndSelect("lawCase.lawFirm", "lawFirm")
      .where("lawCase.lawFirmIdx = :lawfirmIdx", { lawfirmIdx: lawFirm.idx })
      // .whereInIds(request.ids)
      .orderBy("lawCase.updateTime", "DESC")
      .getMany(),
  };
}

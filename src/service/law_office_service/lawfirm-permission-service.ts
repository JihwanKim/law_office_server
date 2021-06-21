import { getManager, getRepository } from "typeorm";
import { Group } from "../../entity/Group";
import { LawFirm } from "../../entity/LawFirm";
import { User, UserType } from "../../entity/User";

export async function changeOwner(
  user: User,
  lawFirm: LawFirm,
  targetUserIdx: number
) {
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }
  const userRepo = getRepository(User);
  const newOnwerUser = await userRepo.findOne({
    relations: ["lawFirm"],
    where: { idx: targetUserIdx },
  });

  if (newOnwerUser === undefined) {
    throw { error: "not_exist_user" };
  }

  if (newOnwerUser.lawFirm === null || newOnwerUser.lawFirm.idx !== lawFirm.idx) {
    throw { error: "target_user_not_in_lawfirm" };
  }

  if(newOnwerUser.type !== UserType.LAWYER){
    throw { error: "employee_cannot_be_owner" };
  }

  const groupRepo = getRepository(Group);
  const ownerGroup = await groupRepo.findOne({
    where: {
      lawFirm: lawFirm,
      name: "관리자",
    },
  });
  const defaultGroup = await groupRepo.findOne({
    relations:["users"],
    where: {
      lawFirm: lawFirm,
      name: "기본",
    },
  });

  newOnwerUser.lawFirm = lawFirm;
  lawFirm.ownerUser = newOnwerUser;
  ownerGroup.users = [newOnwerUser];
  defaultGroup.users.push(user);
  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(newOnwerUser);
    await transactionManager.save(lawFirm);
    await transactionManager.save(ownerGroup);
    await transactionManager.save(defaultGroup);
  });

  return {user:newOnwerUser};
}

import { getManager, getRepository, IsNull, TransactionManager } from "typeorm";
import { Group } from "../../entity/Group";
import { LawFirm } from "../../entity/LawFirm";
import { Permission } from "../../entity/Permission";
import { User } from "../../entity/User";

// 그룹 생성
export async function create(
  user: User,
  lawFirm: LawFirm,
  name: string,
  description: string,
  permissionVersion: number,
  perm: number[]
) {
  // 관리자/기본 그룹 이름으로 생성 불가.
  if (name === "관리자" || name === "기본") {
    throw { error: "cannot_use_this_name" };
  }
  // 퍼미션체크 추가 필요. 일단 그룹장만되도록함.
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }
  // 권한도 입력같이받음
  const group = new Group();
  group.name = name;
  group.description = description;

  const permission = new Permission();
  permission.permission = JSON.stringify(perm);
  permission.version = permissionVersion;

  group.permission = permission;
  group.lawFirm = lawFirm;

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(permission);
    await transactionManager.save(group);
    await userToDefaultGroupForNotBelongToAnyGroup(lawFirm, transactionManager);
  });
  return { group: group };
}

// 그룹 삭제
export async function remove(user: User, lawFirm: LawFirm, groupIdx: number) {
  const group = await getRepository(Group).findOne({
    where: {
      lawFirm: lawFirm,
      idx: groupIdx,
    },
    relations: ["users", "lawFirm"],
  });

  if (group === undefined) {
    throw { error: "not_exist_group" };
  }
  if (lawFirm.idx !== group.lawFirm.idx) {
    console.log(
      `group remove request to other lawFirm! ${user} ${lawFirm} ${groupIdx}`
    );
    throw { error: "has_not_permission" };
  }

  // 관리자/기본 그룹 삭제 불가.
  if (group.name === "관리자" || group.name === "기본") {
    throw { error: "cannot_remove_admin_or_default_group" };
  }

  // 퍼미션체크 추가 필요. 일단 그룹장만되도록함.
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.remove(group);
    await userToDefaultGroupForNotBelongToAnyGroup(lawFirm, transactionManager);
  });
  return { group: group };
}

// 그룹에 유저 추가
export async function addUser(
  user: User,
  lawFirm: LawFirm,
  targetUserIdx: number,
  groupIdx: number
) {
  //
  // 퍼미션체크 추가 필요. 일단 그룹장만되도록함.
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  const targetUser = await getRepository(User).findOne({
    where: {
      idx: targetUserIdx,
      lawFirm: lawFirm,
    },
  });

  if (targetUser === undefined) {
    throw { error: "not_exist_user" };
  }

  const targetGroup = await getRepository(Group).findOne({
    relations: ["users"],
    where: {
      idx: groupIdx,
      lawFirm: lawFirm,
    },
  });
  if(targetGroup === undefined){
    throw {error: "not_exist_group"};
  }

  targetGroup.users.push(targetUser);

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(targetGroup);
    await userToDefaultGroupForNotBelongToAnyGroup(lawFirm, transactionManager);
  });

  return { user: targetUser };
}

// 그룹에서 유저 삭제
export async function removeUser(
  user: User,
  lawFirm: LawFirm,
  targetUserIdx: number,
  groupIdx: number
) {
  // 만약, 유저가 아무 그룹에 속해있지 않게 된다면, 기본 그룹에 추가
  // 퍼미션체크 추가 필요. 일단 그룹장만되도록함.
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  const targetUser = await getRepository(User).findOne({
    where: {
      idx: targetUserIdx,
      lawFirm: lawFirm,
    },
  });

  if (targetUser === undefined) {
    throw { error: "not_exist_user" };
  }

  const targetGroup = await getRepository(Group).findOne({
    relations: ["users"],
    where: {
      idx: groupIdx,
      lawFirm: lawFirm,
    },
  });

  if(targetGroup === undefined){
    throw {error: "not_exist_group"};
  }
  targetGroup.users = targetGroup.users.filter((elementUser: User) => {
    return elementUser.idx !== targetUser.idx;
  });

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(targetGroup);
    await userToDefaultGroupForNotBelongToAnyGroup(lawFirm, transactionManager);
  });

  return { user: targetUser };
}

export async function update(
  user:User,
  lawFirm:LawFirm,
  groupIdx:number,
  name:string,
  description:string,
){

  // 만약, 유저가 아무 그룹에 속해있지 않게 된다면, 기본 그룹에 추가
  // 퍼미션체크 추가 필요. 일단 그룹장만되도록함.
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  const targetGroup = await getRepository(Group).findOne({
    where: {
      idx: groupIdx,
      lawFirm: lawFirm,
    },
  });

  if(targetGroup === undefined){
    throw {error: "not_exist_group"};
  }

  targetGroup.name = name;
  targetGroup.description = description;
  await getRepository(Group).save(targetGroup);

  return {group:targetGroup};
}

/// Internal Function

async function userToDefaultGroupForNotBelongToAnyGroup(
  lawFirm: LawFirm,
  transactionManager: any
) {
  const defaultGroup = await transactionManager.getRepository(Group).findOne({
    relations: ["users"],
    where: { name: "기본", lawFirm: lawFirm },
  });
  const allUsers: User[] = await transactionManager
    .getRepository(User)
    .find({ where: { lawFirm: lawFirm }, relations: ["groups"] });

  const notBelongToAnyGroupUsers = allUsers.filter((elementUser: User) => {
    return elementUser.groups.length === 0;
  });

  if (notBelongToAnyGroupUsers.length === 0) {
    return;
  }
  
  defaultGroup.users = defaultGroup.users.concat(notBelongToAnyGroupUsers);
  await transactionManager.save(defaultGroup);
}

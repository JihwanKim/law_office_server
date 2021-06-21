import { EntityManager, getManager, getRepository } from "typeorm";
import { Group } from "../../entity/Group";
import { LawFirm } from "../../entity/LawFirm";
import { LawFirmJoinRequest } from "../../entity/LawFirmJoinRequest";
import { Permission } from "../../entity/Permission";
import { User, UserType } from "../../entity/User";

// lawfirm 해체
export async function disband(user: User, lawFirm: LawFirm) {
  if (user.idx === lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  user.lawFirm = null;
  lawFirm.ownerUser = null;
  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(user);
    // on delete cascade로 엮여있는 모든것 제거.
    await transactionManager.save(lawFirm);
    await transactionManager.remove(lawFirm);
  });
}

// lawfirm 탈퇴
export async function withdraw(user: User, lawFirm: LawFirm) {
  const userRepo = getRepository(User);

  // 로펌장일경우, 다른사람에게 권한을 양도한 다음에 탈퇴 가능.
  // 사람이 남아있을 경우, 전부 강퇴후 해체 / 그냥 해체 / 권한자동이저
  if (user.idx === lawFirm.ownerUser.idx) {
    throw { error: "cannot_withdraw" };
  }

  user = await userRepo.findOne({
    relations: ["groups"],
    where: { idx: user.idx },
  });

  user.groups = [];
  user.lawFirm = null;

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.save(user);
    // await transactionManager.remove(user.groups);
  });
}

export async function create(
  user: User,
  name: string,
  address: string,
  telephone: string
) {
  // 이미 로펌이 있으면 패스
  if (user.lawFirm !== null) {
    throw { error: "already_join_lawFirm" };
  }

  if (user.type !== UserType.LAWYER) {
    throw { error: "employee_cannot_create_lawfirm" };
  }

  const lawFirm = new LawFirm();
  lawFirm.address = address;
  lawFirm.name = name;
  lawFirm.telephone = telephone;
  lawFirm.ownerUser = user;
  lawFirm.users = [user];

  const permissionAdmin = new Permission();
  permissionAdmin.version = 0;
  permissionAdmin.permission = JSON.stringify([]);

  const lawFirmAdminGroup = new Group();
  lawFirmAdminGroup.lawFirm = lawFirm;
  lawFirmAdminGroup.name = "관리자";
  lawFirmAdminGroup.users = [user];
  lawFirmAdminGroup.description = "관리자 그룹";
  lawFirmAdminGroup.permission = permissionAdmin;

  const permissionDefault = new Permission();
  permissionDefault.version = 0;
  permissionDefault.permission = JSON.stringify([]);

  const lawFirmNormalUserGroup = new Group();
  lawFirmNormalUserGroup.lawFirm = lawFirm;
  lawFirmNormalUserGroup.name = "기본";
  lawFirmNormalUserGroup.users = [];
  lawFirmNormalUserGroup.description = "기본 그룹";
  lawFirmNormalUserGroup.permission = permissionDefault;

  lawFirm.groups = [lawFirmAdminGroup, lawFirmNormalUserGroup];

  user.lawFirm = lawFirm;

  await getManager().transaction(async (transactionManager: any) => {
    await _clearRequestAllByUser(user, transactionManager);

    await transactionManager.save(lawFirm);

    await transactionManager.save(permissionAdmin);
    await transactionManager.save(lawFirmAdminGroup);

    await transactionManager.save(permissionDefault);
    await transactionManager.save(lawFirmNormalUserGroup);

    await transactionManager.save(user);
  });

  user.lawFirm = undefined;
  lawFirmAdminGroup.lawFirm = undefined;
  lawFirmNormalUserGroup.lawFirm = undefined;
  return { lawFirm: lawFirm };
}

export async function update(
  user: User,
  lawfirm: LawFirm,
  name?: string,
  address?: string,
  telephone?: string,
  joinCode?:string,
) {
  if (lawfirm.ownerUser.idx !== user.idx) {
    throw { error: "has_not_permission" };
  }

  lawfirm.name = name ? name : lawfirm.name;
  lawfirm.address = address ? address : lawfirm.address;
  lawfirm.telephone = telephone ? telephone : lawfirm.telephone;
  if(joinCode){
    lawfirm.joinCode = "";
  }

  const lawFirmRepo = await getRepository(LawFirm);
  await lawFirmRepo.save(lawfirm);

  return lawfirm;
}

export async function joinAccept(
  user: User,
  lawFirm: LawFirm,
  requestIdx: number
) {
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);

  const joinInfo = await lawFirmJoinRequestRepo.findOne({
    relations: ["user"],
    where: { lawFirm: lawFirm, idx: requestIdx },
  });

  if (joinInfo == null) {
    throw { error: "not_exist_join_request" };
  }

  const groupRepo = getRepository(Group);
  const defaultGroup = await groupRepo.findOne({
    relations: ["users"],
    where: { lawFirm: lawFirm, name: "기본" },
  });
  defaultGroup.users.push(joinInfo.user);
  joinInfo.user.lawFirm = lawFirm;

  await getManager().transaction(async (transactionManager: any) => {
    await _clearRequestAllByUser(joinInfo.user, transactionManager);
    await transactionManager.save(defaultGroup);
    await transactionManager.save(joinInfo.user);
  });

  return { user: joinInfo.user };
}

// 가입요청 거절
export async function joinReject(
  user: User,
  lawFirm: LawFirm,
  requestIdx: number
) {
  if (user.idx !== lawFirm.ownerUser.idx) {
    throw { error: "has_not_permission" };
  }

  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);

  const joinInfo = await lawFirmJoinRequestRepo.findOne({
    relations: ["user"],
    where: { lawFirm: lawFirm, idx: requestIdx },
  });

  if (joinInfo == null) {
    throw { error: "not_exist_join_request" };
  }

  await getManager().transaction(async (transactionManager: any) => {
    await transactionManager.remove(joinInfo);
  });

  return { user: joinInfo.user };

}

// 로펌에 유저가 소속되어있는지 체크하는 Function
export async function isUserBelongToLawFirmByUser(
  user: User,
  lawFirm: LawFirm
) {
  if (user !== undefined && user.lawFirm !== undefined && user.lawFirm.idx === lawFirm.idx) {
    return true;
  } else {
    return false;
  }
}

export async function isUserBelongToLawFirmByUserIdx(
  userIdx: Number,
  lawFirm: LawFirm
) {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne({
    where: { idx: userIdx },
    relations: ["lawFirm"],
  });
  return isUserBelongToLawFirmByUser(user, lawFirm);
}

///
/// INTERNAL FUNCTION
///

// 가입 혹은 로펌 생성시, 모든 요청사항 지워버리기.
async function _clearRequestAllByUser(user: User, transactionManager: any) {
  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);
  const userAllReqests = await lawFirmJoinRequestRepo.find({
    relations: ["user"],
    where: { user: user },
  });
  if (userAllReqests) {
    await transactionManager.remove(userAllReqests);
  }
}

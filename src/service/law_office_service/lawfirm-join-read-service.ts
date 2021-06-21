import { getRepository } from "typeorm";
import { LawFirm } from "../../entity/LawFirm";
import { LawFirmJoinRequest } from "../../entity/LawFirmJoinRequest";
import { User } from "../../entity/User";

export async function getAll(user: User, lawFirm: LawFirm) {
  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);

  // 접근권한은 그룹장만 ? 아니면 다른사람들도?. 일단 패스 다볼수있게함.

  return {
    lawFirmJoinRequests: await lawFirmJoinRequestRepo.find({
      relations:["user"],
      where:{lawFirm: lawFirm},
    }),
  };
}

export async function getAllForRequestUser(user: User) {
  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);

  let requests:LawFirmJoinRequest[] = await lawFirmJoinRequestRepo.find({
    relations:["lawFirm"],
    where:{user: user},
  });

  requests = requests.map((element:LawFirmJoinRequest)=>{
    return element.lawFirm.joinCode = undefined;
    
  });
  return {
    lawFirmJoinRequests: await lawFirmJoinRequestRepo.find({
      relations:["lawFirm"],
      where:{user: user},
    }),
  };
}
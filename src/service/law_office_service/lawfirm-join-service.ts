import { getRepository } from "typeorm";
import { LawFirm } from "../../entity/LawFirm";
import { LawFirmJoinRequest } from "../../entity/LawFirmJoinRequest";
import { User } from "../../entity/User";

export async function joinRequestByCode(
  user: User,
  joinCode: string,
) {

  user = await getRepository(User).findOne({relations:["lawFirm"],where:{idx:user.idx}});
  if(user.lawFirm !== null){
    throw ({error: "already_joined_lawfirm"});
  }
  const lawFirmRepo = getRepository(LawFirm);
  const lawFirm = await lawFirmRepo.findOne({ joinCode: joinCode });
  if (!lawFirm) {
    throw ({ error: "not_exist_lawfirm" });
  }

  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);
  if (await lawFirmJoinRequestRepo.findOne({ user: user, lawFirm: lawFirm })) {
    throw ({ error: "already_join_request" });
  }

  const lawFirmJoinRequest = new LawFirmJoinRequest();
  lawFirmJoinRequest.lawFirm = lawFirm;
  lawFirmJoinRequest.user = user;
  await lawFirmJoinRequestRepo.save(lawFirmJoinRequest);
  return  { lawFirmJoinRequest: lawFirmJoinRequest };
}

export async function joinRequestCancel(
  user: User,
  joinRequestIdx:number,
) {
  const lawFirmRepo = getRepository(LawFirm);
  const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);
  const lawFirmJoinRequest = await lawFirmJoinRequestRepo.findOne(
    { user: user, idx: joinRequestIdx },
  );
  if (!lawFirmJoinRequest) {
    throw ({ error: "not_exist_lawfirm_join_request" });
  }

  lawFirmJoinRequestRepo.remove(lawFirmJoinRequest);

  return { lawFirmJoinRequest: lawFirmJoinRequest };
}

import { getRepository } from "typeorm";
import { Consulting } from "../../entity/Consulting";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";

export async function checkPermission(
  lawFirmIdx: number,
  userIdx: number,
  permissionName: string,
) {
  const lawFirmRepo = getRepository(LawFirm);
  const lawFirm = await lawFirmRepo.findOne({ idx: lawFirmIdx });
  if (!lawFirm) {
    throw ({ error: "not_exist_lawfirm" });
  }
  return true;
}

export async function checkCreateConsultingPermission(
  lawFirm: LawFirm,
  user: User,
) {
  return true;
}
export async function checkDeleteConsultingPermission(
  lawFirm: LawFirm,
  user: User,
  consulting: Consulting,
) {
  return true;
}
export async function checkUpdateConsultingPermission(
  lawFirm: LawFirm,
  user: User,
  consulting: Consulting,
) {
  return true;
}
export async function checkReadConsultingPermission(
  lawFirm: LawFirm,
  user: User,
  consulting: Consulting,
) {
  return true;
}

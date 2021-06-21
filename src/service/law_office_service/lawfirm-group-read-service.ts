import { getRepository } from "typeorm";
import { Group } from "../../entity/Group";
import { LawFirm } from "../../entity/LawFirm";

export async function getAll(lawFirm: LawFirm) {
  const groups = await getRepository(Group).find({
    where: {
      lawFirm: lawFirm,
    },
    relations: ["users"],
  });
  return { groups: groups };
}

import { getRepository } from "typeorm";
import { LawFirm } from "../../entity/LawFirm";

export async function get(lawFirm:LawFirm){
  lawFirm = await getRepository(LawFirm).findOne({where:{
    idx:lawFirm.idx
  }});
  return {lawFirm:lawFirm};
}
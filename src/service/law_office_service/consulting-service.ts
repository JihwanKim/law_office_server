import { getRepository } from "typeorm";
import { Consulting } from "../../entity/Consulting";
import { Customer } from "../../entity/Customer";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import * as Permission from "./permission-service";

export async function newConsulting(
  user: User,
  lawFirm: LawFirm,
  customerIdx: number,
  title: string,
  contentFormat: string,
  content: string,
  uniqueness: string,
) {
  const customerRepo = getRepository(Customer);
  const customer = await customerRepo.findOne({ idx: customerIdx });
  if (!customer) {
    throw ({ error: "not_exist_customer" });
  }

  if (!await Permission.checkCreateConsultingPermission(lawFirm, user)) {
    throw ({ error: "has_not_auth" });
  }

  const consultingRepo = getRepository(Consulting);
  const consulting = new Consulting();
  consulting.title = title;
  consulting.contentFormat = contentFormat;
  consulting.content = content;
  consulting.uniqueness = uniqueness;
  consulting.customer = customer;
  await consultingRepo.save(consulting);

  return { consulting: consulting } ;
}

export async function updateConsulting(
  user: User,
  lawFirm: LawFirm,
  customerIdx: number,
  consultingIdx: number,
  title: string,
  contentFormat: string,
  content: string,
  uniqueness: string,
) {
  const customerRepo = getRepository(Customer);
  const customer = await customerRepo.findOne({ idx: customerIdx });
  if (!customer) {
    throw ({ error: "not_exist_customer" });
  }
  if (customer.lawFirm.idx != lawFirm.idx) {
    throw ({ error: "has_not_auth" });
  }

  const consultingRepo = getRepository(Consulting);
  const consulting = await consultingRepo.findOne({ idx: consultingIdx });

  if (
    !await Permission.checkUpdateConsultingPermission(lawFirm, user, consulting)
  ) {
    throw ({ error: "has_not_auth" });
  }

  consulting.title = title ? title : consulting.title;
  consulting.contentFormat = contentFormat
    ? contentFormat
    : consulting.contentFormat;
  consulting.content = content ? content : consulting.content;
  consulting.uniqueness = uniqueness ? uniqueness : consulting.uniqueness;
  consulting.customer = customerIdx ? customer : consulting.customer;
  await consultingRepo.save(consulting);
  return { consulting: consultingRepo };
}

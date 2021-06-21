import { getManager, getRepository } from "typeorm";
import { Customer } from "../../entity/Customer";
import { LawFirm } from "../../entity/LawFirm";

export async function newCustomer(
  lawFirm: LawFirm,
  name: string,
  phoneNumber: string,
  sex: string,
  country?: string,
  email?: string,
  birthday?: string,
  description?: string,
) {
  if (!lawFirm) {
    throw ({ error: "not_exist_law_firm" });
  }

  const customer: Customer = new Customer();
  customer.name = name;
  customer.email = email;
  customer.birthday = birthday;
  customer.phoneNumber = phoneNumber;
  customer.sex = sex;
  customer.country = country;
  customer.description = description ? description : customer.description;
  customer.lawFirm = lawFirm;

  const customerRepo = getRepository(Customer);
  await customerRepo.save(customer);
  return  { customer: customer } ;
}

export async function updateCustomer(
  lawFirm: LawFirm,
  customerIdx: number,
  name?: string,
  phoneNumber?: string,
  sex?: string,
  country?: string,
  email?: string,
  birthday?: string,
  description?: string,
) {
  const customerRepo = getRepository(Customer);
  const customer = await customerRepo.findOne({ idx: customerIdx });
  if (!customer) {
    throw ({ erorr: "not_exist_customer" });
  }

  if (lawFirm.idx != customer.lawFirm.idx) {
    throw ({ error: "has_not_auth" });
  }

  customer.name = name ? name : customer.name;
  customer.email = email ? email : customer.email;
  customer.birthday = birthday ? birthday : customer.birthday;
  customer.phoneNumber = phoneNumber ? phoneNumber : customer.phoneNumber;
  customer.sex = sex ? sex : customer.sex;
  customer.country = country ? country : customer.country;
  customer.description = description ? description : customer.description;

  customerRepo.save(customer);
  return { customer: customer } ;
}

export async function updateLastConsutingDate(
  lawFirm: LawFirm,
  customerIdx: number,
) {
  const customerRepo = getRepository(Customer);
  const customer = await customerRepo.findOne({ idx: customerIdx });

  if (lawFirm.idx != customer.lawFirm.idx) {
    throw ({ error: "has_not_auth" });
  }

  customer.lastConsultingDate = new Date();

  await customerRepo.save(customer);
  return { customer: customer };
}

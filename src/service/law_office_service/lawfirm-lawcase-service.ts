import { getRepository } from "typeorm";
import { Customer } from "../../entity/Customer";
import { LawCase, LawCaseStataus as LawCaseStatus } from "../../entity/LawCase";
import { LawFirm } from "../../entity/LawFirm";
import { User, UserType } from "../../entity/User";

export async function create(
  lawFirm: LawFirm,
  title: string,
  description: string
) {
  const lawCase = new LawCase();
  lawCase.title = title;
  lawCase.description = description;
  lawCase.lawFirm = lawFirm;

  await getRepository(LawCase).save(lawCase);

  lawCase.lawFirm = undefined;

  return { lawCase: lawCase };
}

export async function update(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number,
  title: string,
  description: string,
  lawCaseStatus: LawCaseStatus
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }

  await _checkUpdatePermission(user, lawCase);

  lawCase.title = title;
  lawCase.description = description;
  lawCase.lawStatus = lawCaseStatus;

  await getRepository(LawCase).save(lawCase);

  lawCase.lawFirm = undefined;

  return { lawCase: lawCase };
}

export async function addUser(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number,
  targetUserIdx:number,
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
    relations: ["users"],
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }
  await _checkUpdatePermission(user, lawCase);
  
  const targetUser = await getRepository(User).findOne({
    where: { idx: targetUserIdx, lawFirm:lawFirm },
  });
  if (targetUser === undefined) {
    throw { error: "not_exist_user" };
  }
  if(targetUser.type !== UserType.LAWYER){
    throw  {error : "user_can_be_lawyer"};
  }

  lawCase.users.push(targetUser);
  await getRepository(LawCase).save(lawCase);
  lawCase.lawFirm = undefined;
  return { lawCase: lawCase };
}

export async function removeUser(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number,
  targetUserIdx: number
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
    relations: ["users"],
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }
  lawCase.users = lawCase.users.filter((elementUser: User) => {
    return elementUser.idx !== targetUserIdx;
  });
  await _checkUpdatePermission(user, lawCase);

  await getRepository(LawCase).save(lawCase);
  lawCase.lawFirm = undefined;
  return { lawCase: lawCase };
}

export async function addCustomer(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number,
  customerIdx: number
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
    relations: ["customers"],
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }

  const customer = await getRepository(Customer).findOne({
    where: { idx: customerIdx },
  });
  if (customer === undefined) {
    throw { error: "not_exist_customer" };
  }
  await _checkUpdatePermission(user, lawCase);

  lawCase.customers.push(customer);
  await getRepository(LawCase).save(lawCase);
  lawCase.lawFirm = undefined;
  return { lawCase: lawCase };
}

export async function removeCustomer(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number,
  customerIdx: number
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
    relations: ["customers"],
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }
  await _checkUpdatePermission(user, lawCase);
  lawCase.customers = lawCase.customers.filter((elementCustomer: Customer) => {
    return elementCustomer.idx !== customerIdx;
  });

  await getRepository(LawCase).save(lawCase);
  lawCase.lawFirm = undefined;
  return { lawCase: lawCase };
}

export async function remove(
  user: User,
  lawFirm: LawFirm,
  lawCaseIdx: number
) {
  const lawCase = await getRepository(LawCase).findOne({
    where: { idx: lawCaseIdx, lawFirm: lawFirm },
    relations: ["customers"],
  });
  if (lawCase === undefined) {
    throw { error: "not_exist_lawcase" };
  }
  await _checkRemovePermission(user, lawCase);

  await getRepository(LawCase).remove(lawCase);
  lawCase.lawFirm = undefined;
  return { lawCase: lawCase };
}

/// Internal Function

async function _checkUpdatePermission(user: User, lawCase: LawCase) {}

async function _checkRemovePermission(user: User, lawCase: LawCase) {}

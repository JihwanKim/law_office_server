import { getRepository } from "typeorm";
import { Customer } from "../../entity/Customer";
import { LawFirm } from "../../entity/LawFirm";

enum CustomerOrderItem {
  IDX = "idx",
  LAST_CONSULTING_DATE = "lastConsultingDate",
}

export async function readAllCustomer(
  lawFirm: LawFirm,
  page: number,
  orderKey: string, // idx, lastConsultingDate
  reverse: boolean,
  limit: number,
  type?: string,
  targetValue?: any
) {
  const customerRepo = await getRepository(Customer);
  if (!lawFirm) {
    throw { error: "invalid_law_firm" };
  }

  if (
    !(
      orderKey === CustomerOrderItem.IDX ||
      orderKey === CustomerOrderItem.LAST_CONSULTING_DATE
    )
  ) {
    throw { error: "invalid_order_key" };
  }
  const order = {};
  switch (type) {
    case "idx":
      return {
        customers: await customerRepo.find({
          relations: ["consultings"],
          where: { lawFirm: lawFirm, idx: targetValue },
        }),
      };
    case "phoneNumber":
      order[orderKey] = reverse ? "DESC" : "ASC";
      return {
        customers: await customerRepo.find({
          relations: ["consultings"],
          where: { lawFirm: lawFirm, phoneNumber: targetValue },
          order: order,
          skip: limit * page,
          take: limit,
        }),
      };
    case "birthday":
      order[orderKey] = reverse ? "DESC" : "ASC";
      return {
        customers: await customerRepo.find({
          relations: ["consultings"],
          where: { lawFirm: lawFirm, birthday: targetValue },
          order: order,
          skip: limit * page,
          take: limit,
        }),
      };
    default:
      order[orderKey] = reverse ? "DESC" : "ASC";
      return {
        customers: await customerRepo.find({
          relations: ["consultings"],
          where: { lawFirm: lawFirm },
          order: order,
          skip: limit * page,
          take: limit,
        }),
      };
  }
}

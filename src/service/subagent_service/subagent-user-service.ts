import { UserInfo } from "os";
import { getManager, getRepository } from "typeorm";
import { BankAccount } from "../../entity/BankAccount";
import { LawyerAffiliation } from "../../entity/LawyerAffiliation";
import { User } from "../../entity/User";

export async function getUserInfo(user: User, userIdx: number) {
  const userRepo = await getRepository(User);

  const targetUser =
    user.idx == userIdx
      ? await userRepo.findOne({
          where: {
            idx: userIdx,
          },
          relations: ["bankAccount", "lawyerAffiliation"],
        })
      : await userRepo.findOne({
          where: {
            idx: userIdx,
          },
          relations: ["bankAccount", "lawyerAffiliation", "lawyerInfo"],
        });

  if (!targetUser) {
    throw { error: "not_exist_user" };
  }

  return { user: targetUser };
}

export async function updateUserInfo(
  user: User,
  name: string,
  phoneNumber: string,
  lawyerAffiliationOffice: string,
  lawyerAffiliationBranch: string,
  bankAccountInfo: string
) {
  const userRepo = await getRepository(User);
  const userInfo = await userRepo.findOne({
    relations: ["bankAccount", "lawyerAffiliation"],
    where: { idx: user.idx },
  });

  userInfo.name = name;
  userInfo.phoneNumber = phoneNumber;

  await getManager().transaction(async (transactionManager: any) => {
    if (userInfo.lawyerAffiliation) {
      userInfo.lawyerAffiliation.affiliationOffice = lawyerAffiliationOffice;
      userInfo.lawyerAffiliation.affiliationBranch = lawyerAffiliationBranch;
      await transactionManager.save(userInfo.lawyerAffiliation);
    } else {
      const lawyerAffiliation = new LawyerAffiliation();
      lawyerAffiliation.affiliationOffice = lawyerAffiliationOffice;
      lawyerAffiliation.affiliationBranch = lawyerAffiliationBranch;
      await transactionManager.save(lawyerAffiliation);
      userInfo.lawyerAffiliation = lawyerAffiliation;
    }

    if (userInfo.bankAccount) {
      userInfo.bankAccount.info = bankAccountInfo;
      await transactionManager.save(userInfo.bankAccount);
    } else {
      const bankAccount = new BankAccount();
      bankAccount.info = bankAccountInfo;
      await transactionManager.save(bankAccount);
      userInfo.bankAccount = bankAccount;
    }
    await transactionManager.save(userInfo);
  });
  return { user: userInfo };
}

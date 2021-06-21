import {
  getManager,
  getRepository,
} from "typeorm";
import { User, UserType } from "../../entity/User";
import { AuthType, UserAuth } from "../../entity/UserAuth";
import { LawyerInfo } from "../../entity/LawyerInfo";

export async function signUp(
  userType: UserType, // employee or lawyer
  name: string,
  email: string,
  birthday: string,
  phoneNumber: string,
  authType: AuthType, // normal, email, provider
  id: string,
  password: string,
  // lawyer!
  serialNumber?: string, // 일련번호
  issueNumber?: string // 발급번호
) {
  if (userType == UserType.LAWYER) {
    await lawyerCondition(serialNumber, issueNumber);
  }

  const user = new User();
  user.type = userType;
  user.name = name;
  user.birthday = birthday;
  user.email = email;
  user.phoneNumber = phoneNumber;

  const userAuth = new UserAuth();
  userAuth.id = id;
  userAuth.password = password;
  userAuth.type = authType;

  const lawyerInfo = new LawyerInfo();
  lawyerInfo.serialNumber = serialNumber;
  lawyerInfo.issueNumber = issueNumber;
  lawyerInfo.isVarification = false;

  user.auths = [userAuth];
  if (userType === UserType.LAWYER) {
    user.lawyerInfo = lawyerInfo;
  }

  await getManager()
    .transaction(async (TransactionManager: any) => {
      await TransactionManager.save(userAuth);
      if (user.lawyerInfo) {
        await TransactionManager.save(lawyerInfo);
      }
      await TransactionManager.save(user);
    })
    .catch((err: any) => {
      switch (err.code) {
        case "ER_DUP_ENTRY":
          // do something
          throw {error:"duplicated_user"};
        default:
          throw err;
      }
    });

  userAuth.password = null;
  return {user:user};
}

export function addAuth(
  userIdx: number,
  type: AuthType,
  id: string,
  password: string
) {}

/// internal function

async function lawyerCondition(serialNumber: string, issueNumber: string) {
  if (!serialNumber) {
    throw { error: "require_serial_number" };
  }
  if (!issueNumber) {
    throw { error: "require_issue_number" };
  }
  const lawyerInfoRepo = getRepository(LawyerInfo);
  const isAlreadySerialNumber = await lawyerInfoRepo.findOne({
    serialNumber: serialNumber,
    isVarification: true,
  });
  const isAlreadyIssueNumber = await lawyerInfoRepo.findOne({
    issueNumber: issueNumber,
    isVarification: true,
  });
  if (isAlreadySerialNumber || isAlreadyIssueNumber) {
    throw { error: "already_exist_serial_number_or_issue_number" };
  }
}

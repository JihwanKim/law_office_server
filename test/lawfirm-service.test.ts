import {
  Connection,
  createConnection,
  getConnectionOptions,
  getRepository,
} from "typeorm";
import { User, UserType } from "../src/entity/User";
import { AuthType } from "../src/entity/UserAuth";
import { LawFirm } from "../src/entity/LawFirm";
import { LawFirmJoinRequest } from "../src/entity/LawFirmJoinRequest";

import * as AuthService from "../src/service/auth-service";
import * as CustomerService from "../src/service/customer-service";
import * as LawFirmService from "../src/service/lawfirm-service";
import * as LawFirmJoinService from "../src/service/lawfirm-join-service";
import * as LawFirmPermissionService from "../src/service/lawfirm-permission-service";
import * as LawFirmGroupService from "../src/service/lawfirm-group-service";

import * as LawFirmLawcaseService from "../src/service/lawfirm-lawcase-service";
// import * as LawFirmGroupService from "../src/service/lawfirm-group-service";

import { LawyerInfo } from "../src/entity/LawyerInfo";
import { Group } from "../src/entity/Group";
import { LawFirmOwner } from "../src/entity/LawFirmOwner";
import { LawCaseStataus } from "../src/entity/LawCase";

describe("LawFirm", () => {
  let connection: Connection;
  let lawyerLawFirmOwner: User;
  let lawyerInLawFirm: User;
  let lawyerOtherLawFirmOwner: User;
  let employeeForWithdraw: User;
  let employeeInLawFirm: User;

  let lawFirm: LawFirm;

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    connection = await createConnection({
      ...connectionOptions,
      name: "default",
    });

    const tempLawyer = (
      await AuthService.signUp(
        UserType.LAWYER, // employee or lawyer
        "이름",
        "test@test.com",
        "2000-01-01",
        "8210123412341234",
        AuthType.NORMAL, // normal, email, provider
        "lawyer_id",
        "1234",
        // lawyer!
        "serialNumberTest", // 일련번호
        "issueNumberTest" // 발급번호
      )
    ).user;
    const tempLawyer2 = (
      await AuthService.signUp(
        UserType.LAWYER, // employee or lawyer
        "이름",
        "test@test.com",
        "2000-01-01",
        "8210123412341234",
        AuthType.NORMAL, // normal, email, provider
        "lawyer_id2",
        "1234",
        // lawyer!
        "serialNumberTest2", // 일련번호
        "issueNumberTest2" // 발급번호
      )
    ).user;
    const tempLawyer3 = (
      await AuthService.signUp(
        UserType.LAWYER, // employee or lawyer
        "이름",
        "test@test.com",
        "2000-01-01",
        "8210123412341234",
        AuthType.NORMAL, // normal, email, provider
        "lawyer_id3",
        "1234",
        // lawyer!
        "serialNumberTest3", // 일련번호
        "issueNumberTest3" // 발급번호
      )
    ).user;
    const tempEmployee = (
      await AuthService.signUp(
        UserType.EMPLOYEE, // employee or lawyer
        "이름",
        "test@test.com",
        "2000-01-01",
        "8210123412341234",
        AuthType.NORMAL, // normal, email, provider
        "employee_id",
        "1234"
      )
    ).user;
    const tempEmployee2 = (
      await AuthService.signUp(
        UserType.EMPLOYEE, // employee or lawyer
        "이름",
        "test@test.com",
        "2000-01-01",
        "8210123412341234",
        AuthType.NORMAL, // normal, email, provider
        "employee_id2",
        "1234"
      )
    ).user;

    const userRepo = getRepository(User);
    lawyerLawFirmOwner = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: tempLawyer.idx },
    });
    lawyerInLawFirm = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: tempLawyer2.idx },
    });
    lawyerOtherLawFirmOwner = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: tempLawyer3.idx },
    });
    employeeForWithdraw = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: tempEmployee.idx },
    });
    employeeInLawFirm = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: tempEmployee2.idx },
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {});

  test("createLawFirm", async () => {
    // 계속 joinClumns of undefined 떠서 일단 뺴버림
    const result = await LawFirmService.create(
      lawyerLawFirmOwner,
      "name",
      "addr",
      "01012341234"
    );
    lawFirm = result.lawFirm;
    expect(lawFirm).toBeDefined();

    await LawFirmService.create(
      lawyerOtherLawFirmOwner,
      "name",
      "addr",
      "01012341234"
    );

    try {
      await LawFirmService.create(
        employeeForWithdraw,
        "name",
        "addr",
        "01012341234"
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "employee_cannot_create_lawfirm" });
    }

    try {
      await LawFirmService.create(
        lawyerLawFirmOwner,
        "name",
        "addr",
        "01012341234"
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "already_join_lawFirm" });
    }
  });

  test("joinRequestLawFirm", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({ idx: 1 });

    const result = await LawFirmJoinService.joinRequestByCode(
      employeeForWithdraw,
      lawFirm.joinCode
    );
    expect(result.lawFirmJoinRequest).toBeDefined();

    await LawFirmJoinService.joinRequestByCode(
      employeeInLawFirm,
      lawFirm.joinCode
    );
    await LawFirmJoinService.joinRequestByCode(
      lawyerInLawFirm,
      lawFirm.joinCode
    );
    try {
      await LawFirmJoinService.joinRequestByCode(
        employeeForWithdraw,
        lawFirm.joinCode
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "already_join_request" });
    }

    try {
      await LawFirmJoinService.joinRequestByCode(
        employeeForWithdraw,
        "dsgdsflkjlkwf"
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawfirm" });
    }
  });

  test("joinAccept", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    try {
      await LawFirmService.joinAccept(employeeForWithdraw, lawFirm, 1);
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }

    const result = await LawFirmService.joinAccept(
      lawyerLawFirmOwner,
      lawFirm,
      1
    );
    expect(result.user).toBeDefined();
    await LawFirmService.joinAccept(lawyerLawFirmOwner, lawFirm, 2);
    await LawFirmService.joinAccept(lawyerLawFirmOwner, lawFirm, 3);

    try {
      await LawFirmService.joinAccept(lawyerLawFirmOwner, lawFirm, 1);
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_join_request" });
    }

    const lawFirmJoinRequestRepo = getRepository(LawFirmJoinRequest);

    const joinInfo = await lawFirmJoinRequestRepo.findOne({
      relations: ["user"],
      where: { user: employeeForWithdraw },
    });
    expect(joinInfo).toBeUndefined();
  });

  test("withdraw", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    await LawFirmService.withdraw(employeeForWithdraw, lawFirm);

    const userRepo = getRepository(User);

    const user = await userRepo.findOne({
      relations: ["groups"],
      where: { idx: employeeForWithdraw.idx },
    });

    expect(user.groups).toEqual([]);

    try {
      await LawFirmService.withdraw(lawyerLawFirmOwner, lawFirm);
    } catch (error) {
      expect(error).toStrictEqual({ error: "cannot_withdraw" });
    }
  });

  //customer
  test("customer", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });
    const custoemrRs = await CustomerService.newCustomer(
      lawFirm,
      "테스트이름",
      "8210123412341234",
      "MALE",
      "대한민국",
      "test@test.com",
      "2000-01-01",
      "설명"
    );
    expect(custoemrRs.customer).toBeDefined();
    // newCustomer;
  });

  // 유저 로펌에 속해있는지
  test("userBelongToLawFirm", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const userRepo = getRepository(User);
    employeeInLawFirm = await userRepo.findOne({
      where: { idx: employeeInLawFirm.idx },
      relations: ["lawFirm"],
    });
    lawyerOtherLawFirmOwner = await userRepo.findOne({
      where: { idx: lawyerOtherLawFirmOwner.idx },
      relations: ["lawFirm"],
    });

    expect(
      await LawFirmService.isUserBelongToLawFirmByUser(
        employeeInLawFirm,
        lawFirm
      )
    ).toBeTruthy();
    expect(
      await LawFirmService.isUserBelongToLawFirmByUser(
        lawyerOtherLawFirmOwner,
        lawFirm
      )
    ).toBeFalsy();
    expect(
      await LawFirmService.isUserBelongToLawFirmByUserIdx(4444, lawFirm)
    ).toBeFalsy();
    expect(
      await LawFirmService.isUserBelongToLawFirmByUserIdx(
        lawyerOtherLawFirmOwner.idx,
        lawFirm
      )
    ).toBeFalsy();
  });
  // 권한 수정
  // test("permissionUpdate", async () => {
  //   const lawFirmRepo = getRepository(LawFirm);
  //   lawFirm = await lawFirmRepo.findOne({
  //     where: { idx: 1 },
  //     relations: ["ownerUser"],
  //   });
  //   // 작업해야함!
  // });

  // 그룹 추가
  test("newGroup", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    // 작업해야함!
    const lawFirmGroupResult = await LawFirmGroupService.create(
      lawyerLawFirmOwner,
      lawFirm,
      "newGroup",
      "description",
      1,
      [1, 1, 1, 1, 1]
    );
    expect(lawFirmGroupResult.group).toBeDefined();

    try {
      await LawFirmGroupService.create(
        lawyerLawFirmOwner,
        lawFirm,
        "기본",
        "description",
        1,
        [1, 1, 1, 1, 1]
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "cannot_use_this_name" });
    }
    try {
      await LawFirmGroupService.create(
        lawyerLawFirmOwner,
        lawFirm,
        "관리자",
        "description",
        1,
        [1, 1, 1, 1, 1]
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "cannot_use_this_name" });
    }
    try {
      await LawFirmGroupService.create(
        lawyerInLawFirm,
        lawFirm,
        "testName",
        "description",
        1,
        [1, 1, 1, 1, 1]
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }

    try {
      await LawFirmGroupService.create(
        employeeInLawFirm,
        lawFirm,
        "testName",
        "description",
        1,
        [1, 1, 1, 1, 1]
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
  });

  // 그룹에 유저 추가
  test("addUserToGroup", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawFirmGroup = await getRepository(Group).findOne({
      where: {
        lawFirm: lawFirm,
        name: "newGroup",
      },
    });

    const rs = await LawFirmGroupService.addUser(
      lawyerLawFirmOwner,
      lawFirm,
      employeeInLawFirm.idx,
      lawFirmGroup.idx
    );
    expect(rs.user).toBeDefined();

    try {
      await LawFirmGroupService.addUser(
        lawyerLawFirmOwner,
        lawFirm,
        employeeInLawFirm.idx,
        4444
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_group" });
    }
    try {
      await LawFirmGroupService.addUser(
        lawyerLawFirmOwner,
        lawFirm,
        4444,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_user" });
    }
    try {
      await LawFirmGroupService.addUser(
        lawyerInLawFirm,
        lawFirm,
        employeeInLawFirm.idx,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
    try {
      await LawFirmGroupService.addUser(
        employeeInLawFirm,
        lawFirm,
        employeeInLawFirm.idx,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
  });

  // 그룹에 유저 제거
  test("removeUserByGroup", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });
    // 작업해야함!
    const lawFirmGroup = await getRepository(Group).findOne({
      where: {
        lawFirm: lawFirm,
        name: "기본",
      },
    });
    const rs = await LawFirmGroupService.removeUser(
      lawyerLawFirmOwner,
      lawFirm,
      employeeInLawFirm.idx,
      lawFirmGroup.idx
    );
    expect(rs.user).toBeDefined();

    try {
      await LawFirmGroupService.removeUser(
        lawyerLawFirmOwner,
        lawFirm,
        employeeInLawFirm.idx,
        4444
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_group" });
    }
    try {
      await LawFirmGroupService.removeUser(
        lawyerLawFirmOwner,
        lawFirm,
        4444,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_user" });
    }
    try {
      await LawFirmGroupService.removeUser(
        lawyerInLawFirm,
        lawFirm,
        employeeInLawFirm.idx,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
    try {
      await LawFirmGroupService.removeUser(
        employeeInLawFirm,
        lawFirm,
        employeeInLawFirm.idx,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
  });

  // 그룹 제거
  test("removeGroup", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });
    const lawFirmGroup = await getRepository(Group).findOne({
      where: {
        lawFirm: lawFirm,
        name: "newGroup",
      },
    });
    const lawFirmOwnerGroup = await getRepository(Group).findOne({
      where: {
        lawFirm: lawFirm,
        name: "관리자",
      },
    });
    const lawFirmDefaultGroup = await getRepository(Group).findOne({
      where: {
        lawFirm: lawFirm,
        name: "기본",
      },
    });

    try {
      await LawFirmGroupService.remove(
        lawyerInLawFirm,
        lawFirm,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
    try {
      await LawFirmGroupService.remove(
        employeeInLawFirm,
        lawFirm,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }
    try {
      await LawFirmGroupService.remove(
        lawyerOtherLawFirmOwner,
        lawFirm,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }

    const rs = await LawFirmGroupService.remove(
      lawyerLawFirmOwner,
      lawFirm,
      lawFirmGroup.idx
    );
    expect(rs.group).toBeDefined();
    try {
      await LawFirmGroupService.remove(
        lawyerLawFirmOwner,
        lawFirm,
        lawFirmGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_group" });
    }
    try {
      await LawFirmGroupService.remove(
        lawyerLawFirmOwner,
        lawFirm,
        lawFirmOwnerGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({
        error: "cannot_remove_admin_or_default_group",
      });
    }
    try {
      await LawFirmGroupService.remove(
        lawyerLawFirmOwner,
        lawFirm,
        lawFirmDefaultGroup.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({
        error: "cannot_remove_admin_or_default_group",
      });
    }
  });

  test("lawcaseCreate", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawfirmlawcaseResult = await LawFirmLawcaseService.create(
      lawFirm,
      "lawcase title",
      "lawcase description"
    );

    expect(lawfirmlawcaseResult).toBeDefined();
  });
  test("lawcaseUpdate", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawfirmlawcaseResult = await LawFirmLawcaseService.update(
      lawyerLawFirmOwner,
      lawFirm,
      1,
      "lawcase title New",
      "lawcase description2",
      LawCaseStataus.ONGOING
    );

    expect(lawfirmlawcaseResult.lawCase.title).toBe("lawcase title New");
    expect(lawfirmlawcaseResult.lawCase.description).toBe(
      "lawcase description2"
    );

    try {
      await LawFirmLawcaseService.update(
        lawyerLawFirmOwner,
        lawFirm,
        2,
        "lawcase title New",
        "lawcase description2",
        LawCaseStataus.ONGOING
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }
  });
  // 사건 담당유저 추가/삭제
  test("lawcaseUsers", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawfirmlawcaseResult = await LawFirmLawcaseService.addUser(
      lawyerLawFirmOwner,
      lawFirm,
      1,
      lawyerLawFirmOwner.idx
    );

    expect(lawfirmlawcaseResult.lawCase).toBeDefined();
    expect(lawfirmlawcaseResult.lawCase.users.length).toBe(1);

    try {
      await LawFirmLawcaseService.addUser(
        lawyerLawFirmOwner,
        lawFirm,
        222,
        lawyerLawFirmOwner.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }

    try {
      await LawFirmLawcaseService.addUser(lawyerLawFirmOwner, lawFirm, 1, 4444);
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_user" });
    }

    try {
      await LawFirmLawcaseService.addUser(
        lawyerLawFirmOwner,
        lawFirm,
        1,
        employeeInLawFirm.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "user_can_be_lawyer" });
    }

    const lawfirmlawcaseRemoveResult = await LawFirmLawcaseService.removeUser(
      lawyerLawFirmOwner,
      lawFirm,
      1,
      lawyerLawFirmOwner.idx
    );
    expect(lawfirmlawcaseRemoveResult.lawCase).toBeDefined();
    expect(lawfirmlawcaseRemoveResult.lawCase.users.length).toBe(0);

    try {
      await LawFirmLawcaseService.removeUser(
        lawyerLawFirmOwner,
        lawFirm,
        222,
        lawyerLawFirmOwner.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }
  });

  test("lawcaseCustomers", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawfirmlawcaseResult = await LawFirmLawcaseService.addCustomer(
      lawyerLawFirmOwner,
      lawFirm,
      1,
      1
    );

    expect(lawfirmlawcaseResult.lawCase).toBeDefined();
    expect(lawfirmlawcaseResult.lawCase.customers.length).toBe(1);

    try {
      await LawFirmLawcaseService.addCustomer(
        lawyerLawFirmOwner,
        lawFirm,
        222,
        1
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }
    try {
      await LawFirmLawcaseService.addCustomer(
        lawyerLawFirmOwner,
        lawFirm,
        1,
        222
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_customer" });
    }

    const lawfirmlawcaseRemoveResult = await LawFirmLawcaseService.removeCustomer(
      lawyerLawFirmOwner,
      lawFirm,
      1,
      1
    );

    expect(lawfirmlawcaseRemoveResult.lawCase).toBeDefined();
    expect(lawfirmlawcaseRemoveResult.lawCase.customers.length).toBe(0);
    try {
      await LawFirmLawcaseService.removeCustomer(
        lawyerLawFirmOwner,
        lawFirm,
        2222,
        1
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }
  });
  test("lawcaseRemove", async () => {
    lawFirm = await getRepository(LawFirm).findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    const lawfirmlawcaseResult = await LawFirmLawcaseService.remove(
      lawyerLawFirmOwner,
      lawFirm,
      1
    );
    expect(lawfirmlawcaseResult.lawCase).toBeDefined();

    try {
      await LawFirmLawcaseService.remove(
        lawyerLawFirmOwner,
        lawFirm,
        2222
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_lawcase" });
    }
  });

  test("LawfirmOwnerChange", async () => {
    const lawFirmRepo = getRepository(LawFirm);
    lawFirm = await lawFirmRepo.findOne({
      where: { idx: 1 },
      relations: ["ownerUser"],
    });

    try {
      await LawFirmPermissionService.changeOwner(
        lawyerInLawFirm,
        lawFirm,
        lawyerLawFirmOwner.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "has_not_permission" });
    }

    try {
      await LawFirmPermissionService.changeOwner(
        lawyerLawFirmOwner,
        lawFirm,
        4444
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "not_exist_user" });
    }

    try {
      await LawFirmPermissionService.changeOwner(
        lawyerLawFirmOwner,
        lawFirm,
        employeeInLawFirm.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "employee_cannot_be_owner" });
    }

    //target_user_not_in_lawfirm
    try {
      await LawFirmPermissionService.changeOwner(
        lawyerLawFirmOwner,
        lawFirm,
        lawyerOtherLawFirmOwner.idx
      );
    } catch (error) {
      expect(error).toStrictEqual({ error: "target_user_not_in_lawfirm" });
    }

    await LawFirmPermissionService.changeOwner(
      lawyerLawFirmOwner,
      lawFirm,
      lawyerInLawFirm.idx
    );
  });

  // disband onDelete cascade 왜안되는지 모르겠어서 일단 패스.
  // test("disband", async () => {
  //   const lawFirmRepo = getRepository(LawFirm);
  //   lawFirm = await lawFirmRepo.findOne({
  //     where: { idx: 1 },
  //     relations: ["ownerUser"],
  //   });

  //   // await LawFirmService.disband(employee, lawFirm);
  // });
});

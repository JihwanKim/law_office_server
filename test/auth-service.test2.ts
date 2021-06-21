import { Connection, createConnection, getConnection, getConnectionOptions, getRepository } from "typeorm";
import { User, UserType } from "../src/entity/User";
import { AuthType } from "../src/entity/UserAuth";
import * as AuthReadService from "../src/service/law_office_service/auth-read-service";
import * as AuthService from "../src/service/law_office_service/auth-service";


describe('auth-service', () => {
  let connection: Connection;

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    connection = await createConnection({...connectionOptions, name:"default"});
  });

  afterAll(async ()=>{
    await connection.close(); 
  });
  
  beforeEach(async () => {
    
  });

  test('signUpEmployee', async () => {
    const rsUser = (await AuthService.signUp(
      UserType.EMPLOYEE, // employee or lawyer
      "이름",
      "test@test.com",
      "2000-01-01",
      "8210123412341234",
      AuthType.NORMAL, // normal, email, provider
      "employee",
      "1234",
      // lawyer!
      // serialNumber?: string, // 일련번호
      // issueNumber?: string, // 발급번호
    ));
    
    const userRepo = await getRepository(User);
    const loadedUser = await userRepo.findOne({idx:rsUser.user.idx});

    expect(loadedUser).toBeDefined()
  })

  test('signUpLawyer', async () => {
    const rsUser = (await AuthService.signUp(
      UserType.LAWYER, // employee or lawyer
      "이름",
      "test@test.com",
      "2000-01-01",
      "111111",
      AuthType.NORMAL, // normal, email, provider
      "lawyer",
      "1234",
      // lawyer!
      "serialNumberTest", // 일련번호
      "issueNumberTest", // 발급번호
    ));
    
    const userRepo = await getRepository(User);
    const loadedUser = await userRepo.findOne({idx:rsUser.user.idx});

    expect(loadedUser).toBeDefined()
  })

  test('signIn', async () => {
    const rsUser = (await AuthReadService.signIn(
      AuthType.NORMAL, // normal, email, provider
      "employee",
      "1234",
    ));

    expect(rsUser.accessToken).toBeDefined();
  })
})
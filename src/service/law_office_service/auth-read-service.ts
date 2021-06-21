import { getRepository } from "typeorm";
import { AuthType, UserAuth } from "../../entity/UserAuth";
import * as Bcrpyt from "bcrypt-nodejs";

export async function signIn(
  authType: AuthType, // normal, email, provider
  id: string,
  password: string,
) {
  const userAuthRepo = getRepository(UserAuth);
  const userAuth = await userAuthRepo.findOne(
    { id: id, type: authType },
    { relations: ["user"] },
  );
  if (!userAuth) {
    throw ({ error: "invalid_id_or_password" });
  }

  if (!Bcrpyt.compareSync(password, userAuth.password)) {
    throw ({ error: "invalid_id_or_password" });
  }

  return { accessToken: userAuth.user.idx + "_accessTokenSample" } ;
}
import { createAccount, findAccountsByUserId} from "../repositories/account.repository.js";

export const createUserAccount = async (
  userId: string,
  accountType: string,
  currency: string
) => {
  const account = await createAccount(
    userId,
    accountType,
    currency
  );

  return account;
};


export const getUserAccounts = async (userId: string) => {
  const accounts = await findAccountsByUserId(userId);

  return accounts;
};
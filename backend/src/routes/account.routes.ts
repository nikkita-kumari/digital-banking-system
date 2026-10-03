import { Router } from "express";
import { createAccount, getAccounts } from "../controllers/account.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { deposit, withdraw } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", authenticate, createAccount);
router.get("/", authenticate, getAccounts);
router.post(
  "/:accountId/deposit",
  authenticate,
  deposit
);
router.post("/:accountId/withdraw", authenticate, withdraw);


export default router;
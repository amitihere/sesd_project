import { Router } from "express";
import { submitController, myReimbursementsController } from "../controllers/reimbursement.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.post("/submit", authenticate, authorize(["employee"]), submitController);

router.get("/mine", authenticate, authorize(["employee"]), myReimbursementsController);

export default router;
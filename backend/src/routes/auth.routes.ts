import { Router } from "express";
import { signupController, loginController, dashboardController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

// Any logged in user
router.get("/dashboard", authenticate, dashboardController);

// Only manager and finance_admin
router.get("/manager", authenticate, authorize(["manager", "finance_admin"]), (req, res) => {
  res.json({ message: "Manager area" });
});

// Only finance_admin
router.get("/finance", authenticate, authorize(["finance_admin"]), (req, res) => {
  res.json({ message: "Finance Admin area" });
});

export default router;
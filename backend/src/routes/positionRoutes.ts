import { Router } from "express";
import { getAllPositions, addPosition, updatePosition, deletePosition } from "../controllers/positionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticateToken);

router.route("/").get(getAllPositions).post(addPosition);
router.route("/:symbol").put(updatePosition).delete(deletePosition);

export default router;

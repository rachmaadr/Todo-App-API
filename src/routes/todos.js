import express from "express";
import * as ctr from "../controllers/TodoController.js";
const router = express.Router();

router.get("/", ctr.list);
router.post("/", ctr.create);
router.get("/:id", ctr.getOne);
router.put("/:id", ctr.update);
router.delete("/:id", ctr.remove);

export default router;

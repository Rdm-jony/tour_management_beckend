import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router=Router()

router.post("/create",validateRequest(createDivisionZodSchema),checkAuth(Role.ADMIN,Role.SUPERADMIN), divisionControllers.createDivision)
router.get("/",divisionControllers.getDivision)
router.patch("/:id",validateRequest(updateDivisionZodSchema), checkAuth(Role.ADMIN,Role.SUPERADMIN),divisionControllers.updateDivision)
router.delete("/:id", checkAuth(Role.ADMIN,Role.SUPERADMIN),divisionControllers.deleteDivision)

export const divisonRoutes=router
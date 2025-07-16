import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema } from "./division.validation";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router=Router()

router.post("/create",validateRequest(createDivisionZodSchema),checkAuth(Role.ADMIN,Role.SUPERADMIN), divisionControllers.createDivision)

export const divisonRoutes=router
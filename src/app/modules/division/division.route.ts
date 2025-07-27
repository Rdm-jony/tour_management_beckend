import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router()

router.post("/create", checkAuth(Role.ADMIN, Role.SUPERADMIN), multerUpload.single("file"), validateRequest(createDivisionZodSchema), divisionControllers.createDivision)
router.get("/", divisionControllers.getDivision)
router.patch("/:id",checkAuth(Role.ADMIN, Role.SUPERADMIN),multerUpload.single("file"), validateRequest(updateDivisionZodSchema),  divisionControllers.updateDivision)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), divisionControllers.deleteDivision)

export const divisonRoutes = router
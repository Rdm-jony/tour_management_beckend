import { Router } from "express";
import { userControllers } from "./user.controller";
import { creteUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()



router.post("/register", validateRequest(creteUserZodSchema), userControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPERADMIN), userControllers.getAllUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

export const userRoutes = router
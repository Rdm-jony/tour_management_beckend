import { Router } from "express";
import { userControllers } from "./user.controller";
import { creteUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { multerUpload } from "../../config/multer.config";

const router = Router()



router.post("/register", multerUpload.single("file"), validateRequest(creteUserZodSchema), userControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPERADMIN), userControllers.getAllUser)
router.patch("/:id",checkAuth(...Object.values(Role)),multerUpload.single("file"), validateRequest(updateUserZodSchema),  userControllers.updateUser)

export const userRoutes = router
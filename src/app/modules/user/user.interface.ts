import { Types } from "mongoose"

export enum Role {
   SUPERADMIN = "SUPERADMIN",
   ADMIN = "ADMIN",
   USER = "USER",
   GUIDE = "GUIDE"
}

export enum IsActive {
   ACTIVE = "ACTIVE",
   INACTIVE = "INACTIVE",
   BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
   provider: 'Google' | 'Credential',
   providerId: string
}

export interface IUser {
   _id?: Types.ObjectId,
   name: string,
   email: string,
   password?: string,
   role: Role,
   picture?: string,
   phone?: string,
   address?: string,
   isDeleted?: boolean,
   isActive?: IsActive,
   isVerified?: boolean,
   auths: IAuthProvider[]
}
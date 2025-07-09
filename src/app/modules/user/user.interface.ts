 export enum Role{
    SUPERADMIN="SUPERADMIN",
    ADMIN="ADMIN",
    USER="USER",
    GUIDE="GUIDE"
 }

 export enum IsActive{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
    BLOCKED="BLOCKED"
 }

 export interface IAuthProvider{
    provider:string,
    providerId:string
 }

export interface IUser{
    name:string,
    email:string,
    password?:string,
    role:Role,
    picture?:string,
    phone?:string,
    address?:string,
    isDeleted?:boolean,
    isActive?:IsActive,
    isVerified?:boolean,
    auths:IAuthProvider[]
}
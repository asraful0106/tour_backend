/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist =  await User.findOne({email: envVars.SUPER_ADMIN_EMAIL});

        if(isSuperAdminExist){
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin...!");

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, envVars.BCRYPT_SALT_ROUND);

        const authPorvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: envVars.SUPER_ADMIN,
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auth:[authPorvider]
        }

        const superAdmin = await User.create(payload);
        console.log("Super Admin Created Successfuly!\n");
        console.log(superAdmin);
    } catch (err) {
        console.log(err);
    }
}
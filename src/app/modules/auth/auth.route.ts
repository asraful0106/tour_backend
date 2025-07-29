import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const authRouter = Router();

authRouter.post("/login", AuthControllers.credentialsLogin);

authRouter.post("/refresh-token", AuthControllers.getNewAccessToken);

authRouter.post("/logout", AuthControllers.logout);

authRouter.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);

authRouter.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

authRouter.post("/forgot-password", AuthControllers.forgotPassword);

authRouter.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);

// Google Auth
authRouter.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.body.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next);
});

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController);

export default authRouter;
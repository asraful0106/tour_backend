import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";

const authRouter = Router();

authRouter.post("/login", AuthControllers.credentialsLogin);
authRouter.post("/refresh-token", AuthControllers.getNewAccessToken);
authRouter.post("/logout", AuthControllers.logout);
authRouter.post("/reset-password", AuthControllers.resetPassword);

// Google Auth
authRouter.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.body.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next);
});

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController);

export default authRouter;
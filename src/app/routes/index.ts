import { Router } from "express";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/auth/auth.route";
import tourRouter from "../modules/tour/tour.route";

const router = Router();
interface IRoute {
    path: string;
    route: Router;
}

const moduleRoutes: IRoute[] = [
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/auth",
        route: authRouter
    }, {
        path: "/tour",
        route: tourRouter
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
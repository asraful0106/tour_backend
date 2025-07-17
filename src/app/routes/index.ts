import { Router } from "express";
import userRouter from "../modules/user/user.route";

const router = Router();
interface IRoute  {
    path: string;
    route: Router;
}

const moduleRoutes: IRoute[] = [
    {
        path: "/user",
        route: userRouter
    }
];

moduleRoutes.forEach((route)=> router.use(route.path, route.route));

export default router;
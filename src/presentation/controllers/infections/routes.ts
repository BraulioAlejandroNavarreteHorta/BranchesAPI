import { Router } from "express";
import { InfectionController } from "./controller";

export class InfectionRoutes{
    static get routes(){
        const router = Router();
        const controller = new InfectionController();
        router.get("/",controller.getInfections);
        router.post("/",controller.createInfections);
        router.get("/:id",controller.getInfectionById);
        router.put("/:id",controller.updateInfections);
        router.delete("/:id",controller.deleteInfection);
        return router
    }
}
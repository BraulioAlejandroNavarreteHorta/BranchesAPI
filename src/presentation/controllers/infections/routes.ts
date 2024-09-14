import { Router } from "express";
import { InfectionController } from "./controller";

export class InfectionRoutes{
    static get routes(){
        const router = Router();
        const controller = new InfectionController();
        router.get("/",controller.getInfections);
        router.post("/",controller.createInfection);
        router.get("/last-week",controller.getInfectionsLastWeek);
        router.get("/:id",controller.getInfectionById);
        router.put("/:id",controller.updateInfection);
        router.delete("/:id",controller.deleteInfection);
        return router
    }
}
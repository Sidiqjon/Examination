import { Router } from "express";
import routeResources from "./resources.routes.js";
import routeLike from "./like.routes.js";
import routeResourcesCategory from "./resourcesCategory.routes.js";
import routeProfession from "./profession.routes.js";
import routeSubject from "./subject.routes.js";
import routeField from "./field.routes.js";
import routeLearningCenter from "./learningcenter.routes.js";
import routeLcField from "./lcfield.routes.js";
import routeBranch from "./branch.routes.js";
import Upoad from "./upload.routes.js";

let mainRoute = Router();
mainRoute.use("/resources-categ", routeResourcesCategory);
mainRoute.use("/resources", routeResources);
mainRoute.use("/like", routeLike);
mainRoute.use("/profession", routeProfession);
mainRoute.use("/subject", routeSubject);
mainRoute.use("/field", routeField);
mainRoute.use("/learning-center", routeLearningCenter);
mainRoute.use("/lcfield", routeLcField);
mainRoute.use("/branch", routeBranch);
mainRoute.use("/uploadimg", Upoad);

export default mainRoute;
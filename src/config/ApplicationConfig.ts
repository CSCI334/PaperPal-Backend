import { LooseObject } from "../common/LooseObject.js";
import { interfaces } from "inversify";

export type MorganConfig = {
    format: string,
    options?: LooseObject,
};

export type ApplicationOptions = {
    containerOptions: interfaces.ContainerOptions
    morganConfig: MorganConfig;
};

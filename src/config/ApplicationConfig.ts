import { LooseObject } from "../common/LooseObject.js";
import { interfaces } from "inversify";

export type MorganConfig = {
    format: string,
    logFileLocation : string,
    options?: LooseObject,
};

export type ApplicationOptions = {
    containerOptions: interfaces.ContainerOptions
    morganConfig: MorganConfig;
};

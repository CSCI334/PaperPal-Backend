import { EmailConfig } from "@config/EmailConfig";
import { LooseObject } from "@utils/LooseObject";
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


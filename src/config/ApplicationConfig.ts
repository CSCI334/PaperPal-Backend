import { LooseObject } from "../common/LooseObject.js";
import { interfaces } from 'inversify';
export enum MorganLoggingTypes {
    DEV = 'dev',
    COMBINED = 'combined',
    COMMON = 'common',
    TINY = 'tiny',
    SHORT = 'short',
}

export type MorganConfig = {
    format: MorganLoggingTypes,
    options?: LooseObject,
};

export type ApplicationOptions = {
    containerOptions: interfaces.ContainerOptions
    morganConfig: MorganConfig;
};

/* eslint-disable @typescript-eslint/no-floating-promises */
import { Container } from "inversify";
import { ApplicationOptions } from "../config/ApplicationConfig.js";

export default abstract class Application {
    protected readonly container: Container;

    constructor(options: ApplicationOptions) {
        this.container = new Container(options.containerOptions);
        this.configureService();
        this.setup(options);
    }
    
    abstract configureService(): void;
    abstract setup(options: ApplicationOptions): Promise<void>;
}

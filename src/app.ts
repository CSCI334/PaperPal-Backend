import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorHandler } from "./middleware/ErrorHandler.js";
import { fileURLToPath } from "url";

import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import DbService from "./database/db.js";

import AuthRepository from "./paperpal/repository/AuthRepository.js";
import AuthService from "./paperpal/service/AuthService.js";
import "./paperpal/controller/AuthController.js";

import morgan from 'morgan';
import { ApplicationOptions } from "./config/ApplicationConfig.js";

export default class App {
    private readonly container: Container;

    constructor(options: ApplicationOptions) {
        this.container = new Container();
        this.bindService();
        this.setup(options);
    }

    bindService(): void {
        // External services
        this.container.bind(DbService).toSelf();

        // Internal services
        this.container.bind(AuthRepository).toSelf();
        this.container.bind(AuthService).toSelf();
    }

    async setup(options: ApplicationOptions) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        dotenv.config({ path: __dirname + "/.env" });
        const server: InversifyExpressServer = new InversifyExpressServer(
            this.container
        );

        server.setConfig((app) => {
            app.use(cors());
            app.use(express.json());
            app.use(morgan(options.morganConfig.format));

        });
        server.setErrorConfig((app) => {
            app.use(errorHandler);
        });

        // Tests db connection
        const dbService: DbService = this.container.get(DbService);
        await dbService.connect();
        
        console.log(`Connection succesful!`);
        
        const app = server.build();
        app.listen(process.env.BACKEND_PORT || 8000, () => {
            console.log(`Server (${process.env.DOMAIN}) is running at PORT : ${process.env.BACKEND_PORT || 8000}`);
        });
    }
}

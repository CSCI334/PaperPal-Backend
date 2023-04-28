import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";import { fileURLToPath } from "url";

import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import DbService from "./database/db.js";

import AccountRepository from "./paperpal/repository/AccountRepository.js";
import AccountService from "./paperpal/service/account/AccountService.js";
import "./paperpal/controller/AccountController.js";
import "./paperpal/controller/ConferenceController.js";

import morgan from "morgan";
import { ApplicationOptions } from "./config/ApplicationConfig.js";
import ErrorHandler from "./middleware/ErrorHandler.js";
import fs from "fs";
import ConferenceService from "./paperpal/service/conference/ConferenceService.js";
import ConferenceRepository from "./paperpal/repository/ConferenceRepository.js";
import BidRepository from "./paperpal/repository/BidRepository.js";
import PaperRepository from "./paperpal/repository/PaperRepository.js";
import ReviewRepository from "./paperpal/repository/ReviewRepository.js";
import PaperService from "./paperpal/service/paper/PaperService.js";
import ReviewService from "./paperpal/service/review/ReviewService.js";
import BidService from "./paperpal/service/bid/BidService.js";

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
        this.container.bind(BidService).toSelf();
        this.container.bind(AccountService).toSelf();
        this.container.bind(ConferenceService).toSelf();
        this.container.bind(PaperService).toSelf();
        this.container.bind(ReviewService).toSelf();

        // Internal repositories
        this.container.bind(AccountRepository).toSelf();
        this.container.bind(BidRepository).toSelf();
        this.container.bind(PaperRepository).toSelf();
        this.container.bind(ReviewRepository).toSelf();
        this.container.bind(ConferenceRepository).toSelf();
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
            app.use(morgan(options.morganConfig.format, {
                stream: fs.createWriteStream("./access.log", {flags: "a"})
            }));
        });
        server.setErrorConfig((app) => {
            app.use(new ErrorHandler().handler);
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

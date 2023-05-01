import express from "express";
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import morgan from "morgan";
import fs from "fs";

import DbService from "@app/database/db";
import ErrorHandler from "@app/middleware/ErrorHandler";
import { ApplicationOptions } from "@config/ApplicationConfig";

import AccountRepository from "@repository/AccountRepository";
import BidRepository from "@repository/BidRepository";
import ConferenceRepository from "@repository/ConferenceRepository";
import PaperRepository from "@repository/PaperRepository";
import ReviewRepository from "@repository/ReviewRepository";

import AccountService from "@service/account/AccountService";
import BidService from "@service/bid/BidService";
import ConferenceService from "@service/conference/ConferenceService";
import PaperService from "@service/paper/PaperService";
import ReviewService from "@service/review/ReviewService";

import "@controller/AccountController";
import "@controller/BidController";
import "@controller/ConferenceController";
import "@controller/PaperController";
import "@controller/ReviewController";

import AuthorReviewStrategy from "@service/review/impl/AuthorReviewStrategy";
import ReviewerReviewStrategy from "@service/review/impl/ReviewerReviewStrategy";
import ChairReviewStrategy from "@service/review/impl/ChairReviewStrategy";
import ReviewerPaperStrategy from "@service/paper/impl/ReviewerPaperStrategy";
import AuthorPaperStrategy from "@service/paper/impl/AuthorPaperStrategy";
import ChairPaperStrategy from "@service/paper/impl/ChairPaperStrategy";
import PhaseService from "@service/conference/PhaseService";

export default class App {
    readonly container: Container;

    constructor(options: ApplicationOptions) {
        this.container = new Container();
        this.bindService();
        this.setup(options);
    }

    bindService(): void {
        // External services
        this.container.bind(DbService).toSelf();

        // Internal services
        this.container.bind(ChairPaperStrategy).toSelf();
        this.container.bind(ReviewerPaperStrategy).toSelf();
        this.container.bind(AuthorPaperStrategy).toSelf();

        this.container.bind(ChairReviewStrategy).toSelf();
        this.container.bind(ReviewerReviewStrategy).toSelf();
        this.container.bind(AuthorReviewStrategy).toSelf();

        this.container.bind(BidService).toSelf();
        this.container.bind(AccountService).toSelf();
        this.container.bind(ConferenceService).toSelf();
        this.container.bind(PaperService).toSelf();
        this.container.bind(ReviewService).toSelf();
        this.container.bind(PhaseService).toSelf();

        // Internal repositories
        this.container.bind(AccountRepository).toSelf();
        this.container.bind(BidRepository).toSelf();
        this.container.bind(PaperRepository).toSelf();
        this.container.bind(ReviewRepository).toSelf();
        this.container.bind(ConferenceRepository).toSelf();
    }

    async setup(options : ApplicationOptions) {
        dotenv.config({ path: path.resolve(__dirname, "../.env") });
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

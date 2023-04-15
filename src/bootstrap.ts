import { ApplicationOptions } from "./config/ApplicationConfig.js";
import App from "./app.js";

export default function bootstrap() {
    const applicationOptions: ApplicationOptions = {
        containerOptions: {
            defaultScope: 'Singleton',
        },
        morganConfig: {
            format: 'tiny',
        }
    };
    new App(applicationOptions);
}
bootstrap();
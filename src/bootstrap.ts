import { ApplicationOptions, MorganLoggingTypes } from "./config/ApplicationConfig.js";
import App from "./index.js";

export default function bootstrap() {
    const applicationOptions: ApplicationOptions = {
        containerOptions: {
            defaultScope: 'Singleton',
        },
        morganConfig: {
            format: MorganLoggingTypes.COMBINED
        }
    };
    new App(applicationOptions);
}

import App from "@app/app";
import { ApplicationOptions } from "@config/ApplicationConfig";
export default function bootstrap() {
    const applicationOptions: ApplicationOptions = {
        containerOptions: {
            defaultScope: "Singleton",
        },
        morganConfig: {
            format: "dev",
            logFileLocation: "./access.log"
        },
        
    };
    return new App(applicationOptions);
}
bootstrap();

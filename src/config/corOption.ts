import { CorsOptions } from "cors";
import { allowedOrigins, allowedHeaders } from "./allowedOrigins";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if ((origin && allowedOrigins.includes(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    allowedHeaders: allowedHeaders,
};

export default corsOptions
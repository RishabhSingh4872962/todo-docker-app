import { configDotenv } from "dotenv"

configDotenv()

 const _config={
    port:process.env.PORT|| 3000,
    mongo_url:process.env.MONGO_URL
}

export const config=Object.freeze(_config)
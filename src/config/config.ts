import { configDotenv } from "dotenv"

configDotenv()

 const _config={
    port:process.env.PORT|| 3000,
    mongo_url:process.env.MONGO_URL,
    env:process.env.NODE_ENV
}

export const config=Object.freeze(_config)
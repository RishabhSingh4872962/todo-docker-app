import { configDotenv } from "dotenv"

configDotenv()

 const _config={
    port:process.env.PORT|| 3000,
}

export const config=Object.freeze(_config)
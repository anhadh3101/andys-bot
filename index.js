import express from "express";
import { config } from "dotenv";
import { generateAuthUrl,  getAccessToken} from "./api_fol/oauth_api.js";
import { GitHubClient } from "./api_fol/git_api.js";
import logger from "./development/logger.js";

config();
const app = express();

const git_creds = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    auth_url: 'https://github.com/login/oauth/authorize',
    token_url: 'https://github.com/login/oauth/access_token',
    scope: 'user'
}

app.get("/", (request, response) => {
    logger.info("GET / - Redirecting to GitHub OAuth");
    response.redirect(generateAuthUrl(git_creds));
});

app.get("/callback", async (request, response) => {
    const code = request.query.code;
    try {
        const access_token = await getAccessToken(git_creds, code);
        logger.info(`Access token received: ${access_token}`);

        const ghClient = new GitHubClient(access_token);
        const data = await ghClient.getRepoContent();

        logger.info("Fetched repository content!");
        response.json(data)
    } catch (error) {
        logger.error(error, {stack: error.stack});
        response.status(500).send("Internal Server Error!")
    }
});

app.listen(8000, () => {
    logger.info("Server is running on port 8000!");
});





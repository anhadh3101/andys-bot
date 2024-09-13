require("dotenv").config();
const express = require("express");
const { generateAuthUrl,  getAccessToken} = require("./oauth_api.js");

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
    response.redirect(generateAuthUrl(git_creds));
});

app.get("/callback", async (request, response) => {
    const code = await request.query.code;
    const access_token = await getAccessToken(git_creds, code);
    console.log(`Access Token: ${access_token}`);
    return access_token;
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});
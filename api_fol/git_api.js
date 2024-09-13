// api

import { Octokit } from "octokit";

// Octokit.js
// https://github.com/octokit/core.js#readme

export class GitHubClient {
    constructor(access_token) {
        this.octokit = new Octokit({ auth: access_token });
    }

    async getRepoContent() {
        try {
            const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: 'anhadh3101',
                repo: 'andys-bot',
                // path: 'mario.java',
                headers: {
                'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            // const content = Buffer.from(data.content, 'base64').toString('utf8');
            return data;

        } catch (error) {
            logger.error("Error fetching repo content: ", error);
            throw error;
        }
    }
}





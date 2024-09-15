// api

import { Octokit } from "octokit";

// Octokit.js
// https://github.com/octokit/core.js#readme
const owner = "anhadh3101";
const repo = "andys-bot"

export class GitHubClient {
    constructor(access_token) {
        this.octokit = new Octokit({ auth: access_token });
    }

    async getRepoContent() {
        try {
            const { data } = await this.octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
                owner: owner,
                repo: repo,
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

    async getLatestCommit(branch = 'main') {
        try {
            // Get the latest commit SHA for the branch
            const { data: branchData } = await this.octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
                owner: owner,
                repo: repo,
                branch: branch,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            const sha = branchData.commit.sha;

            // Get the commit details using the SHA
            const { data: commitData } = await this.octokit.request("GET /repos/{owner}/{repo}/commits/{sha}", {
                owner: owner,
                repo: repo,
                sha: sha,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            return commitData;
        } catch (error) {
            console.error("Error fetching commit content: ", error);
            throw error;
        }
    }
}





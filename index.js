const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const template = require('./ReadMe.js');
const validator = require('email-validator');

let gitHubUserInfo;
let gitHubRepo;
let confirmedRepo;

// Confirm existence of Github Account + Repos
async function verifyGitHubAccount(username) {

    if (username.length === 0)
        return 'username cannot be blank';
    else {

        const url = `https://api.github.com/users/${username}`;

        // GitHubUser Data
        const userResp = await axios.get(url)

        gitHubUserInfo = userResp.data;

        reposUrl = userResp.data.repos_url;

        if (typeof reposUrl === 'undefined')
            return `GitHub username ${username} does not exist`;

        reposResp = await axios.get(reposUrl);

        const reposData = reposResp.data;

        if (reposData.length === 0)
            return `GitHub user ${username} has no repos`;

        gitHubRepo = reposData;

        questions[1].choices = reposData.map(repo => repo.name);

        return true;
    }
}



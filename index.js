const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const template = require('./template.js');
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

// Filter callback for repo selection question

function setRepoDefaults(repoName) {

    return new Promise((resolve, reject) => {

        confirmedRepo = gitHubRepo.find(repo => repo.name == repoName);


        // Set repo name and description as defaults for Title and Description 

        questions[2].default = confirmedRepo.description;

        // Get contributors and tags from repo
        axios
            .all([
                axios.get(confirmedRepo.contributors_url),
                axios.get(confirmedRepo.tags_url)
            ])
            .then(respArr => {
                // Set repo contributors as default for Contributors question
                questions[7].default = respArr[0].data.map(contributor => contributor.login).join(',');

                resolve(repoName);
            })
            .catch(err => {
                reject(new Error("Could not set defaults"));
            });
    })
}

// Validate e-mail
function validateEmail(email) {

    if (validator.validate(email))
        return true;

    return `${email} is not a valid email`;
}

const questions = [
    {
        name: "username",
        message: "What is your GitHub username?",
        default: "Joyson-Enoch",
        validate: verifyGitHubAccount
    },
    {
        type: "list",
        name: "repoName",
        message: "Select the project repo:",
        filter: setRepoDefaults
    },
    {
        name: "title",
        message: "Enter the project title:",
    },
    {
        name: "description",
        message: "Enter project description:",
    },
    {
        name: "installation",
        message: "Enter installation instructions:"
    },
    {
        name: "usage",
        message: "Enter usage instructions:"
    },
    {
        type: "list",
        name: "license",
        message: "Select license type:",
        choices: ["Academic Free License v3.0", "ISC", "MIT", "public"]
    },
    {
        name: "contributors",
        message: "Enter contributors:"
    },
    {
        name: "tests",
        message: "Enter tests:"
    },
    {
        name: "email",
        message: "Enter contact email:",
        validate: validateEmail
    }
];

function init() {

    inquirer.prompt(questions).then(resp => {

        generateReadMe(resp);
    });
}

function generateReadMe(responses) {

    fs.writeFile
        (
            "./export/README.md",
            template.getReadMe(gitHubUserInfo, responses),
            (err) => {
                if (err)
                    console.log("An error occured while writing file");
                else
                    console.log("File saved");
            }
        );

}

init();
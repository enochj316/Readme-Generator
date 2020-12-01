module.exports.getReadMe = (userData, responses) => {

    function noneIfNone(response) {
        return response.length === 0 ? 'None' : response
    }

    return `# ${noneIfNone(responses.title)}
    ${noneIfNone(responses.description)}
    ### Contents
    1. [Installation Instructions](#installation-instructions)
    2. [Usage](#usage)
    3. [Contributors](#contributors)
    4. [Tests](#tests)
    5. [Questions](#questions)
    ## Installation Instructions
    ${noneIfNone(responses.installation)}
    ## Usage
    ${noneIfNone(responses.usage)}
    ## License
    ${responses.license}
    ## Contributors
    ${noneIfNone(responses.contributors)}
    ## Tests
    ${noneIfNone(responses.tests)}
    ## Questions
    Contatct: ${userData.login}
    ![profile image](${userData.avatar_url})
    Email: <${responses.email}>
    `
}
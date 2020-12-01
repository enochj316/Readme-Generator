module.exports.getReadMe = (userData, responses) => {

    function noneIfNone(response) {
        return response.length === 0 ? 'None' : response
    }


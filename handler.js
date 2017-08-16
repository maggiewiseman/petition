const dbQuery = require('./dbQuery');

//Handler will be called bout the server file
/*
@param the function I want to use from dbQuery
@param the request object parameters
@param the response object
*/

const funcMap = {
    'getSigners' : dbQuery.getSigners,
    'addSignature' : dbQuery.addSignature,
    'getSignature' : dbQuery.getSignature,
    'numSignatures' : dbQuery.numSignatures
};

function handle(query, reqParams, res) {
    if(query == 'getSigners') {
        dbQuery.getSigners().then((result) => {
            res.send(result);
        }).catch(e => console.error(e.stack));

    }

    if(query == 'numSignatures') {
        dbQuery.numSignatures().then((result) => {
            res.send(result.toString());
        }).catch(e => console.error(e.stack));
    }


}

module.exports.handle = handle;

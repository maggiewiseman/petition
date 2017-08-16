const dbQuery = require('./dbQuery');


/*
@param the function I want to use from dbQuery
@param the request object parameters
@param the response object
*/

// const funcMap = {
//     'getSigners' : dbQuery.getSigners,
//     'addSignature' : dbQuery.addSignature,
//     'getSignature' : dbQuery.getSignature,
//     'numSignatures' : dbQuery.numSignatures
// };

function handle(query, reqParams, res) {
    if(query == 'getSigners') {
        dbQuery.getSigners().then((result) => {
            res.render('signatures', {results: result});
        }).catch(e => console.error(e.stack));
    }

    if(query == 'numSignatures') {
        renderThankyou(res);
    }

    if(query == 'addSignature') {
        console.log(reqParams);
        //dbQuery.addSignatures()
        renderThankyou(res);
    }

}

function renderThankyou(res) {
    dbQuery.numSignatures().then((num) => {
        res.render('thankyou', {count: num});
    }).catch(e => console.error(e.stack));
}

module.exports.handle = handle;

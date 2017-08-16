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
        console.log('reqParams:', reqParams.params.last_name);

        //console.log();
        //make reqParams an Array
        var userData = [reqParams.params['first_name'], reqParams.params['last_name'], reqParams.params['signature']];
        console.log('userData', userData);
        dbQuery.addSignature(userData).then(() => {
            res.redirect('/petition/signed');
        }).catch(e => {
            console.error(e.stack);
            res.render('petition', { 'error' : true });
        });

    }

}

function renderThankyou(res) {
    dbQuery.numSignatures().then((num) => {
        res.render('thankyou', {count: num});
    }).catch(e => console.error(e.stack));
}

module.exports.handle = handle;

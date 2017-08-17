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
        dbQuery.numSignatures().then((num) => {
            res.render('thankyou', {count: num});
        }).catch(e => console.error(e.stack));
    }

    if(query == 'addSignature') {
        var validParams = validateParams(reqParams.params);

        dbQuery.addSignature(validParams).then(() => {
            res.cookie('signed', 'yes');
            res.redirect('/petition/signed');
        }).catch(e => {
            console.error(e.stack);
            res.render('petition', { 'error' : true });
        });

    }
}

function validateParams(params) {
    var validData = [params['first_name'], params['last_name'], params['signature']];

    validData.map((item) => {
        return item = item == "" ? null : item;
    });

    console.log('HANDLER: validdata', validData);
    return validData;
}


module.exports.handle = handle;

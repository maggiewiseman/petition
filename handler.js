const dbQuery = require('./dbQuery');

function handle(query, req, res) {
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
        var validParams = validateParams(req.body);

        dbQuery.addSignature(validParams).then((result) => {
            console.log('HANDLER: result of addSig: ', result);
            req.session.id = result.rows[0].id;
            res.redirect('/petition/signed');
        }).catch(e => {
            console.error(e.stack);
            res.render('petition', { 'error' : true });
        });
    }
}

function validateParams(params) {
    var userData = [params['first_name'], params['last_name'], params['signature']];

    var validData = [];
    userData.forEach((item)=> {
        if(item == "") {
            console.log('HANDLER: empty string');
            validData.push(null);
        } else {
            validData.push(item);
        }
    });

    console.log('HANDLER: validdata', validData);
    return validData;
}


module.exports.handle = handle;

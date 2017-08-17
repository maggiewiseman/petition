const dbQuery = require('./dbQuery');

function handle(query, req, res) {
    if(query == 'getSigners') {
        dbQuery.getSigners().then((result) => {
            res.render('signatures', {results: result});
        }).catch(e => console.error(e.stack));
    }

    if(query == 'thankyou') {
        return renderThankyou(req, res).catch(e => console.error(e.stack));
    }

    if(query == 'addSignature') {
        var validParams = validateParams(req.body);

        dbQuery.addSignature(validParams).then((result) => {
            console.log('HANDLER: result of addSig: ', result);
            req.session.id = result.rows[0].id;
            return renderThankyou(req, res);
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

function renderThankyou(req, res) {
    console.log('HANDLER: inside renderthankyou');
    console.log('HANDLER: Id:', req.session.id);

    var promiseArr = [];
    promiseArr.push(dbQuery.numSignatures());
    promiseArr.push(dbQuery.getSignature(req.session.id));

    return Promise.all(promiseArr).then((results)=> {
        console.log('HANDLER result: ', results[1].signature);
        res.render('thankyou', {count: results[0], 'imgsrc': results[1][0].signature});
    });
}

module.exports.handle = handle;

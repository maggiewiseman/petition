const dbQuery = require('./dbQuery');
const bcrypt = require('bcryptjs');

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
        var validParams = validateSig(req.body);

        dbQuery.addSignature(validParams).then((result) => {
            console.log('HANDLER: result of addSig: ', result);
            req.session.id = result.rows[0].id;
            return renderThankyou(req, res);
        }).catch(e => {
            console.error(e.stack);
            res.render('petition', { 'error' : true });
        });
    }

    if(query == 'registerUser') {
        //similar to add signature, need to validate params by putting in array and change to null if they are empty strings.
        var validUserInfo = validateUser(req.body);
        console.log('HANDLER: validUserInfo', validUserInfo);
        //need to hash the signature
        hashPassword(validUserInfo[3]).then((hash) =>{
            validUserInfo[3] = hash;
            //then we need to query the database to add signature with an array that has first_name, last_name, email, hashed password
            return dbQuery.addUser(validUserInfo);
        }).catch(e => console.error(e.stack));

        //when that comes back successfully with an id, we need to set session.user with first name, last name and user_id
        //then route to /petition and petition will do the logic of checking for signature and log in
    }

    if(query == 'login') {
        //dbQuery to get password, first_name and last_name and id from users table using e-mail
        //check password if password matches than set session.user
        //with their firist name and last name and id and add to session.user.
        //dbQuery.getSignature(user_id);
        //then using user id see if they have a signature.  If they do add sigId to the user object.
        //now that they are logged in direct to /petition.
        //petition will check if signed in and route accordingly
    }
}

function validateSig(params) {
    var userData = [params['id'], params['first_name'], params['last_name'], params['signature']];

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
/*
@params params is an object that is the request body
*/
function validateUser(params) {
    console.log('HANDLER: validUser');
    // if(params['password'] == '') {
    //     throw new Error('password is blank');
    // }

    var userInfo = [params['first_name'], params['last_name'], params['email'], params['password']];

    return userInfo.map(function(item) {
        return item == '' ? null : item;
    });
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

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

module.exports.handle = handle;

/** TESTS **/

// var registrationBody = {
//     first_name: 'Tiffany',
//     last_name: 'Theiessen',
//     email: 'Tif@gmail',
//     password: 'ilovezack'
// };
//
// var registrationBodyNull = {
//     first_name: '',
//     last_name: 'Theiessen',
//     email: 'Tif@gmail',
//     password: ''
// };
//
// console.log(validateUser(registrationBody));
// console.log(validateUser(registrationBodyNull));
//
var registration = { body: {
    first_name: 'Tiffany',
    last_name: 'Theiessen',
    email: 'Tif@gmail',
    password: 'ilovezack'
}};

handle('registerUser', registration);

//Failing tests:
//bcrypt throws error
// var registrationNullPW = { body: {
//     first_name: 'Tiffany',
//     last_name: 'Theiessen',
//     email: 'Tif@gmail',
//     password: ''
// }};
//
// handle('registerUser', registrationNullPW);

//database throws error
// var registrationNullName = { body: {
//     first_name: '',
//     last_name: 'Theiessen',
//     email: 'Tif@gmail',
//     password: 'ilovezack'
// }};
//
// handle('registerUser', registrationNullName);

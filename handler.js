const dbQuery = require('./dbQuery');
const help = require('./helpers');
const nav = { loggedin: true };

function handle(query, req, res) {

    /**
    returns list of people who have signed for signatures page.
    will need to get city and age here
    **/
    if(query == 'getSigners') {
        dbQuery.getSigners().then((result) => {
            res.render('signatures', {results: result, nav: nav});
        }).catch(e => console.error(e.stack));
    }

    if(query == 'signersByCity') {
        let cityName = req.params.city;
        return dbQuery.getSignersByCity([cityName]).then((results) => {
            res.render('city', {nav: nav, cityName: cityName,
                results: results});
        }).catch(e => console.error(e.stack));
    }

    if(query == 'thankyou') {
        return renderThankyou(req, res).catch(e => console.error(e.stack));
    }

    if(query == 'addSignature') {
        var validParams = help.validate([req.body.signature, req.session.user.id]);

        dbQuery.addSignature(validParams).then((result) => {
            console.log('HANDLER: result of addSig: ', result);
            req.session.user.sigId = result.rows[0].id;
            return res.redirect('/petition/signed');
            //return renderThankyou(req, res);
        }).catch(e => {
            console.error(e.stack);
            res.render('petition', { 'error' : true,
                csrfToken: req.csrfToken(),
                nav: nav
            });
        });
    }

    if(query == 'registerUser') {

        var validUserInfo = setUserData(req);
        //need to hash the signature
        help.hashPassword(validUserInfo[3]).then((hash) =>{
            validUserInfo[3] = hash;
            //then we need to query the database to add signature with an array that has first_name, last_name, email, hashed password
            return dbQuery.addUser(validUserInfo);
        }).then((id) =>{
            //when that comes back successfully with an id, we need to set session.user with first name, last name and user_id
            console.log('HANDLER: add user id', id);
            req.session.user = {
                id: id[0].id,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            };

            console.log("HANDLER: registerUser session info", req.session.user);
            //then route to /petition and petition will do the logic of checking for signature and log in
            res.redirect('/profile');
        }).catch(e => {
            console.error(e.stack);
            res.render('register', { 'error' : true, csrfToken: req.csrfToken()});
        });

    }

    var userInfo;
    if(query == 'login') {
        //put email into an array b/c that's how the query needs it
        let email = [req.body.email];

        //dbQuery to get password, first_name and last_name and id from users table using e-mail
        dbQuery.getUserInfo(email).then((returnedUserInfo)=>{
            //show me stuff that came back
            //console.log('HANDLER login returnedUserINfo ', returnedUserInfo);

            if(returnedUserInfo.rowCount == 0) {
                console.error('User does not exist');
                throw new Error ('User does not exist');
            }

            userInfo = returnedUserInfo.rows[0];

            console.log('HANDLER: login: userInfo:', userInfo);
            console.log('HANDLER: login: password', userInfo.password);
            //check password
            return help.checkPassword(req.body.password, userInfo.password);

        }).then((validPass)=>{
            if(!validPass) {
                console.log('HANDLER: password was invalid');
                res.render('login', { 'error' : true, csrfToken: req.csrfToken() });
            }

            //with their first name and last name and id and add to session.user.
            req.session.user = {
                id: userInfo.id,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name
            };
            console.log('HANDLER: set req.session.user info');
            //then using user id see if they have a signature.
            return dbQuery.getSigId([userInfo.id]);
        }).then((results)=>{
            if(results.rowCount > 0) {
                console.log('HANDLER: login session id added');
                //so they have a signature
                req.session.user.sigId = results.rows[0].id;
            }
            res.redirect('/petition');

        }).catch(e => {
            console.error(e.stack);
            res.render('login', { 'error' : true, csrfToken: req.csrfToken() });
        });
    }

    if(query == 'addProfile') {

        req.session.user.profile = true;
        return addProfile(req, res);

    }

    if(query == 'getProfile') {
        renderProfile(req, res).then((results)=>{
            console.log('HANDLER userInfo to send to edit profile template: ', results);
            results.csrfToken = req.csrfToken();
            results.nav = nav;
            res.render('edit', results);
        }).catch(e => {
            console.error(e.stack);
            res.render('profile/edit', { 'error' : true, csrfToken: req.csrfToken() });
        });
    }

    if(query == "updateProfile") {
        //does this person exist in users_profiles?
        dbQuery.getProfileId([req.session.user.id]).then((results) => {
            console.log('HANDLER updateProfile results: ', results);

            if(results.rows.length > 0) {
                //user exists so now we can
                //update profile
                console.log('HANDLER: user exists so now we are going to update');
                var userProfile = setUserProfile(req);
                var userData = setUserData(req);

                let promiseArr = [];
                promiseArr.push(dbQuery.updateProfile(userProfile));
                promiseArr.push(dbQuery.updateUser(userData));

                return Promise.all(promiseArr).then(() => {
                    res.redirect('/petition');
                });
            } else {
                //add user_profile
                addProfile(req, res);
            }


        }).catch(e => {
            console.error(e.stack);
            res.redirect('/profile/edit');

        });
    }

    if(query == 'deleteSig') {
        dbQuery.deleteSig([req.session.user.sigId]).then(() => {
            req.session.user.sigId = null;
            res.redirect('/petition');
        }).catch(e => {
            console.error(e.stack);
            res.redirect('/petition');

        });
    }
}

function renderProfile(req, res) {
    return dbQuery.getProfile([req.session.user.id]).then((results) => {
        console.log('HANDLER getProfile results: ', results.rows[0]);

        let userInfo = results.rows[0] || {};
        userInfo.first_name = req.session.user.first_name;
        userInfo.last_name = req.session.user.last_name;

        return userInfo;
    });
}

function setUserData(req) {
    var userInfo = [req.body['first_name'], req.body['last_name'], req.body['email']];
    if(req.body.password) {
        userInfo.push(req.body['password']);
    } else {
        userInfo.push(req.session.user.id);
    }

    return userInfo = help.validate(userInfo);
}

function renderThankyou(req, res) {
    console.log('HANDLER: inside renderthankyou');
    console.log('HANDLER: SigId:', req.session.user.sigId);

    let promiseArr = [];
    promiseArr.push(dbQuery.numSignatures());
    promiseArr.push(dbQuery.getSignature(req.session.user.sigId));

    return Promise.all(promiseArr).then((results)=> {
        console.log('HANDLER result: ', results[1].signature);
        res.render('thankyou', {count: results[0], 'imgsrc': results[1][0].signature, csrfToken: req.csrfToken(), nav: nav});
    });
}

function setUserProfile(req) {
    var userProfile = [req.session.user.id, req.body['age'], req.body['city'], req.body['homepage']];
    return userProfile = help.validate(userProfile);
    //console.log('HANDLER add_profile: validUserInfo', userProfile);
}

function addProfile(req,res) {
    let userProfile = setUserProfile(req);

    if(!userProfile[1] && !userProfile[2] && !userProfile[3]) {
        console.log('HANDLER addProfile func: all values null');
        res.redirect('/petition');
    } else {
        //add them to the database
        return dbQuery.addProfile(userProfile).then(() => {
            res.redirect('/petition');
        }).catch(e => {
            console.error(e.stack);
            res.render('login', { 'error' : true, csrfToken: req.csrfToken(), nav: nav });
        });
    }
}

module.exports.handle = handle;

/** TESTS **/



// var registrationBody = {
//     first_name: 'Tiffany',
//     last_name: 'Theiessen',
//     email: 'Tif@gmail',
//     password: 'ilovezack'
// };
// //
// // var registrationBodyNull = {
// //     first_name: '',
// //     last_name: 'Theiessen',
// //     email: 'Tif@gmail',
// //     password: ''
// // };
// //
// console.log(validateUser(registrationBody));
// console.log(validateUser(registrationBodyNull));
//
// var registration = { body: {
//     first_name: 'Jennifer',
//     last_name: 'Aniston',
//     email: 'Jen@gmail',
//     password: 'istilllovebrad'
// }};
//
// var registration = { body: {
//     first_name: 'Louis',
//     last_name: 'CK',
//     email: 'louis@gmail',
//     password: 'noonelovesme'
// }};
//
// handle('registerUser', registration);

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

//check pass returns a boolean
//checkPassword('ilovezack', '$2a$10$uC5KEwHDIUBkEqoBy8BLqO2X0i7hcFdbBGRI4r545Kg21FDAvnwhO');

// var login = { body: {
//     email: 'Tif@gmail',
//     password: 'ilovezack'
// }};
//
// handle('login', login);

// var login2 = { body: {
//     email: 'louis@gmail',
//     password: 'noonelovesme'
// }};
//
// handle('login', login2);
// var loginBad = { body: {
//     email: 'Tif@gmail',
//     password: 'ilovezac'
// }};
//
// handle('login', loginBad);

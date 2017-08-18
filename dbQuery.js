const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json');

//forward slashes are optional
const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.pass}@localhost:5432/petition`);
//db returns a promise and you will get back a result
function getSigners() {
    console.log('DBQUERY: in getSigners');
    let queryStr = 'SELECT first_name, last_name FROM signatures';
    return db.query(queryStr).then((result) => {
        return(result.rows);
    }).catch(e => console.error(e.stack));
}

function addSignature(userData) {
    //userData is an array: first_name, last_name, signature
    console.log('DBQUERY: in add signature');
    let queryStr = 'INSERT INTO signatures (user_id, first_name, last_name, signature) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(queryStr, userData);
}

function getSignature(id) {
    console.log('DBQUERY: in getSignature()');
    let param = Array.isArray(id) ? id: [id];
    let queryStr = 'SELECT signature FROM signatures WHERE id = $1';
    return db.query(queryStr, param).then((result) => {
        return(result.rows);
    }).catch(e => console.error(e.stack));
}

function numSignatures() {
    let queryStr = 'SELECT COUNT(*) FROM signatures';
    return db.query(queryStr).then((result) => {
        return(result.rows[0].count);
    }).catch(e => console.error(e.stack));
}

//then we need to query the database to add user with an array that has first_name, last_name, email, hashed password
function addUser(userInfo) {
    console.log('DBQUERY: in add user.');
    let queryStr = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id';
    return db.query(queryStr, userInfo);
}

//dbQuery to get password, first_name and last_name and id from users table using e-mail
function getUserInfo(email) {
    console.log('DBQUERY: in getPass');
    let queryStr = ('SELECT id, first_name, last_name, password FROM users WHERE email = $1');
    return db.query(queryStr, email);
}


module.exports.getSigners = getSigners;
module.exports.addSignature = addSignature;
module.exports.getSignature = getSignature;
module.exports.numSignatures = numSignatures;
module.exports.addUser = addUser;
module.exports.getUserInfo = getUserInfo;

/* Tests */
// getUserInfo(['leo@gmail']).then((results) => {
//     console.log(results);
// }).catch(e => console.error(e.stack));

// getSigners().then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));
//
// addSignature(['Lizzy', 'Millenaar', 'Lizzy Sig']).then(() =>{
//     console.log('added signature');
//     return getSigners();
// }).then((result) => {
//     console.log(result);
// }).catch(e => console.error(e.stack));

// numSignatures().then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));
//
// getSignature([1]).then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));
//
// getSignature(1).then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));
//
// getSignature(10).then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));

/* Failing Tests */
// getSignature('maggie').then(result => {
//     console.log(result);
// }).catch(e => console.error(e.stack));

// addSignature(['Null Sig', 'Test', null]).then(() =>{
//     console.log('added signature');
//     return getSigners();
// }).then((result) => {
//     console.log(result);
// }).catch(e => console.error(e.stack));

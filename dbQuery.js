const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json');

//forward slashes are optional
const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.pass}@localhost:5432/petition`);
//db returns a promise and you will get back a result
function getSigners() {
    let queryStr = 'SELECT first_name, last_name FROM signatures';
    return db.query(queryStr).then((result) => {
        return(result.rows);
    }).catch(e => console.error(e.stack));
}

function addSignature(userData) {
    //userData is an array: first_name, last_name, signature
    console.log('in add signature');
    let queryStr = 'INSERT INTO signatures (first_name, last_name, signature) VALUES ($1, $2, $3)';
    return db.query(queryStr, userData).then(() => {
        console.log('signature added');
    }).catch(e => console.error(e.stack));
}

function getSignature(id) {
    let param = Array.isArray(id) ? id: [id];
    let queryStr = 'SELECT signature FROM signatures WHERE id = $1';
    return db.query(queryStr, param).then((result) => {
        return(result.rows);
    }).catch(e => console.error(e.stack));
}

function numSignatures() {
    let queryStr = 'SELECT COUNT(*) FROM signatures';
    return db.query(queryStr).then((result) => {
        return(result.rowCount);
    }).catch(e => console.error(e.stack));
}

module.exports.getSigners = getSigners;
module.exports.addSignature = addSignature;
module.exports.getSignature = getSignature;
module.exports.numSignatures = numSignatures;

/* Tests */
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

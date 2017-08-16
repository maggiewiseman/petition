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

    return db.query(queryStr, userData);
}


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

// addSignature(['Null Sig', 'Test', null]).then(() =>{
//     console.log('added signature');
//     return getSigners();
// }).then((result) => {
//     console.log(result);
// }).catch(e => console.error(e.stack));

/*rows: [anonymous: {
    id: 1
    name: 'Batman',
    secret_identity: 'Bruce Wayne',
    universe: 'DC'
},
etc. */
///when an object is created using a constructor, it sets the object name = to the constructor and in this case the constructor was an anonymouse function

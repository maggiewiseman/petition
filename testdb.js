const spicedPg = require('spicedPg');

//forward slashes are optional
const db = spicedPg('postgres:dbUser:password@localhost:5432/davidfriedman');
//db returns a promise and you will get back a result
db.query('SELECT * FROM superhearoes').then((result)=>) {
    console.log(result);
}

/*rows: [anonymous: {
    id: 1
    name: 'Batman',
    secret_identity: 'Bruce Wayne',
    universe: 'DC'
},
etc. */
///when an object is created using a constructor, it sets the object name = to the constructor and in this case the constructor was an anonymouse function

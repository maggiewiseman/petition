const express = require('express');
//const cookieSession = require('cookie-session');
const hb = require('express-handlebars');

var session = require('express-session'),
    Store = require('connect-redis')(session);


var secret = process.env.SESSION_SECRET || require('./secrets.json').sessionSecret;
var host = process.env.DATABASE_REDIS || 'localhost';

const app = express();

//cofigure handlebars
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({defaultLayout: 'main'}));


app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({
    extended: false
}));


app.use(session({
    store: new Store({
        ttl: 3600, //time to live
        host: host,
        port: process.env.PORT || 6379
    }),
    resave: false, 
    saveUninitialized: true,
    secret: secret
}));
//app.use(cookieParser);

// app.use(cookieSession({
//     name: 'session',
//     secret: secret,
//     // Cookie Options
//     maxAge: 14 * 24 * 60 * 60 * 1000 // 24 hours
// }));


app.use(require('./routers/routes'));

app.listen(process.env.PORT || 8080, ()=> {
    console.log('Listening on port 8080');
});

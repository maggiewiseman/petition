const express = require('express');
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const hb = require('express-handlebars');
const secrets = require('./secrets.json');

const app = express();


//cofigure handlebars
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({defaultLayout: 'main'}));


app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({
    extended: false
}));

//app.use(cookieParser);

app.use(cookieSession({
    name: 'session',
    secret: secrets.sessionSecret,
    // Cookie Options
    maxAge: 14 * 24 * 60 * 60 * 1000 // 24 hours
}));


app.use(require('./routers/routes'));

app.listen(process.env.PORT || 8080, ()=> {
    console.log('Listening on port 8080');
});

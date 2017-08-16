const express = require('express');
const cookieParser = require('cookie-parser');
const handler = require('./handler');
const hb = require('express-handlebars');

const app = express();
//cofigure handlebars
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({defaultLayout: 'main'}));

app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({
    extended: false
}));


//set up to use cookies
app.use(cookieParser());

//if they pass the cookie test then they can go on.
//If they do not pass the cookie test I need to redirect.
app.get('/', (req,res) => {
    res.redirect('/petition');
});

app.get('/petition/signed', checkCookies, (req, res)=> {
    console.log('inside get /petition/signed');

    handler.handle('numSignatures', req.params, res);
    //res.send('Thanks for signing');
});

app.get('/petition', checkCookies, (req, res)=> {
    //eventually this will render the main page
    res.render('petition');
});

app.get('/petition/signatures', checkCookies, (req, res) => {
    handler.handle('getSigners', req.params, res);
});

app.post('/petition', (req,res) => {
    console.log('reqParams: ', req.body);
    handler.handle('addSignature', {params: req.body}, res);
});

app.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.render('404');
});


app.listen(8080, ()=> {
    console.log('Listening on port 8080');
});

function checkCookies(req, res, next) {
    //if the cookie exists, redirect to signed page
    console.log('checking for signed cookie', req.cookies['signed']);
    console.log('url: ', req.url);
    //if they have the cookie then they can go to the signed page, but
    //else they need to be redirected to the regular page
    if(req.cookies['signed'] == 'yes') {
        if(req.url == '/petition/signed' || req.url == '/petition/signatures') {
            next();
        } else {
            res.redirect('/petition/signed');
        }
    } else {
        if(req.url != '/petition') {
            console.log('url does not equal /petition');
            res.redirect('/petition');
        } else {
            next();
        }
    }
}

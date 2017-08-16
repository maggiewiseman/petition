const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

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
    //eventually this will render the main page
    res.send('Thanks for signing');
});

app.get('/petition', checkCookies, (req, res)=> {
    //eventually this will render the main page
    res.send('Hello World');
});



app.get('/petition/signatures', checkCookies, (req, res) => {
    res.send('signatures');
});

app.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.send('file not found');
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
        if(req.url != '/petition/signed') {
            res.redirect('/petition/signed');
        } else {
            next();
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

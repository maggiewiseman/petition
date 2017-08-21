const express = require('express');
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const handler = require('./handler');
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


//set up to use cookies
//app.use(cookieParser());

app.use(cookieSession({
    name: 'session',
    secret: secrets.sessionSecret,
    // Cookie Options
    maxAge: 14 * 24 * 60 * 60 * 1000 // 24 hours
}));

//if they pass the cookie test then they can go on.
//If they do not pass the cookie test I need to redirect.
app.get('/', (req,res) => {
    res.redirect('/petition');
});

//app.use(checkSession);

app.get('/petition/signed', (req, res)=> {
    console.log('SERVER: inside get /petition/signed');

    handler.handle('thankyou', req, res);
    //res.send('Thanks for signing');
});

app.get('/petition', loggedInCheck, signedPetitionCheck, (req, res)=> {
    res.render('petition');
});

app.post('/petition', (req,res) => {
    handler.handle('addSignature', req, res);
});

app.get('/petition/signatures/:city', loggedInCheck, signedPetitionCheck2, (req, res) => {
    console.log('SERVER: cityname route');
    handler.handle('signersByCity', req, res);
});

app.get('/petition/signatures', loggedInCheck, signedPetitionCheck2, (req, res) => {
    handler.handle('getSigners', req.params, res);
});

//if they are logged in then check if signed
//if not signed go to /petition page
app.get('/register', registerLoginCheck, (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    handler.handle('registerUser', req, res);
});

app.get('/login', registerLoginCheck, (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    handler.handle('login', req, res);
});

app.get('/profile', loggedInCheck, profileCheck, (req, res) => {
    res.render('profile');
});

app.post('/profile', (req, res) => {
    handler.handle('add_profile', req, res);
});

app.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.render('404');
});


app.listen(3000, ()=> {
    console.log('Listening on port 3000');
});

function registerLoginCheck(req, res, next) {

    if(req.session.user) {
        //logged in
        if(req.session.user.sigId) {
            //already signed petition
            res.redirect('/petition/signed');
        } else {
            //logged in but haven't signed petition
            res.redirect('/petition');
        }
    } else {
        //not logged in go to tregistration page
        next();
    }
}
function loggedInCheck(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/register');
    }
}

//called by petition route so if they've signed they get redirected
function signedPetitionCheck(req, res, next) {
    if(req.session.user.sigId) {
        res.redirect('/petition/signed');
    } else {
        next();
    }
}

//called by other stuff so if they've signed they can go ot the page requested. otherwise they get redirected back to the petition page
function signedPetitionCheck2(req,res, next) {
    if(req.session.user.sigId) {
        next();
    } else {
        res.redirect('/petition');
    }
}

function profileCheck(req, res, next) {
    console.log('Session profile flag is not being set anywher!');
    if(req.session.user.profile) {
        res.redirect('/petition');
    } else {
        next();
    }

}
// function checkSession(req, res, next) {
//     //if logged in...meaning there is a session userInfo
//     console.log('SERVER: checkSession');
//     if(req.session.user) {
//         //logged in!
//         console.log('SERVER: user logged in');
//         if(req.session.user.sigId){
//             console.log('SERVER: signed petition');
//             //already signed petition!
//             if(req.url == '/petition/signed' || req.url == '/petition/signatures') {
//                 console.log('SERVER going to next');
//                 next();
//             } else {
//                 res.redirect('/petition/signed');
//             }
//         } else {
//             //logged in but have not signed
//             if(req.url == '/petition' || req.url == '/profile')  {
//                 next();
//             } else {
//                 res.redirect('/petition');
//             }
//         }// end signed petition check
//     } else {
//         //not logged in!
//         if(req.url == '/register' || req.url == '/login') {
//             next();
//         } else {
//             res.redirect('/register');
//         }
//     }

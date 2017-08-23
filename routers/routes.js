const express = require('express');
const mw = require('./middleware');
const handler = require('../handler').handle;
const csrf = require('csurf');

const csrfProtection = csrf();
const router = express.Router();


router.get('/', (req,res) => {
    res.redirect('/petition');
});

router.get('/petition/signed', mw.loggedInCheck, mw.signedPetitionCheck2, csrfProtection, (req, res)=> {
    console.log('ROUTER: inside get /petition/signed');

    handler('thankyou', req, res);
});

router.route('/petition')
    .all(csrfProtection)
    .get(mw.loggedInCheck, mw.signedPetitionCheck, (req, res)=> {
        console.log('csrf token:', req.csrfToken());
        res.render('petition', {csrfToken: req.csrfToken()});
    })

    .post((req,res) => {
        handler('addSignature', req, res);
    });

router.get('/petition/signatures/:city', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res) => {
    console.log('ROUTER: city route', req.params.city);
    handler('signersByCity', req, res);
});

router.get('/petition/signatures', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res) => {
    handler('getSigners', req.params, res);
});

//if they are logged in then check if signed
//if not signed go to /petition page
router.route('/register')
    .all(csrfProtection)

    .get(mw.registerLoginCheck, (req, res) => {
        res.render('register', {csrfToken: req.csrfToken()});
    })

    .post((req, res) => {
        handler('registerUser', req, res);
    });

router.route('/login')
    .all(csrfProtection)
    .get(mw.registerLoginCheck, (req, res) => {
        res.render('login', {csrfToken: req.csrfToken()});
    })

    .post((req, res) => {
        handler('login', req, res);
    });

router.route('/profile')
    .all(csrfProtection)

    .get(mw.loggedInCheck, mw.profileCheck, (req, res) => {
        res.render('profile', {csrfToken: req.csrfToken()});
    })

    .post((req, res) => {
        handler('addProfile', req, res);
    });

router.route('/profile/edit')
    .all(csrfProtection)
    .get(mw.loggedInCheck, (req,res) => {
        console.log(req.session.user);
        handler('getProfile', req, res);
    })

    .post((req, res) => {
        console.log('ROUTES post updateProfile, handing off to handler');
        handler('updateProfile', req, res);
    });

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});

router.post('/delete', csrfProtection, (req,res) => {
    handler('deleteSig', req, res);
});

router.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.render('404');
});

module.exports = router;

const express = require('express');
const mw = require('./middleware');
const handler = require('../handler').handle;

const router = express.Router();


router.get('/', (req,res) => {
    res.redirect('/petition');
});

router.get('/petition/signed', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res)=> {
    console.log('ROUTER: inside get /petition/signed');

    handler('thankyou', req, res);
});

router.route('/petition')
    .get(mw.loggedInCheck, mw.signedPetitionCheck, (req, res)=> {
        res.render('petition');
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
    .get(mw.registerLoginCheck, (req, res) => {
        res.render('register');
    })

    .post((req, res) => {
        handler('registerUser', req, res);
    });

router.route('/login')
    .get(mw.registerLoginCheck, (req, res) => {
        res.render('login');
    })

    .post((req, res) => {
        handler('login', req, res);
    });

router.route('/profile')
    .get(mw.loggedInCheck, mw.profileCheck, (req, res) => {
        res.render('profile');
    })

    .post((req, res) => {
        handler('addProfile', req, res);
    });

router.route('/profile/edit')
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
    res.render('login');
});

router.post('/delete', (req,res) => {
    handler('deleteSig', req, res);
});

router.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.render('404');
});

module.exports = router;

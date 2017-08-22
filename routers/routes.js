const express = require('express');
const mw = require('./middleware');
const handler = require('../handler').handle;

const router = express.Router();


router.get('/', (req,res) => {
    res.redirect('/petition');
});

router.get('/petition/signed', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res)=> {
    console.log('SERVER: inside get /petition/signed');

    handler('thankyou', req, res);
});

router.get('/petition', mw.loggedInCheck, mw.signedPetitionCheck, (req, res)=> {
    res.render('petition');
});

router.post('/petition', (req,res) => {
    handler('addSignature', req, res);
});

router.get('/petition/signatures/:city', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res) => {
    console.log('SERVER: city route', req.params.city);
    handler('signersByCity', req, res);
});

router.get('/petition/signatures', mw.loggedInCheck, mw.signedPetitionCheck2, (req, res) => {
    handler('getSigners', req.params, res);
});

//if they are logged in then check if signed
//if not signed go to /petition page
router.get('/register', mw.registerLoginCheck, (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    handler('registerUser', req, res);
});

router.get('/login', mw.registerLoginCheck, (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    handler('login', req, res);
});

router.get('/profile', mw.loggedInCheck, mw.profileCheck, (req, res) => {
    res.render('profile');
});

router.post('/profile', (req, res) => {
    handler('add_profile', req, res);
});

router.use((req,res) => {
    console.error('File Not Found, 404');
    res.status(404);
    res.render('404');
});

module.exports = router;

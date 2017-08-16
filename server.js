const express = require('express');
const cookieP = require('cookie-parser');

const app = express();

//cookie check


//when users first arrive

app.get('/', (req,res) => {
    res.redirect('/petition');
});
app.get('/petition', (req, res)=> {
    res.send('Hello World');
});

app.post('/petition', (req, res) => {

});



app.listen(8080, ()=> {
    console.log('Listening on port 8080');
});

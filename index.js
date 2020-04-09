const express = require('express'),
mongoose = require('mongoose');
const passport = require('passport');
//passport setuo 
require('./config/passport')(passport);
app = express();

const port = process.env.PORT || 5000;



app.get('/', (re, res) => {
    res.send('hii from node.js');
})

app.use('/auth', require('./routes/auth'));

app.listen(port, ()=> {
    console.log(`server running of ${port}`);
})
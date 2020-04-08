const express = require('express'),
mongoose = require('mongoose'),
app = express();

const port = process.env.PORT || 5000;

app.get('/', (re, res) => {
    res.send('hii from node.js');
})


app.listen(port, ()=> {
    console.log(`server running of ${port}`);
})
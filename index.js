const express = require('express'),
mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

require('./models/User');
//passport setuo 
require('./config/passport')(passport);
app = express();

app.use(express.static('public'));

//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout : 'main'
}));
app.set('view engine', 'handlebars');
const port = process.env.PORT || 5000;



const keys = require('./config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('mongoDB connected'))
.catch((err) => console.log(err));




//passport middleware
app.use(cookieParser('secret'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({ 
    secret: 'secret', resave: false, saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

// set global user
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'));





app.listen(port, ()=> {
    console.log(`server running of ${port}`);
})
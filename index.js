const express = require('express'),
mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars'); 
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');
const path = require('path');

require('./models/User');
require('./models/Story');
//passport setuo 
require('./config/passport')(passport);
app = express();

// Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
  } = require('./helpers/hbs');
  

  app.use(methodOverride('_method'))

//handlebar middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select : select,
        editIcon : editIcon
      },    
    defaultLayout : 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
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



app.use(express.static('public'));

//passport middleware
// app.use(cookieParser('secret'))
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));






app.listen(port, ()=> {
    console.log(`server running of ${port}`);
})
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authroutes'); // Adjust the path as needed
const cors = require('cors');
const rootRouter = require("./routes/index");
const bodyParser = require('body-parser');

require('dotenv').config();
require('./passport'); // Ensure the path is correct

const app = express();

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cors());

// Oauth providers 
app.use(authRoutes);
// Basic user authentication
app.use("/api/v1", rootRouter);


app.get('/', (req, res) => {
    // let name = req.user.displayName;
    // res.json({
    //     msg: `hello ${name} your are logged in `
    // })
    res.send('Hello World! You are logged ' + (req.isAuthenticated() ? 'in' : 'out'));
});


app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});

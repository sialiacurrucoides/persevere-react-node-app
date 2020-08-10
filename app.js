require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const PORT = process.env.PORT || 4000;
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path');
const helmet = require("helmet");
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(helmet());


app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://admin-juli:" + process.env.MONGO_PSW + "@perseverecluster.5sdm7.mongodb.net/" + process.env.DBNAME, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    sameSite: 'lax',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());




const userSchema = new mongoose.Schema({
    dateid: Number,
    name: String,
    username: { type: String, unique: true, required: true },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});
// //to hash and salt 
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.get("/user", (req, res) => {

    const userData = {
        username: req.user.username,
        name: req.user.name,
        dateid: req.user.dateid
    }
    if (userData) {
        res.send(userData);
    } else {
        res.send("Cannot fetch user data");
    }
});

app.get("/logout", function (req, res) {

    req.logout();
    req.session.destroy(function (err) {
        if (!err) {
            res.status(200).clearCookie('connect.sid', { path: '/' }).json({ status: "Success" });
        } else {
            console.log("the cookie is kept")
        }

    });

})

app.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {

        if (!user) {
            return res.send({ errMsg: "Password reset token is invalid or has expired." });
        }

        res.redirect("/reset/" + req.params.token);
    });
});

// Routes
app.use('/', require('./routes/index.js'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.post("/registration", function (req, res) {
    //from passport-local-mongoose package

    const newUser = new User({
        dateid: Number(new Date()),
        username: req.body.email,
        name: req.body.name
    });

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            res.send({ errMsg: "The user already exists." });
        } else {
            let authenticate = User.authenticate();
            authenticate(newUser.username, req.body.password, function (err, result) {
                if (err) { res.send({ errMsg: "Something happened, please try again." }); }
                else {
                    req.logIn(result, function (err) {
                        if (err) { return res.send({ errMsg: "Something happened, please try again." }); }
                        else {
                            return res.send("OK");
                        }
                    });
                }

            });
        }



    });
});


app.post('/login', function (req, res, next) {


    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            console.log("server error");
            return res.send({ errMsg: "Server error" });
        } else if (!user) {
            console.log("no such user");
            return res.send({ errMsg: "No such user" });
        } else {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    console.log("error occured");
                    return res.send({ errMsg: "Connection error." });
                }
                if (!user) {
                    console.log("wrong password");
                    return res.send({ errMsg: "Wrong password" });
                }
                if (user) {
                    req.logIn(user, function (err) {
                        if (err) {
                            console.log('error in login');
                            return res.send({ errMsg: "An error occured, please try again later." })
                        }
                        return res.send("OK");
                    });
                }

            })(req, res, next);
        }
    });

});





app.post("/forgot", function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ username: req.body.email }, function (err, user) {

                if (err) console.log(err);
                if (!user) {
                    res.send('noU');
                } else {
                    res.send(user.username);
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                host: process.env.HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAILM,
                    pass: process.env.MAILPW
                }
            });

            var mailOptions = {
                to: user.username,
                from: process.env.MAILM,
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/login');
    });

});


app.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    return res.send({ errMsg: "Password reset token is invalid or has expired." })
                }
                if (req.body.password === req.body.confirm) {

                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    return res.send({ errMsg: "Passwords do not match." });
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.MAILM,
                    pass: process.env.MAILPW
                }
            });
            var mailOptions = {
                to: user.username,
                from: process.env.MAILM,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.send({ successMsg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/login');
    });
});




app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}.`);
});
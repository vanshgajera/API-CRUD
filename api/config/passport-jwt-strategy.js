const passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'RNW';

let User = require('../models/RegisterModel');

passport.use(new JwtStrategy(opts,async function(jwt_payload, done) {
    let Record = await User.findById(jwt_payload._id);
    console.log(Record);
    if(Record)
    {
        return done(null, Record);
    }
    else{
        return done(null, false);
    }
}));

module.exports = passport;


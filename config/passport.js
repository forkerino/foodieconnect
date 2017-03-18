const FBStrategy = require('passport-facebook').Strategy;

const User = require('../app/models/user');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(new FBStrategy({
		clientID        : process.env.FBAPPID,
        clientSecret    : process.env.FBAPPSECRET,
        callbackURL     : process.env.FBCALLBACK
	},

	function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user); 
                } else {
                    var newUser = new User();

                    newUser.facebook.id    = profile.id;                 
                    newUser.facebook.token = token; 
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; 

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};
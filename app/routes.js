'use strict';

const yelp = require('yelp-fusion');

module.exports = function (app, passport) {
	app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/', function(req, res){
    	res.render('index.ejs', {
    		yelps: []
    	});
    });

    app.post('/api/location', getYelpData, function(req, res){
    	console.log(req);
    	res.render('index.ejs', {
    		yelps: req.yelps
    	});
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

function getYelpData(req, res, next){
	if (req.body.location.length <= 2){
		res.redirect('/');
	} else {
		yelp.accessToken(process.env.YELPID, process.env.YELPSECRET).then(response => {
		    const client = yelp.client(response.jsonBody.access_token);

			  client.search({
			    term:'restaurants',
			    location: req.body.location
			  }).then(response => {
		    req.yelps = response.jsonBody.businesses.map(function(y){
		    	return {
		    		name: y.name,
		    		location: y.location,
		    		phone: y.display_phone,
		    		rating: y.rating,
		    		img: y.image_url,
		    		price: y.price,
		    		url: y.url
		    	}
		    }).sort(function(a,b){
		    	return b.rating - a.rating;
		    });
		    next();
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
}
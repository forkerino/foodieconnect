'use strict';
const session = require('express-session');
const yelp = require('yelp-fusion');
const serverCtrl = require('./controllers/serverCtrl');

module.exports = function (app, passport) {
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: "public_profile"}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/', function(req, res){
    	res.render('index.ejs', {
    		user: req.user,
    		yelps: req.session.yelps || []
    	});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/api/loggedin', function(req, res){
    	if (req.isAuthenticated()){
    		res.status(200).send();
    	} else {
    		res.status(504).send();
    	}
    });

    app.put('/api/venue/:id', function(req, res){
    	if (!req.isAuthenticated()) {
    		res.redirect(303, '/auth/facebook');
    	} else {
    		serverCtrl.toggleVenueVisitor({ id: req.params.id, user: req.user.facebook.id }).then(function(n){
    			res.status(200).send(n.toString());
    		});
    		
    	}
    });

    app.post('/api/venues', function(req, res){
    	serverCtrl.getVisitors(req.body)
	    	.then(function(d){
	    		console.log(d);
	    		res.status(200).send(JSON.stringify(d));
	    	})
	    	.catch(e => console.error(e));
    });

    app.post('/api/location', getYelpData, function(req, res){
    	req.session.yelps = req.yelps;
    	res.render('index.ejs', {
    		user: req.user,
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
			  	console.log(response.jsonBody.businesses);
		    req.yelps = response.jsonBody.businesses.map(function(y){
		    	return {
		    		name: y.name,
		    		location: y.location,
		    		phone: y.display_phone,
		    		rating: y.rating,
		    		img: y.image_url,
		    		price: y.price,
		    		url: y.url,
		    		id: y.id
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
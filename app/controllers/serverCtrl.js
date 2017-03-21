'use strict';

const Venue = require('../models/venue');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = {
	getVisitors: function getVisitors(list){
		let numberPromises = list.map(function(item){
			return new Promise(function(resolve,reject){
				Venue.findOne({venueid: item}).exec()
					.then(function(loc){
						if (loc == null){
							resolve([item, 0]);
						} else {
							resolve([item, loc.going]);
						}	
					})
					.catch(e => console.error(e));
			});
		});

		return new Promise(function(resolve, reject){
			Promise.all(numberPromises)
				.then(function(data){
					resolve(data.filter(v => v[1] !== 0));
				})
				.catch(e => console.error(e));
		});
	},

	toggleVenueVisitor: function toggleVenueVisitor(data){
		return new Promise(function(resolve, reject){
			Venue.findOne({venueid: data.id}).exec()
			.then(function(loc){
				console.log(loc);
				if (loc == null){
					let newVenue = new Venue();
					newVenue.venueid = data.id;
					newVenue.going = [];
					newVenue.going.push(data.user);
					newVenue.save(function(err, doc){
		                if (err) throw err;
		                console.log(doc);
		                resolve(doc.going);
	            	});
				} else if (loc.going.includes(data.user)) {
					Venue.findOneAndUpdate({venueid: data.id}, 
						{ $pull: {going: data.user}},
						{ new: true},
						function(err,doc){
							console.log ("pull: ", doc);
							if (err) throw(err);
							if(doc) resolve(doc.going);
						});
				} else {
					Venue.findOneAndUpdate({venueid: data.id}, 
						{ $push: {going: data.user}}, 
						{ new: true},
						function(err,doc){
							console.log ("push: ", doc);
							if (err) throw(err);
							if(doc) resolve(doc.going);
						});
				}
			})
			.catch(err => reject(err));
		});
	}
}
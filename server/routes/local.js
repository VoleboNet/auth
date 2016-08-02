/*

Authenticating service for volebo.net

Copyright (C) 2016  Volebo.Net <volebo.net@gmail.com>
Copyright (C) 2016  Koryukov Maksim <maxkoryukov@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

"use strict";

const vbexpress       = require('@volebonet/volebonet-express');
const debug           = require('debug')('volebonet:auth:server:routes:local');
const passport        = require('passport');

const LocalStrategy   = require('passport-local').Strategy;

let main = function route_local_main(app) {

	let router = vbexpress.Router();

	debug('Environment expectation: VOLEBONET_AUTH_LOCAL_SALT');
	//const localsalt = process.env.VOLEBONET_AUTH_LOCAL_SALT;

	/*
	if (_.isNil(localsalt)) {
		// TODO : beautiful error
		throw new Error('Expect to get in the environment: VOLEBONET_AUTH_LOCAL_SALT');
	}
	*/

	passport.use('local', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {


		// TODO : convert user to internal structure, with:
		// profile.provider
		// profile.id
		// profile.emails
		// profile.name.firstName
		// profile.name.lastName

		let user = false;

		// TODO : use model for validation
		if (password === '123') {
			user = username;
		}

		done(null, user);
	}));


	router.post('/local/auth-e', function(req, res, next) {
		// TODO : save BACK URL
		next();
	},
	passport.authenticate('local', { failureRedirect: '/fail' }),
	function (req, res, next) {
		// TODO: replace redirects!
		res.redirect('/success');
	});

	return router;
};

exports = module.exports = main;

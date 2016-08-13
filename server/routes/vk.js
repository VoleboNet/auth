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
const debug           = require('debug')('volebonet:auth:server:routes:vk');
const _               = require('lodash');
const passport        = require('passport');

const VKStrategy      = require('passport-vkontakte').Strategy;

let main = function route_vkontakte_main(app) {

	let router = new vbexpress.Router();

	debug('Environment expectation: VOLEBONET_AUTH_VK_ID');
	debug('Environment expectation: VOLEBONET_AUTH_VK_KEY');

	const vkid = process.env.VOLEBONET_AUTH_VK_ID;
	const vkkey = process.env.VOLEBONET_AUTH_VK_KEY;
	const vkcallbackuri = app.getRootUrl() + 'vk/auth-e/callback';

	if (_.isNil(vkid) || _.isNil(vkkey)) {
		// TODO : beautiful error
		throw new Error('Expect to get in the environment: VOLEBONET_AUTH_VK_ID ' +
			'and VOLEBONET_AUTH_VK_KEY');
	}

	passport.use('vk', new VKStrategy({
		clientID:     vkid,
		clientSecret: vkkey,
		// NOTE: keep in sync with #callbackvk
		callbackURL:  vkcallbackuri,
		profileFields: ['city', 'bdate', 'nickname'],
		scope: ['email', 'friends', 'notify'],
		apiVersion: '5.53',
	},
	function(accessToken, refreshToken, params, profile, done) {

		// email bug: github-ticket is closed, but proplem exists...
		// https://github.com/stevebest/passport-vkontakte/issues/15
		// https://github.com/stevebest/passport-vkontakte/issues/13
		// crutches...
		profile.emails = profile.emails || [];
		if (params && params.email) {
			profile.emails.push({
				value: params.email,
				type: 'home'
			});
		}

		// TODO : search for a user with this identity info:
		// profile.provider
		// profile.id
		// profile.emails
		// profile.name.firstName
		// profile.name.lastName

		// TODO : convert user to internal structure
		let user = profile.id;
		return done(null, user);
	}));


	// passport.authenticate will redirect, so you couldn't append
	// another one MW AFTER auth. Only before.
	router.get('/vk/auth-e/', function(req, res, next) {
		// TODO : save BACK URL
		next();
	}, passport.authenticate('vk'));


	// DO NOT CHANGE this URL, it is registered in the external app.
	// NOTE: keep in sync with #callbackvk
	// TODO : add timeout here
	router.get('/vk/auth-e/callback',
		passport.authenticate('vk', { failureRedirect: '/fail' }),
		function (req, res, next) {

			// TODO: replace redirects!
			res.redirect('/success');
		}
	);

	return router;
};

exports = module.exports = main;

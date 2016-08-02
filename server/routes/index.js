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
const debug           = require('debug')('volebonet:auth:server:routes:index');
const passport        = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const VKStrategy = require('passport-vkontakte').Strategy;

let router          = vbexpress.Router();


passport.use('local', new LocalStrategy({
	passReqToCallback: true
},
function(req, un, password, done) {
	debug('passport====================', un, password);
	if (password === '123') {
		done(null, un);
	} else {
		done(null, false);
	}

	// on error: done(Error, false);
}));

passport.use(new VKStrategy({
	clientID:     '1',
	clientSecret: '2',
	callbackURL:  'http://127.0.0.1:3000/vkauth/callback',
	profileFields: ['city', 'bdate', 'nickname'],
	scope: ['email', 'friends', 'notify'],
	apiVersion: '5.53',
},
function(accessToken, refreshToken, params, profile, done) {

	debug('passport==================vk.done', accessToken, params.email, refreshToken, profile);
	let user = profile.id;
	return done(null, user);
}));


router.post('/login', function(req, res, next) {
	debug('HEERE');
	debug(req.body.username, req.body.password);
	next();
},

passport.authenticate('local', {
	successRedirect: '/success', // TODO : bullshit!!! Remove urgently!
	failureRedirect: '/fail', // TODO : bullshit!!! Remove urgently!
}));

router.get('/vkauth/callback',
	function(req, res, next) {
		debug('callback called!!!');
		next();
	},
	passport.authenticate('vkontakte', { failureRedirect: '/fail' }),
	function (req, res, next) {
		res.redirect('/success');
	}
);

// LOGIN

router.get('/vkauth/',
	function(req, res, next) {
		debug('VKAUTH REQQQQQQQQQQQ');
		next();
	},
	passport.authenticate('vkontakte'),
	function(req, res, next) {
		debug('nnnnnnnnnnnneeeeeeeeeeeevvvvvvvvvvvvveeeeeeeeeeerrrrrrrrrrrrrrrr');
		next();
	});

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
	//return next();
});

// LOGOUT

router.post('/logout', function(req, res, next) {

	debug('logout');
	res.status(200).send('Logout');
	//return next();
});

// RESULT HANDLERS

router.get('/success', function(req, res, next) {
	debug('success');
	res.status(200).send('Success!');
	//return next();
});

router.get('/fail', function(req, res, next) {
	debug('fail');
	res.status(401).send('Failed!');
	//return next();
});

exports = module.exports = router;

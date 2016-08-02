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

const debug           = require('debug')('volebonet:auth:server:routes:index');
const vbexpress       = require('@volebonet/volebonet-express');

let main = function route_main(app) {

	let router = vbexpress.Router();

	router.get('/', function(req, res, next) {

		res.render('login');
	});

	router.post('/logout', function(req, res, next) {

		debug('logout');
		res.status(200).send('Logout');
		//return next();
	});

	router.get('/success', function(req, res, next) {
		debug('success');
		res.status(200).json({
			status: "success",
			user: req.user,
			account: req.account
		});
		//return next();
	});

	router.get('/fail', function(req, res, next) {
		debug('fail');
		res.status(401).send('Failed!');
		//return next();
	});

	// ===================================
	// Append strategies:
	// ===================================
	router.use(require('./local')(app));
	router.use(require('./vk')(app));

	return router;
}

exports = module.exports = main;

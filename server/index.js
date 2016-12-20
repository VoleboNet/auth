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

require('dotenv').config({silent: true});

const url             = require('url');
const debug           = require('debug')('volebo:www-auth:server');
const vbexpress       = require('@volebo/volebo-express');

debug('init');

let options = vbexpress.Config.readYaml(path.join(__dirname, 'config.yml'));
let app = vbexpress(options);

app.hbs.layoutsDir  = path.join(__dirname, 'views', 'layouts');
app.hbs.partialsDir = path.join(__dirname, 'views', 'partials');
app.set('views', path.join(__dirname, 'views'));

// Required for generating callback url for 3d side services
// ADVICE 1 : http://stackoverflow.com/a/10185427/1115187
// ADVICE 2 : http://stackoverflow.com/a/15922426/1115187
// TODO : need to refactor, it is not a clean solution:
app.getRootUrl = function() {

	return url.format({
		protocol: 'http',
		hostname: '127.0.0.1',
		port: app.config.server.port,
		pathname: '/'
	})

/*
	return url.format({
		protocol: req.protocol,
		host: req.get('host'),
		pathname: req.originalUrl
	})
*/
}

// TODO : it is a way of shit...
var routes = require('./routes/index')(app);
app.lang.use(routes);

exports = module.exports = app;

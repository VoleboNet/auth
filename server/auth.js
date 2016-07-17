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

const debug           = require('debug')('volebonet:auth:server:app');
const vbexpress       = require('@volebonet/volebonet-express');
const _               = require('lodash');

debug('initializing');

let options = require('./config');
var app = vbexpress(options);

// TODO : remove:
_.merge(app.config, options);
debug(app.config);

app.hbs.layoutsDir = 'server/views/layouts/';
app.hbs.partialsDir = 'server/views/partials/';
app.set('views', 'server/views/');


var routes = require('./routes/index');
app.use('/', routes);

app.start();

exports = module.exports = app;

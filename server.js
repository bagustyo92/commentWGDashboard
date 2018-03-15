// server.js

// set up ======================================================================
// get all the tools we need

var fs = require('fs');
var https = require('https');

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');

var configDB = require('./config/database.js');

// configuration ===============================================================

//Mysql
var db = mysql.createConnection(configDB.mysqlConnectionData);

require('./config/passport')(passport, db); // pass passport for configuration

// set up our express application
//app.use(express.logger('dev')); // log every request to the console
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

//handlebars
var myhandlebars = require('express-handlebars');

var handlebars = myhandlebars.create({
		defaultLayout:'',
		helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; },
		ifCond: function(v1, operator, v2, options) {
		  switch (operator) {
			case '==':
				return (v1 == v2) ? options.fn(this) : options.inverse(this);
			case '===':
				return (v1 === v2) ? options.fn(this) : options.inverse(this);
			case '<':
				return (v1 < v2) ? options.fn(this) : options.inverse(this);
			case '<=':
				return (v1 <= v2) ? options.fn(this) : options.inverse(this);
			case '>':
				return (v1 > v2) ? options.fn(this) : options.inverse(this);
			case '>=':
				return (v1 >= v2) ? options.fn(this) : options.inverse(this);
			case '&&':
				return (v1 && v2) ? options.fn(this) : options.inverse(this);
			case '||':
				return (v1 || v2) ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
			}
		},
    }

});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// launch ======================================================================
// app.listen(port);
var options = {
  //  key  : fs.readFileSync('/Users/myyusuf/Documents/Test/myhttps/server.key'),
  //  cert : fs.readFileSync('/Users/myyusuf/Documents/Test/myhttps/server.crt')
	// key  : fs.readFileSync('/apps/ssl/commercial.key'),
	// cert : fs.readFileSync('/apps/ssl/commercial.crt')
	key  : fs.readFileSync('/var/dashboard_ssl/wgdashboard.key'),
	cert : fs.readFileSync('/var/dashboard_ssl/2017/my.crt')
	//cert : fs.readFileSync('/var/dashboard_ssl/www_wgdashboard_com_with_chain.crt')
};
https.createServer(options, app).listen(port, function () {
   console.log('Started with https.');
});
console.log('The magic happens on port ' + port);

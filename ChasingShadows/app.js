var express 				= require('express'),
	logger					= require('morgan'),
	dotenv					= require('dotenv'),
	favicon					= require('serve-favicon'),
	bodyParser				= require('body-parser'),
	app 					= express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));
app.use(favicon('public/img/CSFavicon.png'));
app.use(bodyParser.urlencoded({extended: true}));

var mainTheme;

dotenv.config({path: '.env'});				//	Loads environment variables file

//	ROUTES	//
app.get('/', function(req, res) {
	console.log("CHASING SHADOWS GET")
	mainTheme = true;
	res.render('index', {mainTheme: mainTheme, query: req.query});
});

app.get('/music/', function(req, res) {
	mainTheme = false;
	res.render('index', {mainTheme: mainTheme, query: req.query});
});

app.listen(process.env.PORT, process.env.IP, function() {
	console.log(`Chasing Shadows started on port ${process.env.PORT}`);
});

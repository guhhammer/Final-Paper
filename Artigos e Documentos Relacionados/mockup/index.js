
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();


app.use(express.static(__dirname+'/public'));


router.get('/', function(req, res){

	res.sendFile(path.join(__dirname+'/html/index.html'));

});

router.get('/view', function(req, res){

	res.sendFile(path.join(__dirname+'/html/view.html'));

});

router.get('/search', function(req, res){

	res.sendFile(path.join(__dirname+'/html/search.html'));

});

router.get('/guidelines', function(req, res){

	res.sendFile(path.join(__dirname+'/html/guidelines.html'));

});

router.get('/terms', function(req, res){

	res.sendFile(path.join(__dirname+'/html/terms.html'));

});

router.get('/privacy', function(req, res){

	res.sendFile(path.join(__dirname+'/html/privacy.html'));

});

router.get('/help', function(req, res){

	res.sendFile(path.join(__dirname+'/html/help.html'));

});

router.get('*', function(req, res){

	res.sendFile(path.join(__dirname+'/html/error.html'));

});


app.use('/', router);

app.listen(process.env.port || 3000);





var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var feedRoutes = require('./routes/feedsRoutes.js');
var profileRoutes = require('./routes/profileRoutes.js');
var communityRoutes = require('./routes/communityRoutes.js');
var threadRoutes = require('./routes/threadRoutes.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/user',feedRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/community',communityRoutes);
app.use('/api/thread',threadRoutes);

app.listen(3000,function(){
	console.log("howdy fellas!!!!!");
})
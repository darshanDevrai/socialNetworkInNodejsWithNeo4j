var express = require('express');
var router = express.Router();

var thread = require('../models/thread');

//Create a thread...

router.post('/createThread/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided to create thread"});
	}
	if(!req.body.description){
		return res.json({"status": "error", "message": "description of thread must be provided"});
	}
	if(!req.body.title){
		return res.json({"status": "error", "message": "title of thread must be provided"});
	}

	var username = req.params.username;
	thread.create(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//Delete a thread

router.post('/deleteThread/:username',function(req,res){
	if(!req.body.title){
		return res.json({"status": "error", "message": "title of thread must be provided"});
	}

	var username = req.params.username;
	thread.delete(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});


module.exports = router;
var express = require('express');
var router = express.Router();

var user = require('../models/User');


router.post('/createUser',function(req,res){

	if(!req.body.email ){
		return res.json({"status": "error", "message": "An email address must be provided"});
	}
	if(!req.body.nickname){
		return res.json({"status": "error", "message": "nickname must be provided and should be greater than 3 characters "});
	}
	if(!req.body.fullname){
		return res.json({"status": "error", "message": "fullname must be provided"});
	}
	if(!user.validateEmail(req.body.email)){
		console.log("YES False!!!");
		return res.json({"status": "error", "message": "Invalid email...Please enter valid email address!!!"});
	}

	user.create(req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})

});
/*,
	function(req,res){
		console.log("In create user route!!!");

	user.create(req.body,function(error,result){
		if(error){
			console.log(error);
			res.json(error);
		}
		console.log(result);
		res.json(result);
	})
	}
);*/

router.get('/getUser/:username',function(req,res){

	console.log("In getUser/:username route!!!");
	var username = req.params.username;
	user.getSingleUser(username,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.get('/getFollowers/:username',function(req,res){

	console.log("In getFollowers/:username route!!!");
	var username = req.params.username;
	user.getFollowers(username,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.get('/getFollowing/:username',function(req,res){

	console.log("In getFollowing/:username route!!!");
	var username = req.params.username;
	user.getFollowing(username,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.post('/followUser',function(req,res){

	console.log("In /followUser route!!!");

	user.follow(req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})

});

router.post('/unFollowUser',function(req,res){

	console.log("In /unFollowUser route!!!");

	user.UnFollow(req.body,function(error,result){
		if(error){
			console.log("error from /unFollowUser route And error msg is ---"+error);
			return res.json(error);
		}
		//console.log(result);
		res.json(result);
	})

});

router.post('/editMyProfile/:username',function(req,res){

	var username = req.params.username;

	console.log("In /editMyProfile route!!!");

	user.editMyProfile(username,req.body,function(error,result){
		if(error){
			console.log("error from /editMyProfile route And error msg is ---"+error);
			return res.json(error);
		}
		//console.log(result);
		res.json(result);
	})

});




module.exports = router;


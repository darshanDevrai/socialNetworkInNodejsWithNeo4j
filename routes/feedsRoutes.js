var express = require('express');
var router = express.Router();

var post = require('../models/posts');

var ghost = require('../models/testingg');

router.post('/createPost/:username',function(req,res,next){

	if(!req.body.body ){
		return res.json({"status": "error", "message": "Body of post must be provided"});
	}
	if(!req.body.privacy){
		return res.json({"status": "error", "message": "Privacy of post must be provided"});
	}
	var username = req.params.username;
	post.create(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});


// for now send post body to match the post from db but in production use uuid of post 
//-----TODO::::Change Post.editMyPost method from post model
router.post('/editPost/:username',function(req,res){
	var username = req.params.username;
	post.editMyPost(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
		res.end();
	})
});

router.get('/myNetwork/:username',function(req,res,next){
	console.log("in myNetwork!!!!");
	var username = req.params.username;
	post.myNetwork(username,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);

	})

	//next();
});

router.get('/trending',function(req,res){
	console.log("in trending!!!");

	post.trending(function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
		res.end();
	})
});

/*
router.get('/recent',function(req,res,next){
	console.log("in recent!!!");

	post.recent(function(error,result){
		if(error){
			return console.log(error);
		}
		console.log(result);
		res.json(result);
	})
});*/

router.get('/myWall/:username',function(req,res,next){
	console.log("in myWall!!!");
	var username = req.params.username;

	post.myWall(username,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.post('/deletePost/:username',function(req,res,next){
	console.log("in deletePost!!!");
	var username = req.params.username;

	post.deletMyPost(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.post('/likePost/:username',function(req,res,next){
	console.log("in likePost!!!");
	var username = req.params.username;

	post.likePost(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});


router.post('/unlikePost/:username',function(req,res,next){
	console.log("in unlikePost!!!");
	var username = req.params.username;

	post.unlikePost(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.post('/writeComment/:username',function(req,res,next){


	if(!req.body.commentBody ){
		return res.json({"status": "error", "message": "commentBody must be provided"});
	}
	if(!req.body.postBody){
		return res.json({"status": "error", "message": "postBody of post must be provided"});
	}

	console.log("in writeComment!!!");
	var username = req.params.username;

	post.writeComment(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

router.post('/deleteComment/:username',function(req,res,next){


	if(!req.body.commentBody ){
		return res.json({"status": "error", "message": "commentBody must be provided"});
	}
	if(!req.body.postBody){
		return res.json({"status": "error", "message": "postBody of post must be provided"});
	}

	console.log("in deleteComment!!!");
	var username = req.params.username;

	post.deleteMyComment(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});


router.get('/ghost/trending',function(req,res){
	console.log("in/ghost/trending!!");

	ghost.trending(function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
		res.end();
	})
});

module.exports = router;
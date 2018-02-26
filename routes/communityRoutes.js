var express = require('express');
var router = express.Router();

var community = require('../models/community');

//Create Community

router.post('/createCommunity/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided"});
	}
	if(!req.body.description){
		return res.json({"status": "error", "message": "description of community must be provided"});
	}
	if(!req.body.Tags){
		return res.json({"status": "error", "message": "Tags of community must be provided"});
	}

	var username = req.params.username;
	community.create(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//Delete Community
router.post('/deleteCommunity/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided"});
	}

	var username = req.params.username;
	community.delete(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//Find community i.e. Search
router.get('/searchCommunity/:searchTag',function(req,res){
	

	var searchTag = req.params.searchTag;
	community.search(searchTag,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//Edit Community Description

router.post('/editCommunity/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided"});
	}
	if(!req.body.newCommunityDesc ){
		return res.json({"status": "error", "message": "newCommunityDesc must be provided"});
	}

	var username = req.params.username;
	community.editDescription(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//become a member of community

router.post('/beMemberOfCommunity/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided"});
	}
	
	var username = req.params.username;
	community.beMemberOfCommunity(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//cancle membership of community

router.post('/cancleMembershipOfCommunity/:username',function(req,res){
	if(!req.body.nameOfCommunity ){
		return res.json({"status": "error", "message": "nameOfCommunity must be provided"});
	}
	
	var username = req.params.username;
	community.cancleMembershipOfCommunity(username,req.body,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});

//Get a single community 
router.get('/getCommunity/:commName',function(req,res){

	var commName = req.params.commName;
	community.getCommunity(commName,function(error,result){
		if(error){
			console.log(error);
			return res.json(error);
		}
		console.log(result);
		res.json(result);
	})
});



module.exports = router;
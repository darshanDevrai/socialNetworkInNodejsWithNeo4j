var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j","darshan"));



function Thread(){

}

var threadObject = function(titleOfThread,description,noOfReplies,ThrdCreator,community){
	
	
	this.ThrTitle = titleOfThread;
	this.description = description;
	this.noOfReplies = noOfReplies;
	this.ThrdCreator = ThrdCreator;
	this.community = community;

}


Thread.create = function(username,thrBody,callback){
	
	var userName = username;
	var communityName = thrBody.nameOfCommunity;

	var thrObj = {
		//id : uuid.v4();
		//nameOfCommunity : thrBody.nameOfCommunity;
		title : thrBody.title,
		description : thrBody.description,
		//threadType : thrBody.threadType,
		//thrMediaAttachment : thrBody.thrMediaAttachment,
		noOfReplies : 0
	}

	//Do validation
	//use uuids for both nodes and relationships

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}})<-[r:HasMember]-(cm:Community {nameOfCommunity:{commuName}}) CREATE (u)<-[:ThrdCreator]-(thr:Thread {params})-[:belongsToCommu]->(cm) WITH u,cm,thr SET cm.noOfThreads = cm.noOfThreads + 1  RETURN thr.title as Thrtitle, thr.description as thrDescription,thr.noOfReplies as noOfReplies,u.nickname as ThrdCreator,cm.nameOfCommunity as communityName",
	 {params:thrObj,nName:userName,commuName:communityName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username,communityName and thread data  to Create a Thread!!!";
			return callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new threadObject(records.get("Thrtitle"),
    	   	     	records.get("thrDescription"),records.get("noOfReplies"),
    	        	records.get("ThrdCreator"),records.get("communityName"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Thread.create function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});

}

Thread.delete = function(username,thrBody,callback){
	//Delete Thread after validating that the user
	//who wants to delete the Thread is the author of that
	//Thread

	var userName = username;
	var thrdTitle = thrBody.title;

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}})<-[:ThrdCreator]-(thr:Thread {title:{thTitle}})-[:belongsToCommu]->(cm) DETACH DELETE thr WITH u,cm SET cm.noOfThreads = cm.noOfThreads - 1  RETURN cm.noOfThreads as threads",
	 {thTitle:thrdTitle,nName:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like usernameand thread title to Delete a Thread!!!";
			return callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  records.get("threads");
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Thread.delete function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});

}

//Community.search = function(tags){
	//advanced search by using tags and geolocation
//}

//Threads with some replies

Thread.getThread = function(thrId,callback){
	var thrId = thrId;

	//MAtch the community and show the community

}

module.exports = Thread;
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j","darshan"));



function Community(){

}

var communityObject = function(nameOfCommunity,description,Tags,coverPic,geolocation,noOfThreads,noOfMembers,CommCreator){
	
	
	this.nameOfCommunity = nameOfCommunity;
	this.description = description;
	this.Tags = Tags;
	this.coverPic = coverPic;
	this.geolocation = geolocation;
	this.noOfThreads = noOfThreads;
	this.noOfMembers = noOfMembers;
	this.CommCreator = CommCreator;
}

Community.create = function(username,comBody,callback){
	
	var userName = username;

	var comObj = {
		//id : uuid.v4();
		nameOfCommunity : comBody.nameOfCommunity,
		description : comBody.description,
		Tags : comBody.Tags,
		coverPic : "http://placehold.it/32x32",
		geolocation : comBody.geolocation,
		noOfThreads : 0,
		noOfMembers : 1
	}

	//Do validation
	//use uuids for both nodes and relationships

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}) WITH u CREATE (u)<-[r:CommCreator]-(cm:Community {params})-[:HasMember]->(u) RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMembers,u.nickname as CommCreator", {params:comObj,nName:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username and community data  to Create a communituy!!!";
			callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMembers"),records.get("CommCreator"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.create function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});

	//Neo4j Create a pattern like (u)-[:CreatedCom]->(c)

}

Community.delete = function(username,comBody,callback){
	//Delete community after validating that the user
	//who wants to delete the communituy is the admin of that
	//community

	var userName = username;
	var nameOfCommunity = comBody.nameOfCommunity;

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}) WITH u MATCH (u)<-[r:CommCreator]-(cm:Community {nameOfCommunity:{params}})-[:HasMember]->(u) DETACH DELETE cm RETURN u.nickname as nickname", {params:nameOfCommunity,nName:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username and nameOfCommunity to Delete a communituy!!!";
			callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
            return  records.get("nickname");
       		 });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.create function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});



}

Community.search = function(tags,callback){
	//advanced search by using tags and geolocation

	var tags = tags;
	

	var session = driver.session();

	session
	.run("MATCH (cm:Community)-[:CommCreator]->(u:User) WHERE ANY (x IN cm.Tags WHERE x CONTAINS {ttt}) RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMembers,u.nickname as CommCreator",{ttt:tags})
	.then(function( results ){

		console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like nameOfCommunity or tags of communities to Find a communituy!!!";
			callback(errorMsg);
		}else{
		
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMembers"),records.get("CommCreator"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.search function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});
}

Community.getCommunity = function(commName,callback){
	var nameOfCommunity = commName;

	console.log(nameOfCommunity);

	//MAtch the community and show the community
	var session = driver.session();

	session
	.run("MATCH (cm:Community {nameOfCommunity:{comName}})-[:CommCreator]->(u:User) RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMembers,u.nickname as CommCreator",
		{comName:nameOfCommunity})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like nameOfCommunity to get a communituy!!!";
			callback(errorMsg);
		}else{
		
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMembers"),records.get("CommCreator"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.getCommunity function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});

}

Community.editDescription = function(username,comBody,callback){

	var userName = username;
	var nameOfCommunity = comBody.nameOfCommunity;
	var newCommunityDesc = comBody.newCommunityDesc;


	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}) WITH u MATCH (u)<-[r:CommCreator]-(cm:Community {nameOfCommunity:{params}})-[:HasMember]->(u) SET cm.description = {newDescription} RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMembers,u.nickname as CommCreator",
	 {params:nameOfCommunity,nName:userName,newDescription:newCommunityDesc})
	.then(function( results ){

		if(!results.records[0]){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username,nameOfCommunity or newCommunityDescription to edit a communituy Description!!!";
			callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMembers"),records.get("CommCreator"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.editDescription function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});


}

//Be a member of community

Community.beMemberOfCommunity = function(username,comBody,callback){

	var userName = username;
	var nameOfCommunity = comBody.nameOfCommunity;



	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}),(cm:Community {nameOfCommunity:{params}}) WHERE NOT (cm)-[:HasMember]->(u) WITH u,cm CREATE (cm)-[:HasMember]->(u) WITH u,cm SET cm.noOfMembers = cm.noOfMembers + 1 RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMemberssss",
	 {params:nameOfCommunity,nName:userName})
	.then(function( results ){

		if(!results.records[0]){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username,nameOfCommunity to be a member of community!!!";
			return callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMemberssss"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.beMemberOfCommunity function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});


}



//Cancle membership from community

Community.cancleMembershipOfCommunity = function(username,comBody,callback){

	var userName = username;
	var nameOfCommunity = comBody.nameOfCommunity;

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}})<-[r:HasMember]-(cm:Community {nameOfCommunity:{params}}) DELETE r WITH cm SET cm.noOfMembers = cm.noOfMembers - 1 RETURN cm.nameOfCommunity as nameOfCommunity,cm.description as description,cm.Tags as Tags,cm.coverPic as coverPic,cm.geolocation as geolocation,cm.noOfThreads as noOfThreads,cm.noOfMembers as noOfMemberssss",
	 {params:nameOfCommunity,nName:userName})
	.then(function( results ){

		if(!results.records[0]){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username,nameOfCommunity to cancle Membership Of Community!!!";
			return callback(errorMsg);
		}else{
			
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
    	        return  new communityObject(records.get("nameOfCommunity"),
    	   	     	records.get("description"),records.get("Tags"),
    	        	records.get("coverPic"),records.get("geolocation"),records.get("noOfThreads"),
    	        	records.get("noOfMemberssss"));
            
            
    	    });

			session.close();
			driver.close();
			callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Community.cancleMembershipOfCommunity function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});


}





module.exports = Community;
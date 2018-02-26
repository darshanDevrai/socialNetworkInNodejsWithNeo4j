
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j","darshan"));



function User(){}

var userObj = function(fullname,nickname,registeredAt,email,picture,noOfFollowwers,noOfFollowing,noOfPosts){
	this.Fullname = fullname;
	this.Nickname =	nickname;
	this.registeredAt = registeredAt;
	this.email = email;
	this.picture = picture;
	this.Followwers = noOfFollowwers;
	this.Following = noOfFollowing;
	this.NoOfPosts = noOfPosts;
}

 User.validateEmail = function(email){

	console.log("In validate email...");

	var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

	return re.test(email);
}


function checkNicknameTaken(nickname){
	return new Promise(function(resolve,reject){

	//Decide if you want to use all nicknames to be uppercase or lowercase like 
	//Steam does or use as it is with neo4j

	console.log("In checkNicknameTaken function!!!");

	var Tnickname = nickname;

	console.log("Nickname is "+Tnickname+"!!!");

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}) RETURN u.nickname as userNickname",{nName:Tnickname})
	.then(function( results ){
		if(results.records[0] == undefined){

			console.log("In results.records loop of checkNicknameTaken...");
			session.close();
		 	driver.close();
			//return callback(null,false);
			resolve(true);
		}else{

			console.log("In Else loop<<<<<<<<");

			session.close();
			driver.close();
			//return callback(null,true);
			var errorTxt = "Username already taken...";
			reject(errorTxt);
		}
	})
	.catch(function(error){
		console.log("Error From checkNicknameTaken And error is "+ error+"... This is the end...");
	})
})	
}

//Create User

User.create = function(userBody,callback){

	console.log("In user.create function!!!");
	console.log(userBody.nickname);

	checkNicknameTaken(userBody.nickname)
	.then(function(response){
			console.log("In user.create function after validation!!!");
	
		var userO = {
			Fullname : userBody.fullname,
			nickname : userBody.nickname,
			registered : new Date().toISOString(),
			//ThumbnailUrl :
			//CoverPicUrl :
			//uuid : uuid.v4();
			picture	: "http://placehold.it/32x32",
			email :userBody.email,
			followers : 0,
			following : 0,
			noOfPosts : 0,
			//noOfCommunities: 0;
		}

		var session = driver.session();
		session
		.run("CREATE (u:User {params}) RETURN u.Fullname as Fullname,u.nickname as nickname,u.registered as registeredAt,u.email as email,u.picture as picture,u.followers as followers,u.following as following,u.noOfPosts as noOfPosts",{params:userO})
		.then(function( results ){
		
			console.log("In session.then!!!");
			var userDate = [];
				userDate = results.records.map(function (records) {
    		        return  new userObj(records.get("Fullname"),
    		        	records.get("nickname"),records.get("registeredAt"),
    		        	records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
    		    });

			session.close();
			driver.close();
			callback(null,userDate);

		})
		.catch(function(error){
			console.log("Error from User.create... Error is --"+error+" ...The end!!!");
			session.close();
			driver.close();
		});
	})
	.catch(function(error){
		console.log("Error from dont know what to say and error is "+error+"..This is the end!!!");
		callback(error);
	})
}


User.getSingleUser = function(username,callback){
	
	console.log("In User.getSingleUser function!!!");

	var username = username;

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{params}}) RETURN u.Fullname as Fullname,u.nickname as nickname,u.registered as registeredAt,u.email as email,u.picture as picture,u.followers as followers,u.following as following,u.noOfPosts as noOfPosts",{params:username})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName to get a single users information!!!";
			callback(errorMsg);
		}else{

			var userDate = [];
			userDate = results.records.map(function (records) {
            	return  new userObj(records.get("Fullname"),
            		records.get("nickname"),records.get("registeredAt"),
           			records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
           
       		});

			session.close();
			driver.close();
			callback(null,userDate);
		}
	})
	.catch(function(error){
		console.log("Error from User.getSingleUser... Error is --"+error+" ...The end!!!");
	})

	//Neo4j Match single node----
}

User.getFollowers = function(username,callback){

	console.log("In User.getFollowers function!!!");
	var session = driver.session();

 	var userName = username;

	session
	.run("MATCH (me:User {nickname:{params}})<-[:follows]-(u:User) RETURN u.Fullname as Fullname,u.nickname as nickname,u.registered as registeredAt,u.email as email,u.picture as picture,u.followers as followers,u.following as following,u.noOfPosts as noOfPosts",{params:username})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop..." );
			session.close();
			driver.close();
			var errorMsg = "Dude plz enter correct userName to get followers!!!";
			callback(errorMsg);
		}else{

			var userDate = [];
				userDate = results.records.map(function (records) {
            		return  new userObj(records.get("Fullname"),
            			records.get("nickname"),records.get("registeredAt"),
            			records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
        	});

			session.close();
			driver.close();
			callback(null,userDate);
		}	
	}) 
	.catch(function(error){
		console.log("Error from User.getFollowers... Error is --"+error+" ...The end!!!");
		session.close();
		driver.close();
	})
	//Neo4j 
}

User.follow = function(reqBody,callback){
	console.log("In User.follow function!!!");
	
	var session = driver.session();

	var userName = reqBody.username;
	var otherUsername = reqBody.otherUsername;

//&&%%&%&%&%&%   IMP note:::: Make sure to check the relationship is already exist or not...Or add constraints...%%%%%%%%%%%%%%%
	session
	.run("MATCH (u1:User{nickname:{ownName}}),(u2:User {nickname:{otherName}}) WITH u1,u2 CREATE (u1)-[:follows]->(u2) WITH u1,u2 SET u1.following = u1.following +1,u2.followers = u2.followers + 1 RETURN u1.Fullname as Fullname,u1.nickname as nickname,u1.registered as registeredAt,u1.email as email,u1.picture as picture,u1.followers as followers,u1.following as following,u1.noOfPosts as noOfPosts",{ownName:userName,otherName:otherUsername})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop..." );
			session.close();
			driver.close();
			var errorMsg = "Dude plz enter correct userName and otherPersons username to follow!!!";
			callback(errorMsg);
		}else{

			var userDate = [];
			userDate = results.records.map(function (records) {
            	return  new userObj(records.get("Fullname"),
            		records.get("nickname"),records.get("registeredAt"),
            		records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
        	});

			session.close();
			driver.close();
			callback(null,userDate);
		}	
	})
	.catch(function(error){
		console.log("Error from User.follow... Error is --"+error+" ...The end!!!");
		session.close();
		driver.close();
	})
	//Neo4j
}

User.UnFollow = function(reqBody,callback){
	
	console.log("In User.UnFollow function!!!");

	var session = driver.session();

	

	var userName = reqBody.username;
	var otherUsername = reqBody.otherUsername;

	session
	.run("MATCH (u1:User{nickname:{ownName}})-[r:follows]->(u2:User {nickname:{otherName}}) WITH u1,u2,r DELETE r SET u1.following = u1.following - 1,u2.followers = u2.followers - 1 RETURN u1.Fullname as Fullname,u1.nickname as nickname,u1.registered as registeredAt,u1.email as email,u1.picture as picture,u1.followers as followers,u1.following as following,u1.noOfPosts as noOfPosts",{ownName:userName,otherName:otherUsername})
	.then(function( results ){
		var userDate = [];

		//console.log("&&&&&&&&&&&&results.records is " + results.records[0]);
		console.log( "&&&&&&&&result records "+ results.records[0] );
		//console.log("Size of arrray is "+results.records.lenght);
		if(results.records[0] == undefined){

			console.log("In results.records.lenght if loop..." );
			session.close();
			driver.close();
			var errorMsg = "No such relationship exist...So dude you cant delete such relationship!!!";
			callback(errorMsg);
		}else{
			//console.log(results);
			userDate = results.records.map(function (records) {
            	return  new userObj(records.get("Fullname"),
            		records.get("nickname"),records.get("registeredAt"),
            		records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
			});

		session.close();
		driver.close();
		callback(null,userDate);
		}

		
	})
	.catch(function(error){
		console.log("Error from User.UnFollow... Error is --"+error+" ...The end!!!");
		session.close();
		driver.close();
	})

	//Neo4j
}

User.getFollowing = function(username,callback){
	var userName = username;

	console.log("In User.getFollowing function!!!");
	var session = driver.session();

	var userName = username;

	session
	.run("MATCH (me:User {nickname:{params}})-[:follows]->(u:User) RETURN u.Fullname as Fullname,u.nickname as nickname,u.registered as registeredAt,u.email as email,u.picture as picture,u.followers as followers,u.following as following,u.noOfPosts as noOfPosts",{params:username})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop..." );
			session.close();
			driver.close();
			var errorMsg = "Dude plz enter correct userName to get following!!!";
			callback(errorMsg);
		}else{

			var userDate = [];
			userDate = results.records.map(function (records) {
            	return  new userObj(records.get("Fullname"),
            		records.get("nickname"),records.get("registeredAt"),
            		records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
        	});

			session.close();
			driver.close();
			callback(null,userDate);
		}	
	})
	.catch(function(error){
		console.log("Error from User.getFollowing...Error is --"+ error +" ...The end!!!");
		session.close();
		driver.close();
	})
	//Neo4j
}

User.getUserBio = function(username,callback){
	var userName = username;
	//Neo4j
}

User.editMyProfile = function(username,reqBody,callback){
	console.log("In User.editMyProfile function!!!");
	var session = driver.session();

	var userName = username;

	var editKeys = reqBody.editKeys;

	console.log(editKeys);

	session
	.run("MATCH (me:User {nickname:{uName}}) WITH me SET me += {params} RETURN me.Fullname as Fullname,me.nickname as nickname,me.registered as registeredAt,me.email as email,me.picture as picture,me.followers as followers,me.following as following,me.noOfPosts as noOfPosts",{uName:username,params:editKeys})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop..." );
			session.close();
			driver.close();
			var errorMsg = "Dude plz enter correct userName to edit the profile!!!";
			callback(errorMsg);
		}else{

			var userDate = [];
			userDate = results.records.map(function (records) {
            	return  new userObj(records.get("Fullname"),
            		records.get("nickname"),records.get("registeredAt"),
            		records.get("email"),records.get("picture"),records.get("followers"),records.get("following"),records.get("noOfPosts"));
            
            
        	});

			session.close();
			driver.close();
			callback(null,userDate);
		}	
	})
	.catch(function(error){
		console.log("Error from User.editMyProfile...Error is --"+ error +" ...The end!!!");
		session.close();
		driver.close();
	})
}

module.exports = User;

/*
.run()
	.then(function( results ){

	})
	.catch(function(error){
		console.log();
	})
*/
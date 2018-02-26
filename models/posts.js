var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j","darshan"));






function Post(){}


var postObject = function(author,authorPic,pBody,oriAuthor,comments,likes){
	
	//postId,dateCreated,privacy,mediaAttachment,,noOfLikes,noOfComments

	//this.PostId = postId;
	this.author = author;
	this.originalAuthor = oriAuthor;
	this.authoPic = authorPic;
	//this.dateCreated = dateCreated;
	//this.Privacy = privacy;
	this.PostBody = pBody;
	//this.mediaAttachment = mediaAttachment;
	this.noOfLike = comments;
	this.noOfComments = likes;
}

var postObject1 = function(author,authorPic,pBody,comments,likes){
	
	//postId,dateCreated,privacy,mediaAttachment,,noOfLikes,noOfComments

	//this.PostId = postId;
	this.author = author;
	//this.originalAuthor = oriAuthor;
	this.authoPic = authorPic;
	//this.dateCreated = dateCreated;
	//this.Privacy = privacy;
	this.PostBody = pBody;
	//this.mediaAttachment = mediaAttachment;
	this.noOfLike = comments;
	this.noOfComments = likes;
}

//postObject.prototype.addCommentsToPosts = function(comments[]){
	//this.comments = [];
//}


Post.create = function(username,postBody,callback){

//get username of the author in the postBody
//parameter itself OR other option is to take 
// another parameter named username
	var userName = username;
	var postObj = {
		//postedAt : new Date().toString(),
		//put this above posted at property 
		//in the relationship of the User-[:Posted]->post

		body : postBody.body,
		privacy : postBody.privacy,
		//postType : (text/vdo/image);
		//mediaAttachment : url of media depending on type of the post
		noOfLikes : 0,
		noOfComments : 0
	}

	
	

	
	console.log(postObj);

	var session = driver.session();

	session
	.run("MATCH (u:User {nickname:{nName}}) WITH u SET u.noOfPosts = u.noOfPosts + 1 WITH u CREATE (u)-[r:wrote]->(p:Post{params}) RETURN u.nickname as author, u.picture as authorPic,p.body as poy,p.noOfComments as comments,p.noOfLikes as Likes", {params:postObj,nName:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct inputs like username and postdata to Create a post!!!";
			callback(errorMsg);
		}else{
		console.log("RESULT IS ----"+results);
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  new postObject1(records.get("author"),
            	records.get("authorPic"),records.get("poy"),
            	records.get("comments"),records.get("Likes"));
            
            
        });

		session.close();
		driver.close();
		callback(null,postFeeds);

		}

	})
	.catch(function(error){
		console.log("Error from neo4j driver from Post.create function...Error is "+error+"...The end!!! ");
		session.close();
		driver.close();
	});

	//Do validation
	//use uuids for both nodes and relationships

	//Neo4j Create a pattern like (u)-[:Posted]->(p)

}


Post.editMyPost = function(username,postBody,callback){

	var session = driver.session();

	var userName = username;

	var oldPostBody = postBody.oldPostBody;

	
	var newPostBody = postBody.newPostBody;

	//console.log(postID+"/n"+newPostBody);
//  %&%&%&%&%&&%&%&%&%&%&%&%&%&%&%&%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&%%%%%%%%%%%%%%%%%%%%%%%%
// TODO == for now only body of post is editable make all params editable...
//http://stackoverflow.com/questions/39423176/catch-error-structure-127-object-object-on-neo4j-cypher-session  for uuid and index plus constrints

	session
	.run("MATCH (p:Post)<-[:wrote]-(u:User {nickname:{nName}}) WHERE p.body = {pidd} SET p.body = {newBody} RETURN u.nickname as author, u.picture as authorPic,p.body as poy,p.noOfComments as comments,p.noOfLikes as Likes",{pidd: oldPostBody,newBody:newPostBody,nName:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName to edit your post!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  new postObject1(records.get("author"),
            	records.get("authorPic"),records.get("poy"),
            	records.get("comments"),records.get("Likes"));
            
            
        });


		session.close();
		driver.close();
		callback(null,postFeeds);
	}
		
	})
	.catch(function(error){
		console.log("Error from Post.editMyPost...Error is --"+error+" ...The end!!!");
	})

}


Post.myNetwork = function(username,callback){
	//var userName = username;

	var session = driver.session();

	var paramObj = {unickname : username};

	console.log("in post.mynetwork!!!");
	console.log(paramObj);

	session
	.run( "MATCH (me:User{nickname:{unickname}})-[:follows]->(other:User)-[:wrote]->(p:Post) RETURN other.nickname as author,null as originalAuthor,other.picture as authorPic,p.body as postBody,p.noOfComments as comments,p.noOfLikes as Likes UNION MATCH (me:User{nickname:{unickname}})-[:follows]->(other:User)-[:Rewrote]->(p:Post) <-[:wrote]-(pop:User) RETURN other.nickname as author,pop.nickname as originalAuthor,other.picture as authorPic,p.body as postBody,p.noOfComments as comments,p.noOfLikes as Likes", paramObj,console.log(username))
	.then( function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName to get the post of users u follow i.e. myNetwork!!!";
			callback(errorMsg);
		}else{
	
			var postFeeds = [];
			postFeeds = results.records.map(function (records) {
       		     return  new postObject(records.get("author"),
        	    	records.get("authorPic"),records.get("postBody"),records.get("originalAuthor"),
         		   	records.get("comments").toNumber(),records.get("Likes").toNumber());
            
            
       		 });
	
	session.close();
	driver.close();
	callback(null,postFeeds);
		}
	})
	.catch(function(error){
		console.log("OHHHH Error has occured "+error+ " This is the end!!!");
		session.close();
		driver.close();
	})
	;

}



Post.trending = function(callback){

	var session = driver.session();

	session
	.run("MATCH(p:Post {privacy:'public'})<-[:wrote]-(u:User) RETURN u.nickname as author,u.picture as authorPic,p.body as postBody,p.noOfComments as comments,p.noOfLikes as Likes ORDER BY p.noOfLikes")
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude something went wrong while getting trending!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  new postObject1(records.get("author"),
            	records.get("authorPic"),records.get("postBody"),
            	records.get("comments").low,records.get("Likes").low);
            
            
        });
	
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.Trending "+error+" This is the end!!!");
		session.close();
		driver.close();
	})

}


Post.recent = function(callback){

	//Neo4j
	//During returning data use -
	//var result = [];
	// new postObject(all params);

}

Post.myWall = function(username,callback){

	var session = driver.session();

	var userName = username;

	session
	.run("MATCH (u:User {nickname:{unickname}})-[:wrote]->(p:Post) RETURN u.nickname as author,u.picture as authorPic,p.body as postBody,p.noOfComments as comments,p.noOfLikes as Likes ORDER BY p.noOfLikes",{unickname:userName})
	.then(function( results ){

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName to get your wall!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  new postObject1(records.get("author"),
            	records.get("authorPic"),records.get("postBody"),
            	records.get("comments").toNumber(),records.get("Likes").toNumber());
            
            
        });
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.myWall "+error+" This is the end!!!");
		session.close();
		driver.close();
	})

}

/*Post.editMyPost = function(postId,newPostParams,callback){

	//Neo4j
	//edit post node.
}*/

Post.deletMyPost = function(username,postBody,callback){
	//Neo4j
	//Delete post node
	//before deleting the post validate that user who is 
	//trying to delete the post is author of that post.
	var session = driver.session();

	var userName = username;
	var postbody = postBody.body;

	session
	.run("MATCH (u:User {nickname:{unickname}})-[r:wrote]->(p:Post) WHERE p.body = {pBody} WITH u,r,p SET u.noOfPosts = u.noOfPosts - 1 WITH u,r,p DETACH DELETE p RETURN u.nickname as author",{unickname:userName,pBody:postbody})
	.then(function( results ){

		//console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName or postBody to delete your post!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  records.get("author");
        });
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.DELETE "+error+" This is the end!!!");
		session.close();
		driver.close();
	})


}


////Write a function to like a post 

Post.likePost = function(username,postBody,callback){
	
	var session = driver.session();

	var userName = username;
	var postbody = postBody.body;

	session
	.run("MATCH (u:User {nickname:{unickname}}),(p:Post) WHERE p.body = {pBody} WITH u,p WHERE NOT (u)-[:Likes]->(p) CREATE (u)-[r:Likes]->(p) WITH u,p,r SET p.noOfLikes = p.noOfLikes + 1 RETURN r as likess",{unickname:userName,pBody:postbody})
	.then(function( results ){

		//console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName or postBody to like a post!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  records.get("likess");
        });
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.likePost "+error+" This is the end!!!");
		session.close();
		driver.close();
	})


}


Post.unlikePost = function(username,postBody,callback){
	
	var session = driver.session();

	var userName = username;
	var postbody = postBody.body;

	session
	.run("MATCH (u:User {nickname:{unickname}})-[r:Likes]->(p:Post) WHERE p.body = {pBody} WITH u,p,r DELETE r WITH u,p SET p.noOfLikes = p.noOfLikes - 1 RETURN p.noOfLikes as likess",{unickname:userName,pBody:postbody})
	.then(function( results ){

		//console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName or postBody to unlike a post!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return  records.get("likess");
        });
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.unlikePost "+error+" This is the end!!!");
		session.close();
		driver.close();
	})


}

//Write a comment.

var commentObject = function(commentBody,dateCreated){
	
	//postId,dateCreated,privacy,mediaAttachment,,noOfLikes,noOfComments

	//this.PostId = postId;
	//this.author = author;
	//this.originalAuthor = oriAuthor;
	//this.authoPic = authorPic;
	//this.dateCreated = dateCreated;
	//this.Privacy = privacy;
	//this.PostBody = pBody;
	//this.mediaAttachment = mediaAttachment;
	//this.noOfLike = comments;
	//this.noOfComments = likes;

	this.commentBody = commentBody;
	this.dateCreated = dateCreated;
}

Post.writeComment = function(username,cmntBody,callback){
	
	var session = driver.session();

	var userName = username; 

	var postbody = cmntBody.postBody;
	var commObj = {

		commentBody : cmntBody.commentBody,
		dateCreated : new Date().toISOString()
	}

	session
	.run("MATCH (u:User {nickname:{unickname}}),(p:Post) WHERE p.body = {pBody} WITH u,p CREATE (u)-[:WroteComment]->(c:Comment{params})-[:CommentOn]->(p) WITH u,c,p SET p.noOfComments = p.noOfComments + 1 RETURN c.commentBody as commentBody,c.dateCreated as dateCreated",{unickname:userName,pBody:postbody,params:commObj})
	.then(function( results ){

		//console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName or postBody or commentBody to write a comment!!!";
			callback(errorMsg);
			return;

		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return new commentObject(records.get("commentBody"),records.get("dateCreated"));
        });
		session.close();
		driver.close();
		callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.writeComment "+error+" This is the end!!!");
		session.close();
		driver.close();
	})


}


Post.deleteMyComment = function(username,cmntBody,callback){
	
	var session = driver.session();

	var userName = username; 

	var postbody = cmntBody.postBody;

	var	commObj = cmntBody.commentBody;
		

	session
	.run("MATCH (u:User {nickname:{unickname}})-[:WroteComment]->(c:Comment{commentBody:{params}})-[:CommentOn]->(p {body:{pBody}}) WITH u,c,p DETACH DELETE c WITH p SET p.noOfComments = p.noOfComments - 1 RETURN p.noOfComments as nos",{unickname:userName,pBody:postbody,params:commObj})
	.then(function( results ){

		//console.log(results);

		if(results.records[0] == undefined){

			console.log("In results.records loop...");
			session.close();
		 	driver.close();
			var errorMsg = "Dude plz enter correct userName or postBody or commentBody to delete your comment!!!";
			callback(errorMsg);
		}else{
		var postFeeds = [];
		postFeeds = results.records.map(function (records) {
            return records.get("nos");
        });
	session.close();
	driver.close();
	callback(null,postFeeds);
		}	
	})
	.catch(function(error){
		console.log(" Error from post.DeleteMyComment "+error+" This is the end!!!");
		session.close();
		driver.close();
	})


}



module.exports = Post;
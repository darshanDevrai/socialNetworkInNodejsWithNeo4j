
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j","darshan"));






function Ghost(){}


var postObject = function(author,authorPic,pBody,comments,likes,comms){
	
	//postId,dateCreated,privacy,mediaAttachment,,noOfLikes,noOfComments

	//this.PostId = postId;
	this.author = author;
	//this.originalAuthor = oriAuthor;
	this.authoPic = authorPic;
	//this.dateCreated = dateCreated;
	//this.Privacy = privacy;
	this.PostBody = pBody;
	//this.mediaAttachment = mediaAttachment;
	this.noOfLike = likes;
	this.noOfComments = comments;
	this.comments = comms;
}



Ghost.trending = function(callback){

	var session = driver.session();

	session
	.run("MATCH(p:Post {privacy:'public'})<-[:wrote]-(u:User) WITH p,u OPTIONAL MATCH (ca:User)-[:WroteComment]->(c:Comment)-[:CommentOn]->(p) RETURN collect({commentBody:c.commentBody,dateCreated:c.dateCreated,commentBy:ca.nickname})[..2] as comms,u.nickname as author,u.picture as authorPic,p.body as postBody,p.noOfComments as comments,p.noOfLikes as Likes ORDER BY p.noOfLikes DESC")
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
            return  new postObject(records.get("author"),
            	records.get("authorPic"),records.get("postBody"),
            	records.get("comments"),records.get("Likes"),records.get("comms"));
            
            
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

module.exports = Ghost;
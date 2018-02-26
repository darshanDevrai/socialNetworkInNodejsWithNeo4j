function Reply(){

}


Reply.create = function(username,rplyBody,callback){
	
	var username = username;
	var  threadtitle = rplyBody.threadtitle;
	//Use THIS threadTitle or ThreadId to Match
	//the Thread node.

	var rplyObj = {
		id : uuid.v4();
		body : rplyBody.body;
		replyType : rplyBody.replyType;
		rplyMediaAttachment : rplyBody.rplyMediaAttachment;
	}

	//Do validation
	//use uuids for both nodes and relationships

	//Neo4j Create a pattern like (u)-[:CreatedThr]->(c)

}

Reply.delete = function(username,rplyId,callback){
	//Delete reply after validating that the user
	//who wants to delete the reply is the author of that
	//reply
}

//Community.search = function(tags){
	//advanced search by using tags and geolocation
//}

Reply.getThread = function(rplyId,callback){
	var rplyId = rplyId;

	//MAtch the community and show the community

}

Reply.edit = function(rplyId,callback){
	var rplyId = rplyId;

	
}

module.exports = Reply;
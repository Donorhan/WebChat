/**
* Constructor
*/
function Application()
{
	this.lag = 750;	///< Add a lag of 750ms for the simulation.
}

/**
* Add a lag (fun effect for the demo).
* @param value An unsigned integer.
*/
Application.prototype.setLag = function( value )
{
	this.lag = value;
}

/**
* Build a conversation: Create two chats.
* @param userA First user's name.
* @param userB Second user's name.
* @return True if everything is ok, otherwise false.
*/
Application.prototype.buildConversation = function( userA, userB )
{
	if( userA == userB )
		return false;

	// Create default windows.
	var chatA = new Chat(userA, userB);
	var chatB = new Chat(userB, userA);

	if( !chatA || !chatB )
		return false;

	// Link chats.
	chatA.setReceiver(chatB);

	return chatA.createView("application") && chatB.createView("application");
}
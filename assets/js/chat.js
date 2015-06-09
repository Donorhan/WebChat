/**
* Constructor.
* @param name User's name.
* @param receiver Receiver's name.
*/
function Chat( name )
{
	this.name 		= name;
	this.counter	= 0;
	this.receiver 	= null;
	this.view 		= null;
}

/**
* Link the chat to a receiver.
* @param receiver Receiver instance.
* @return True if link have been made successfully, otherwise false.
*/
Chat.prototype.setReceiver = function( receiver )
{
	if( !receiver || receiver == this || receiver == this.receiver )
		return false;

	this.receiver = receiver;
	receiver.setReceiver(this);

	return true;
}

/**
* Send a message to the receivers.
* @param message Message data.
*/
Chat.prototype.sendMessage = function( message )
{
	if( message.length > 0 && this.receiver )
	{		
		this.counter++;
		this.addMessageToTheView(true, message);

		// Simulate a little lag :)
		var _this = this;
		setTimeout(function()
		{
			_this.receiver.onMessageReceived(message);
		}, application.lag);
	}
}

/**
* Send a message to the receivers.
* @param message Message data.
*/
Chat.prototype.onMessageReceived = function( message )
{
	if( message.length > 0 )
		this.addMessageToTheView(false, message);
}

/**
* Send a message to the receivers.
* @param isEmitter True if user is the message's emitter.
* @param message Message data.
*/
Chat.prototype.addMessageToTheView = function( isEmitter, message )
{
	// Update counter.
	this.updateTextCounter();

	// Update view.
	var area 	= this.view.firstElementChild.children[1];
	var bloc 	= document.createElement('p');
	bloc.className = isEmitter ? 'me' : 'other';
	bloc.innerHTML = message;
	area.appendChild(bloc);

	// Scroll to the last message.
	area.scrollTop = area.scrollHeight;

	// Add a little effect on the message.
	setTimeout(function()
	{ 
		bloc.className = bloc.className + ' show';
	}, 100);
}

/**
* Update text counter.
*/
Chat.prototype.updateTextCounter = function()
{
	var header 	= this.view.firstElementChild.firstElementChild;
	var counter = header.children[2];
	var text 	= '';

	if( !this.counter )
		text = 'Aucun message';
	else 
	{
		text  = 'Déjà ' + this.counter + ' message' + ((this.counter > 1) ? 's' : '') + ' ';
		text += 'envoyé' + ((this.counter > 1) ? 's' : '') + ' !';
	}

	counter.innerHTML = text;
}

/**
* Create view.
* @param parent Parent view.
* @return True if everything is ok, otherwise false.
*/
Chat.prototype.createView = function( parent )
{
	var parentView = document.getElementById(parent);
	if( !parentView )
		return false;

	// Main div.
	var div = document.createElement('div');
	div.className = 'chat';
	parentView.appendChild(div);
	this.view = div;

	// Content bloc.
	var content = document.createElement('div');
	content.className = 'content';
	div.appendChild(content);

	// Header part.
	var header = document.createElement('div');
	header.className = 'header';
	content.appendChild(header);

	var avatar = document.createElement('div');
	avatar.className = 'avatar';
	header.appendChild(avatar);
	
	var title = document.createElement('div');
	title.className = 'title';
	title.appendChild( document.createTextNode("Chat avec " + this.receiver.name) ); 
	header.appendChild(title);
	
	var counter = document.createElement('div');
	counter.className = 'counter';
	header.appendChild(counter);

	// Message part.
	var message = document.createElement('div');
	message.className = 'message_area';
	content.appendChild(message);

	// Reply part.
	var replyArea = document.createElement('div');
	replyArea.className = 'reply_area';
	content.appendChild(replyArea);

	var textarea = document.createElement('textarea');
	textarea.placeholder = 'Votre message ici …';
	replyArea.appendChild(textarea);

	var button = document.createElement('button');
	button.appendChild( document.createTextNode("Envoyer") ); 
	replyArea.appendChild(button);

	/**
	* Action to execute when button is click.
	*/
	var thisCallback = this;
	button.onclick = function()	
	{
		thisCallback.sendMessage(textarea.value);
		textarea.value = '';
	};

	textarea.onkeydown = function( e )
	{
		if( e.keyCode == 13 ) // Enter
		{
			button.onclick();
			e.preventDefault(); // Fix new line bug.
		}
	};

	// Init
	this.updateTextCounter();

	return true;
}
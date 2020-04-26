//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions


var messages = [], //array that hold the record of each string in chat 
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'Chatbot', //name of the chatbot
  talking = true; //when false the speach function doesn't work 
  startLocation = "";
  key = 'AIzaSyCPTkeSduuvYhMeAUi9p5bnjQ1SbETnUNg',
  places = [],
  addresses = [],
  times = [],
  startTime=0,
  response = 0;
  var itin = [""];

const proxyurl = "http://ancient-garden-47770.herokuapp.com/";
if (JSON.parse(window.localStorage.getItem('messages'))!=null)
{
  messages = JSON.parse(window.localStorage.getItem('messages'));

}
else{
  messages = ["Chatbot: Where would you like to begin the trip (a city)?"]
}
  
//
//
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//edit this function to change what the chatbot says
function search() {
  talking = true;
  
  var x;
  var place;
  var address;
  var input1 = lastUserMessage.split();
  var input2 = startLocation.split();
  var inputs = input1.concat(input2);

  
  url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + inputs.join("%") + '&inputtype=textquery&fields=formatted_address,name&key=' + key; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url)
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    .then(response => response.json())
    .then(contents => x = ((contents)))
    //.then(() => console.log(x))
    //.then(() => console.log((x.candidates[0])["name"]))
    .then(() => place = (x.candidates[0])["name"])
    .then(() => address = (x.candidates[0])["formatted_address"])
    //.then(() => console.log(place))
    .then(() => botMessage = "I found " + place + " at " + address)
    .then((botMessage) => {
      console.log(botMessage);
      messages.push("<b>" + botName + ":</b> " + botMessage);
      places.push(place);
      addresses.push(address);
      
      messages.push("<b>" + botName + ":</b> " + "How long would you like to stay there? (minutes)");
      outputChat();
    })
  response = 3;  
  
}

function final(){
  lastUserMessage="";
  var output = "";
  var currentTime = startTime;
  var z = 0
  output=output+"Start time: " + startTime + "<br/>"
  for (var i = 0; i < addresses.length-1; i++) {
	(function(i){
    var distance = "";
    var hour = 0;
    var min = 0 ;
	var q = 0;
    
	

    start = addresses[z].split(", ");
    start = start.join("%")
    start = start.split(" ")
    end = addresses[z+1].split(", ");
    end = end.join("%")
	end = end.split(" ")
	start.pop()
	start.pop()
	end.pop()
	end.pop()
    //console.log(start)
	//console.log(end)
	
	
	
	console.log(output);
	
	url="https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+ start.join("%")+"&destinations="+ end.join("%")+"&key="+key;
    fetch(proxyurl + url)
      .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
      .then(response => response.json())
      .then(contents => x = ((contents)))
      .then(() => distance = x.rows[0].elements[0]["distance"]["text"])
      .then(() => time = x.rows[0].elements[0]["duration"]["value"])
      //.then(() => console.log(distance))
      //.then(() => console.log(x))
	  //.then(() => console.log(time))
	  .then(() => console.log(i))
      .then(() => {
		
		
		output=output+"Location "+(i+1)+": " +places[i]+"<br/>";
		output=output+"Time here: "+times[i] + " minutes <br/>";
        output=output+"Distance travelled: "+distance + "<br/>"
        hour = Math.trunc(time/60/60)
        min = Math.trunc((time/60/60-Math.trunc(time/60/60))*60)
        output=output + "Time taken: "+ hour + " hours and "+ min  + " minutes. "+"<br/>"
		//console.log(min)
		//console.log(currentTime)
		//console.log(times[i])
		//console.log(min+ currentTime*100- Math.trunc(currentTime)*100+times[i])
		//console.log(Math.trunc(min)+ Math.trunc(currentTime*100)- Math.trunc(currentTime*100)+Math.trunc(times[isNaN]))
		min = min+ (currentTime- Math.trunc(currentTime))*100+parseInt(times[i])
		//console.log(min)
		while (min>60){
          min=min-60
          hour=hour+1
        }
        hour=hour+Math.trunc(currentTime)
        currentTime=hour+Math.trunc(min)/100

        console.log(hour)
        console.log(min)
        
        output = output+"New time: "+ currentTime + "<br/>"
        output = output + "New location: " + places[i+1]+ "<br/>"
        q=q+1
		
		console.log(output)
		itin.push(output)
		messages.push(output)
		output="";
		outputChat()
		

      })

	  
	z=z+1;  
	outputChat()

}).call(this,i)}
  //messages.push(itin.join(""))
  outputChat()
}




//****************************************************************
//****************************************************************
//**************************************************************** 
//****************************************************************
//****************************************************************
//****************************************************************
//****************************************************************
//
//
//
//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage    
    botMessage = "";
    lastUserMessage = document.getElementById("chatbox").value;
    if (lastUserMessage.toLowerCase=="reset"){
      window.localStorage.setItem('messages', null);
      messages = [];
      response = 0;
      return;
    }
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);
    
    if (response==4)
      {
        if (lastUserMessage=="y")
          {
            botMessage="Where would you like to go next?";
            response=2;
            messages.push("<b>" + botName + ":</b> " + botMessage);
            outputChat();
            return;
          }
        else{
          final();
          return;
        }
        
      }  

    if (response==3)
      {times.push(lastUserMessage);
      botMessage = "Would you like to continue? y/n (lower case only)";
      response = 4;}

    if (response==2)
    search();
    
    if (response ==1)
      {
        startTime=lastUserMessage;
        botMessage="Where would you like to start?";
        response =2;
      }
    if (startLocation == "") {
      startLocation = lastUserMessage;
      botMessage = "What time would you like to begin? (24 hour time please, hour.min)";
      response = 1;
    }
    if (botMessage!= "")
      messages.push("<b>" + botName + ":</b> " + botMessage);

    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    
    
    
    
    
    
    // says the message using the text to speech function written below
    //Speech(botMessage);
    //outputs the last few array elements of messages to html
    window.localStorage.setItem('messages', JSON.stringify(messages));

    outputChat();
  }
}

function outputChat(){
  for (var i = -1; i < 8; i++) {
    if (messages[messages.length - i])
      document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
  }
}
//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
    //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}






























$(function () {

	// Vars.
	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	// Disable animations/transitions until everything's loaded.
	$body.addClass('is-loading');

	$window.on('load', function () {
		$body.removeClass('is-loading');
	});

	// Poptrox.
	$window.on('load', function () {

		$('.thumbnails').poptrox({
			onPopupClose: function () { $body.removeClass('is-covered'); },
			onPopupOpen: function () { $body.addClass('is-covered'); },
			baseZIndex: 10001,
			useBodyOverflow: false,
			usePopupEasyClose: true,
			overlayColor: '#000000',
			overlayOpacity: 0.75,
			popupLoaderText: '',
			fadeSpeed: 500,
			usePopupDefaultStyling: false,
			windowMargin: (skel.breakpoint('small').active ? 5 : 50)
		});

	});

});
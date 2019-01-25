

var portBackgroundToContent = null;

var isDebug = false;
function DebugOut(inf)
{
	if(isDebug)
	{
		var timestamp = new Date().getTime();
		var debugOutInf = inf + " " + timestamp;

		if(portBackgroundToContent != null)
		{
			portBackgroundToContent.postMessage({"Type":"dbgout","outinf":debugOutInf});
		}
		else
		{
			//alert(debugOutInf);
		}
	}
}


var portBackgroundToExe = null;
var isConnectBackToExe = false;
var requestGloabl = new Array();　
var cryptAlgArray = new Array();　
var messageFromExe = null;
var isExERuningNumb = 0;            //查询EXE是否允许次数
var ConnectIdsNumb = 0;             //bkjs to content obj numb


//响应



function Init()
{
	portBackgroundToContent = null;
	isConnectBackToExe = false;
	portBackgroundToExe = null;　
	requestGloabl = new Array();　
	messageFromExe = null;
	cryptAlgArray = new Array();　
	isExERuningNumb = 0;            //查询EXE是否允许次数
	ConnectIdsNumb = 0;             //bkjs to content obj numb
}


//保存消息



//---------------------------------监听WebPage函数------------------------
//background监听WebPage消息
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {

    DebugOut("Assist bkjs rcv webMsg request.Type:" + request.Type);

    var isNotSendToEXE = false;
    var isSendResponse = true;
    var messageTmp = null;
 
   if (portBackgroundToExe != undefined) {
        if (request.Type == "getLastRespose") {
            messageTmp =
			{
			    "Type": request.Type
			}
            isNotSendToEXE = true;
        }
      
		    else if (request.Type == "IsInstalled") {
            messageTmp =
			{
			    "Type": request.Type
			}
                        }
		    else if (request.Type == "Run") {
            messageTmp =
			{
			    "Type": request.Type
			}
        }
		    else if (request.Type == "GetAssitVer") {
                        DebugOut("bkjs rcv GetAssitVer ");
            messageTmp =
			{
			    "Type": request.Type
			}
        }
		    else if (request.Type == "GetVer") {
            messageTmp =
			{
			    "Type": request.Type,
			   // "safetyObj": request.safetyObj,
			    "strSeed": request.strSeed
			}
        }
	    else if (request.Type == "quit") {
            messageTmp =
			{
			    "Type": request.Type
			}
         }


        else {
            console.log("unKnow request.Type:" + request.Type);
        }

        if (!isNotSendToEXE)//send
        {
            DebugOut("bkjs SendToEXE messageTmp.Type:" + messageTmp.Type);

            isNotSendToEXE = false;
            messageFromExe = messageTmp;
            portBackgroundToExe.postMessage(messageTmp);//发送给EXE
        }
    }
    //	else{		
    //		DebugOut("bkjs portBackgroundToExe:"+portBackgroundToExe);
    //	}

    if (isSendResponse) {
        //DebugOut("bkjs before sendResponse");
        sendResponse({ farewell: messageFromExe });  	//向html返回的字符串
        //DebugOut("bkjs after sendResponse");
    }
});  



//---------------------------------监听contentjs函数------------------------
//background监听contentjs消息
chrome.extension.onConnect.addListener(function(portToConnect) {

	//DebugOut("bkjs chrome.extension.onConnect.adlistener in");

	if(portToConnect.name == "contentPage1"){
		portBackgroundToContent = portToConnect;
	//background连接exe
		connect();					
	}

	portToConnect.onMessage.addListener(function(msg) {
        if (msg.Type == "isCrxLoad") {
            isExERuningNumb++;
            if (isExERuningNumb < 30) {
                //DebugOut("bkjs isCrxLoad: Reply");
                isExERuningNumb = 0;
                portToConnect.postMessage({ "Type": "Reply" });
            } else if (isExERuningNumb == 30) {
                DebugOut("bkjs isCrxLoad outtime:" + isExERuningNumb);
            }
   
        } else if (msg.Type == "InitCrx") {         
            messageFromExe = undefined;
            isExERuningNumb = 0;            //查询EXE是否允许次数
            ConnectIdsNumb = 0;             //bkjs to content obj numb
        } else if (msg.Type == "quit") {
			messageQuit();
		}  

	});
});



//---------------------------------js处理函数------------------------

function onDisconnected() {  
	DebugOut("bkjs Failed to connect: " + chrome.runtime.lastError.message);

	if("Native host has exited." == chrome.runtime.lastError.message)
	{
		isConnectBackToExe = false;
	}

	if(portBackgroundToContent != undefined)
	{
		portBackgroundToContent.postMessage({"question": "disable"});
	}

	Init();
}


//响应exe发出的消息函数
function onNativeMessage(message) {
	//messageFromExe = message;
 
   DebugOut("bkjs onNativeMessage - FromExe:" + JSON.stringify(message));
         
	if (message.Type == "ExeToChrome")//监听EXE和/chrome的链接
	{
	    isExERuningNumb = 0;
	    //响应EXE发来的连接并给返回
	    //DebugOut("bkjs - ChromeToExe");
	    var message = { "Type": "ChromeToExe" };
	    portBackgroundToExe.postMessage(message);
	    return;
	}
    //DebugOut("bkjs onNativeMessage - messageFromExe:" + JSON.stringify(messageFromExe));
     messageFromExe = message;
}

function connect() {

	DebugOut("bkjs - connect() in");

	if(isConnectBackToExe == true)
	{
		DebugOut("bkjs - connect() isConnectBackToExe true return");
		return ;
	}

	portBackgroundToExe = null;
	var hostName = "com.google.chrome.assist.plugin";
	portBackgroundToExe = chrome.runtime.connectNative(hostName);

	//注册exe发出消息的监听函数onNativeMessage
	portBackgroundToExe.onMessage.addListener(onNativeMessage);
	portBackgroundToExe.onDisconnect.addListener(onDisconnected);
		
	if(portBackgroundToExe != undefined && portBackgroundToExe != null)
	{
		isConnectBackToExe  = true;
		DebugOut("isConnectBackToExe is true");
	}
	else
	{  
		isConnectBackToExe  = false;
		//DebugOut("isConnectBackToExe is false");
	}
}


//关闭窗口
function messageQuit(){

	DebugOut("bkjs - messageQuit");

	var message = {"Type": "quit"};
	portBackgroundToExe.postMessage(message);
}


/////////////////////////////////
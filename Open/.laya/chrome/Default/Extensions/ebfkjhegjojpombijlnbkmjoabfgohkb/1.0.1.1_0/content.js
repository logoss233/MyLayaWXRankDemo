
var isCrxLoad = true;
var checkCrxTimer = -1;

var isReLoad = true;
var isDebug = false;
function DebugOut(inf)
{
	if(isDebug)
	{
		var timestamp = new Date().getTime();
		var debugOutInf = inf + " " + timestamp;
		console.log(debugOutInf);
	}
}


DebugOut("contentjs begin");

//定义contentjs与background通信的portContentToBackground
var portContentToBackground = chrome.extension.connect({name: "contentPage1"});

var safeObjIDAry = new Array();　

//实现当页面退出时向exe发送quit消息
window.onbeforeunload = onbeforeunload_handler;
function onbeforeunload_handler() {
	DebugOut("portContentToBackground.quit");
	portContentToBackground.postMessage({Type: "quit"});
}


//---------------------------------js监听函数------------------------
document.addEventListener('ASSIST_ICBC_Event', function (evt) {
  		var msgType = evt.detail;
		//DebugOut("document.addEventListener in  msgType:"+msgType);

  		if(msgType == "checkCrxRun"){
			//DebugOut("document.addEventListener in  checkCrxRun");
			//message = {"Type":"isCrxLoad"};
			//portContentToBackground.postMessage(message);
						
    		clearInterval(checkCrxTimer);
			checkCrxTimer = setInterval(function checkTime() {	
	            if(isCrxLoad && portContentToBackground != null){	
		            isCrxLoad = false;
		            portContentToBackground.postMessage({"Type":"isCrxLoad"});	
	            }else{		

		            //portContentToBackground = chrome.extension.connect({name: "contentPage1"});
	            }	
            }, 500);
  		}

},false);
checkCrxTimer = setInterval(function checkTime() {
    if (isReLoad) {
        if (portContentToBackground != null) {
            isReLoad = false;
            portContentToBackground.postMessage({ "Type": "InitCrx" });
            DebugOut("Snd InitCrx Type to bkjs ");
        } else {
            DebugOut("Need ReLoad Crx, portContentToBackground is NULL ");
        }
    } else {
        if (portContentToBackground != null) {
            portContentToBackground.postMessage({ "Type": "isCrxLoad" });
        }

        clearInterval(checkCrxTimer);
        checkCrxTimer = setInterval(function checkTime() {
            if (isCrxLoad) {
                if (portContentToBackground != null) {
                    isCrxLoad = false;
                    portContentToBackground.postMessage({ "Type": "isCrxLoad" });
                }
            } else {
                DebugOut(" ContentToBackground connect fail");
                //HideAllInputObject();
            }
        }, 500);     //TODO:1000-3000
    }
}, 50);
//contentjs监听backgroundjs函数
portContentToBackground.onMessage.addListener(function(msg) {

	DebugOut("contentjs监听backgroundjs - msg.type: "+ msg.Type + " msg.question:" + msg.question + " msg.embedID:" + msg.embedID ); 
	if(msg.Type == "Reply"){
		isCrxLoad = true;
	}

	if(msg.Type == "dbgout")
	{
		console.log(msg.outinf);
	}
	else if(msg.Type == "Notify")
	{
		//alert("cntnt - msg.Notify:"+msg.inf);
		//NotifyInfo(msg.inf);
	}
	else if(msg.question == "disable")
	{
		DebugOut("contentjs rcv backgroundjs msg.question: " + msg.question);
	}
	else
	{
	    DebugOut("contentjs rcv backgroundjs msg: " + JSON.stringify(msg));	
	}
});


DebugOut("contentjs end");
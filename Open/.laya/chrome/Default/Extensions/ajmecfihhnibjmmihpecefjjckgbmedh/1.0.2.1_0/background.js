

var portBackgroundToContent = null;

var isDebug = false;
function DebugOut(inf) {
    if (isDebug) {
        var timestamp = new Date().getTime();
        var debugOutInf = inf + " " + timestamp;

        if (portBackgroundToContent != null) {
            //portBackgroundToContent.postMessage({"Type":"dbgout","outinf":debugOutInf});
            //sendMsgByPortToCntent({"Type":"dbgout","outinf":debugOutInf});
        }
        else {
            //alert(debugOutInf);
        }
    }
}


var portBackgroundToExe = null;
var isConnectBackToExe = false;
var messageFromExe = undefined;
var isExERuningNumb = 0;            //查询EXE是否允许次数
var ConnectIdsNumb = 0;             //bkjs to content obj numb
var RuningTimeNumb = 0;

function SafetyObjState(name, id, minLen, maxLen, rule, uniqueID, isPassword, cryptAlg, tabId) {
    var that = this;

    that.ID = id;
    that.Name = name;
    that.MinLen = minLen;
    that.MaxLen = maxLen;
    that.Rule = rule;
    that.UniqueID = uniqueID;
    that.IsPassword = isPassword;
    that.CryptAlg = cryptAlg;
    that.IsCreated = false;
    //that.IsActived = false;
    that.LastActiveTime = 0;
    that.TabId = tabId;
    that.ResponseBlur = true;
}

var SafetyObjStateList = new Array();
var safeIDObjID = new Array();　	    //创建一个ID数组

function PortTabIDBand(port, tabid) {
    var that = this;
    that.port = port;
    that.tabid = tabid;
}

var PortTabIDList = new Array();

function sendMsgByPortTabIDToCntent(msg) {
    //alert("sendMsgByPortTabIdToCntent   activeTabId" + activeTabId);
    for (var i = 0; i < PortTabIDList.length; i++) {
        //alert("sendMsgByPortTabIdToCntent   activeTabId" + activeTabId + "" + PortTabIDList[i].tabid);
            if (activeTabId == PortTabIDList[i].tabid)
            {
               
                try {
                   
                PortTabIDList[i].port.postMessage(msg);
                //alert("sendMsgByPortTabIdToCntent   msg:" + msg.Type);
		}
		catch(e){}
            }
        }
}


var portBackgroundToContentArray = new Array();

function sendMsgByPortToCntent(msg) {
    for (var i = 0; i < portBackgroundToContentArray.length; i++) {
        try {
            portBackgroundToContentArray[i].postMessage(msg);
        }
        catch (e) {
            if (i < portBackgroundToContentArray.length - 1) {
                var lastPort = portBackgroundToContentArray.pop();
                portBackgroundToContentArray[i] = lastPort;
                i--;
            }

            //alert("sendMsgByPortToCntent port["+i+"]:"+e.name + " LastError:"+chrome.runtime.lastError.message);
        }
    }
}

function Init() {
    portBackgroundToContent = null;
    isConnectBackToExe = false;
    portBackgroundToExe = null;
    messageFromExe = undefined;

    for (var i = 0; i < SafetyObjStateList.length; i++) {
        SafetyObjStateList[i].IsCreated = false;
    }

    isExERuningNumb = 0;            //查询EXE是否允许次数
    ConnectIdsNumb = 0;             //bkjs to content obj numb
    RuningTimeNumb = 0;

    safeIDObjID = new Array();
}


//保存消息
function saveGlobleMessage(request,tabId) {
    //DebugOut("bkjs NewSafetyObj:" + request.name + "  " + request.messageEmbed + "  SafetyObjNumb:" + SafetyObjStateList.length);
    if (safeIDObjID.length > 0) {
        var safeIDObjIDs = safeIDObjID.join(",");
        if (safeIDObjIDs.indexOf(request.messageEmbed) == -1) {
            safeIDObjID.push(request.messageEmbed);
        }
        for (var i = 0; i < SafetyObjStateList.length; i++) {
            DebugOut("bkjs NewSafetyObject saveGlobleMessage:" + "SafetyObjStateList[i].Name:" + SafetyObjStateList[i].Name + "   SafetyObjStateList[" + i + "].UniqueID:" + SafetyObjStateList[i].UniqueID);
           //alert("123");
            if (SafetyObjStateList[i].Name == request.name && SafetyObjStateList[i].TabId == tabId) {
                //alert("bkjs Remove SafetyObj:" + SafetyObjStateList[i].Name + "  " + SafetyObjStateList[i].ID + "  SafetyObjNumb:" + SafetyObjStateList.length);
                //DebugOut("= 原有SafetyObjStateList  =" + SafetyObjStateList.length);
                //var lastObj = SafetyObjStateList.pop();
                //SafetyObjStateList.pop();
                SafetyObjStateList[i].ID = request.messageEmbed;
                SafetyObjStateList[i].MinLen = request.minLength;
                SafetyObjStateList[i].MaxLen = request.maxLength;
                SafetyObjStateList[i].Rule = request.rule;
                SafetyObjStateList[i].UniqueID = request.UniqueID;
                SafetyObjStateList[i].IsPassword = request.isPassword;
                SafetyObjStateList[i].CryptAlg = request.CryptAlg;
                SafetyObjStateList[i].TabId = tabId;
                SafetyObjStateList[i].IsCreated = false;
                return;
            }

            var newObjState = new SafetyObjState(request.name,
                request.messageEmbed,
                request.minLength,
                request.maxLength,
                request.rule,
                request.UniqueID,
                request.isPassword,
                request.CryptAlg,
                tabId);
            //DebugOut("bkjs NewSafetyObject saveGlobleMessage:" + "SafetyObjStateList[i].Name:" + SafetyObjStateList[i].Name + "   SafetyObjStateList[" + i + "].UniqueID:" + SafetyObjStateList[i].UniqueID + " SafetyObjStateList.length:" + SafetyObjStateList.length);
            SafetyObjStateList.push(newObjState);
            //DebugOut("bkjs SaveSafetyObj1:" + request.name + "  " + request.messageEmbed + "  SafetyObjNumb:" + SafetyObjStateList.length);
        }
    } else {
        safeIDObjID.push(request.messageEmbed);
        var newObjState = new SafetyObjState(request.name,
            request.messageEmbed,
            request.minLength,
            request.maxLength,
            request.rule,
            request.UniqueID,
            request.isPassword,
            request.CryptAlg,
            tabId);
        SafetyObjStateList.push(newObjState);
        //DebugOut("bkjs SaveSafetyObj2:" + request.name + "  " + request.messageEmbed + "  SafetyObjNumb:" + SafetyObjStateList.length);
    }
}


//---------------------------------监听WebPage函数------------------------
//background监听WebPage消息
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {

    DebugOut("bkjs rcv webMsg request.Type:" + request.Type + "request.Name:" + request.name);
    var isNotSendToEXE = false;
    var isSendResponse = true;
    var messageTmp = null;
    var tabId = sender.tab.id;
    var strTabID = tabId.toString();
    if (request.Type == "SaveConnectPort") {
        for (var i = 0; i < PortTabIDList.length; i++) {
            if (PortTabIDList[i].tabid == -1) {
                PortTabIDList[i].tabid = strTabID;
                //alert("bkjs rcv NewSafetyObject TabID 赋值:" + TabId);
            }
        }
        isNotSendToEXE = true;
    }
    else if (request.Type == "NewSafetyObject") {
        saveGlobleMessage(request, strTabID);
        DebugOut("bkjs rcv webMsg request:" + request.name + " " + request.UniqueID);
        //if (portBackgroundToContent != undefined && portBackgroundToContent != null) {
        //    DebugOut("bkjs post embedID: " + request.messageEmbed + " to content");
        //    portBackgroundToContent.postMessage({ Type: "setObjAction", embedID: request.messageEmbed });
        //}
        sendMsgByPortToCntent({ Type: "setObjAction", embedID: request.messageEmbed });
        if (isConnectBackToExe && portBackgroundToExe != undefined && portBackgroundToExe != null) {
            //DebugOut("bkjs to exe:"+JSON.stringify(request));

            messageTmp =
			{
			    "Type": request.Type,
			    "name": request.name,
			    "messageEmbed": request.messageEmbed,
			    "minLength": request.minLength,
			    "maxLength": request.maxLength,
			    "UniqueID": request.UniqueID,
			    "isPassword": request.isPassword,
			    "rule":request.rule,
			    "CryptAlg": request.CryptAlg,
			    "TabId": strTabID
			};
            portBackgroundToExe.postMessage(messageTmp);
        }
    }
    else if (portBackgroundToExe != undefined) {
        if (request.Type == "getLastRespose") {
            messageTmp =
			{
			    "Type": request.Type
			}
            isNotSendToEXE = true;
        }
        else if (request.Type == "getVerCtrl") {
            messageTmp = { "Type": request.Type };
        }
        else if (request.Type == "clear") {
            messageTmp = {
                "Type": request.Type,
                "SafetyObject": request.SafetyObjName,
                "TabId": strTabID
            };
        }
        else if (request.Type == "getLength") {
            messageTmp = { "Type": request.Type, "SafetyObject": request.SafetyObjName };
        }
        else if (request.Type == "isValid") {
            messageTmp = { "Type": request.Type, "SafetyObject": request.SafetyObjName };
        }
        else if (request.Type == "getInfo") {
            //messageTmp = { "Type": request.Type, "SafetyObject": request.SafetyObjName };
            messageTmp = request;
        }
        else if (request.Type == "setMapingRules" || request.Type == "setChangeRules" || request.Type == "setRules") {
            messageTmp = request;
        }
        else if (request.Type == "activeObject") {
            //DebugOut("bkjs rcv activeObject " + request.SafetyObject);
            //if (portBackgroundToContent != undefined && portBackgroundToContent != null) {
            for (var i = 0; i < SafetyObjStateList.length; i++) {
                DebugOut("bkjs activeObject SafetyObjStateList.length" + SafetyObjStateList[i].Name + "  " + SafetyObjStateList.length + "  ");
                if (SafetyObjStateList[i].Name == request.SafetyObject && SafetyObjStateList[i].TabId == sender.tab.id) {
                    var t = new Date().getTime() - SafetyObjStateList[i].LastActiveTime;
                    //DebugOut("bkjs activeObject " + SafetyObjStateList[i].Name + "  " + SafetyObjStateList[i].ID + "  " 
                    //		        + SafetyObjStateList[i].IsActived + "  t:" + t + "  ");
                    //DebugOut("bkjs activeObject " + SafetyObjStateList[i].Name + "  " + SafetyObjStateList[i].ID + "  "
                    //		        + SafetyObjStateList[i].IsActived + "  t:" + t + "  " );
                    if (t > 400) {//SafetyObjStateList[i].IsActived == false && 
                        SafetyObjStateList[i].LastActiveTime = new Date().getTime();
                        SafetyObjStateList[i].ResponseBlur = false;

                        activeTabId = sender.tab.id;
                        //alert("bkjs rcv activeTabID:" + activeTabId);

                        var messageTmp =
                         {
                             "Type": "UnActiveObj",
                             "ObjId": SafetyObjStateList[i].ID
                         }
                        //portBackgroundToContent.postMessage(messageTmp);
                        //sendMsgByPortToCntent(messageTmp);
                        sendMsgByPortTabIDToCntent(messageTmp);
                        textFocus(request.SafetyObject, strTabID);
                        isNotSendToEXE = true;
                        isSendResponse = false;
                        break;
                    }
                }
            }
            //}
        }
        else if (request.Type == "freeObject") {
            for (var i = 0; i < SafetyObjStateList.length; i++) {
                if (SafetyObjStateList[i].Name == request.SafetyObject
                    && SafetyObjStateList[i].TabId == sender.tab.id) {
                    if (SafetyObjStateList[i].ResponseBlur) {
                        textBlur(request.SafetyObject);
                        isNotSendToEXE = true; //textBlur 已发送
                        isSendResponse = false;
                        break;
                    }
                }
            }
        }
        else if (request.Type == "commitKeyPart") {
            messageTmp =
			{
			    "Type": request.Type,
			    "sourceObj": request.sourceObj,
			    "targetObj": request.targetObj
			}
        }
        else if (request.Type == "isEqual") {
            messageTmp =
			{
			    "Type": request.Type,
			    "sourceObj": request.sourceObj,
			    "targetObj": request.targetObj
			}
        }
        else if (request.Type == "getMultiInfo") {
            request.tabId = strTabID;
            messageTmp = request;

            //DebugOut("bkjs - request.Type:getMultiInfo" + request.Type);           
        }
        else if (request.Type == "addKeyPart") {
            messageTmp =
			{
			    "Type": request.Type,
			    "safetyObj": request.safetyObj,
			    "strKeyPart": request.strKeyPart
			}
        }
        else if (request.Type == "updateSeed") {
            messageTmp =
			{
			    "Type": request.Type,
			    "safetyObj": request.safetyObj,
			    "strSeed": request.strSeed
			}
        }
        else if (request.Type == "CapsOnOrNot") {
            messageTmp =
			{
			    "Type": request.Type
			}
        }
        else if (request.Type == "quit") {
            messageTmp = { "Type": "quit" }
        }
        else if (request.Type == "FreeActiveObject") {
            messageTmp = { "Type": "FreeActiveObject" }
        }
        else if (request.Type == "CleanAll") {
            isNotSendToEXE = true;
            isSendResponse = false;
            //DebugOut("bkjs - request.Type:CleanAll request.strHost:" + request.strHost);
            CleanAll(request.strHost);
        }
        else if (request.Type == "CleanHistory") {
            isNotSendToEXE = true;
            isSendResponse = false;
            CleanHistory(request.strHost);
        }
        else if (request.Type == "CleanCache") {
            isNotSendToEXE = true;
            isSendResponse = false;
            CleanCache(request.strHost);
        }
        else if (request.Type == "CleanCookie") {
            isNotSendToEXE = true;
            isSendResponse = false;
            CleanCookie(request.strHost);
        }
        else {
            console.log("unKnow request.Type:" + request.Type);
        }

        if (!isNotSendToEXE)//send
        {
            //DebugOut("bkjs SendToEXE messageTmp.Type:" + messageTmp.Type);

            isNotSendToEXE = false;
            messageFromExe = messageTmp;
            portBackgroundToExe.postMessage(messageTmp);
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
chrome.extension.onConnect.addListener(function (portToConnect) {

    //DebugOut("bkjs chrome.extension.onConnect.adlistener in");

    if (portToConnect.name == "contentPage") {
        portBackgroundToContent = portToConnect;
        portBackgroundToContentArray.push(portBackgroundToContent);
	
        var portTabidState = new PortTabIDBand(portBackgroundToContent,-1);
        PortTabIDList.push(portTabidState);
        //for (var i = 0; i < PortTabIDList.length; i++) {
        //    alert("bkjs 监听contentjs  PortTabIDList:" + PortTabIDList[i].tabid);
        //}

        //background连接exe		
        connect();
    }

    portToConnect.onMessage.addListener(function (msg) {
        if (msg.Type == "isCrxLoad") {
            isExERuningNumb++;
            if (isExERuningNumb < 30) {
                //DebugOut("bkjs isCrxLoad: Reply");
                isExERuningNumb = 0;
                portToConnect.postMessage({ "Type": "Reply" });
            } else if (isExERuningNumb == 30) {
                DebugOut("bkjs isCrxLoad outtime:" + isExERuningNumb);
            }

            if (ConnectIdsNumb != safeIDObjID.length) {
                var safeIDObjIDs = safeIDObjID.join(",");
                portToConnect.postMessage({ Type: "setObjAction", embedIDs: safeIDObjIDs });
                ConnectIdsNumb = safeIDObjID.length;
                //DebugOut("bkjs ConnectIdsNumb:" + ConnectIdsNumb);
            }

            RuningTimeNumb++
            if (RuningTimeNumb > 1 && RuningTimeNumb < 10) {
                DebugOut("bkjs RuningTime NewSafetyObject:" + SafetyObjStateList[i].length);
                for (var i = 0; i < SafetyObjStateList.length; i++) {
                    if (!SafetyObjStateList[i].IsCreated) {
                        DebugOut("bkjs RuningTime NewSafetyObject:" + "SafetyObjStateList[i].Name:" + SafetyObjStateList[i].Name + "   SafetyObjStateList[" + i + "].UniqueID:" + SafetyObjStateList[i].UniqueID);
                        var message =
                        {
                            "Type": "NewSafetyObject",
                            "name": SafetyObjStateList[i].Name,
                            "minLength": SafetyObjStateList[i].MinLen,
                            "maxLength": SafetyObjStateList[i].MaxLen,
                            "rule": SafetyObjStateList[i].Rule,
                            "UniqueID": SafetyObjStateList[i].UniqueID,
                            "isPassword": SafetyObjStateList[i].IsPassword,
                            "messageEmbed": SafetyObjStateList[i].ID,
                            "CryptAlg": SafetyObjStateList[i].CryptAlg,
                            "TabId":SafetyObjStateList[i].TabId
                        };
                        DebugOut("RuningTime NewSafetyObject bkjs to exe: " + JSON.stringify(message));
                        portBackgroundToExe.postMessage(message);
                    }
                }
            }
        }
        else if (msg.Type == "FreeActiveObject") {
            var message = { "Type": "FreeActiveObject" }
            portBackgroundToExe.postMessage(message);
        }
        else if (msg.Type == "InitCrx") {

            //DebugOut("InitCrx SafetyObjNumb: " + SafetyObjStateList.length);
            for (var i = 0; i < SafetyObjStateList.length; i++) {
                SafetyObjStateList[i].IsCreated = false;
                SafetyObjStateList[i].LastActiveTime = 0;
            }
            messageFromExe = undefined;
            RuningTimeNumb = 0;
            isExERuningNumb = 0;            //查询EXE是否允许次数
            ConnectIdsNumb = 0;             //bkjs to content obj numb

            var message = { "Type": "FreeActiveObject" }
            portBackgroundToExe.postMessage(message);

        } else if (msg.Type == "quit") {
            messageQuit();
        }
    });
});



//---------------------------------js处理函数------------------------

function onDisconnected() {
    //DebugOut("bkjs Failed to connect: " + chrome.runtime.lastError.message);

    if ("Native host has exited." == chrome.runtime.lastError.message) {
        isConnectBackToExe = false;
    }

    /*if(portBackgroundToContent != null)
	{
		portBackgroundToContent.postMessage({"question": "disable"});
	}*/
    sendMsgByPortToCntent({ "question": "disable" });

    Init();
}



//响应exe发出的消息函数
function onNativeMessage(message) {    DebugOut("bkjs onNativeMessage - FromExe:" + JSON.stringify(message));
    if (message.Type == "responseNewSafetyObject") {
        for (var i = 0; i < SafetyObjStateList.length; i++) {
            DebugOut("bkjs NewSafetyObject FromExe:" + "SafetyObjStateList[i].Name:" + SafetyObjStateList[i].Name + "   SafetyObjStateList[" + i + "].UniqueID:" + SafetyObjStateList[i].UniqueID);
            if (SafetyObjStateList[i].Name == message.name
                && SafetyObjStateList[i].MinLen == message.MinLength
                && SafetyObjStateList[i].MaxLen == message.MaxLength
                && SafetyObjStateList[i].UniqueID == message.UniqueID
                && SafetyObjStateList[i].IsPassword == message.IsPassword
                && SafetyObjStateList[i].CryptAlg == message.CryptAlg
                && SafetyObjStateList[i].ID == message.EmbedID
                && SafetyObjStateList[i].Rule == message.Rule
		&& SafetyObjStateList[i].TabId == message.TabId) {
                DebugOut("bkjs responseNewSafetyObject name : " + message.name + "");
                SafetyObjStateList[i].IsCreated = true;
		break;
            }
        }
        if (message.Result == "0") {
            //DebugOut("bkjs  EnableObj" + message.name);
            var messageTmp =
            {
                "Type": "EnableObj",
                "EnableObjId": message.EmbedID,
                "IsPassword": message.IsPassword
            }
            sendMsgByPortToCntent(messageTmp);
            //	        if (portBackgroundToContent != null) {
            //	            portBackgroundToContent.postMessage(messageTmp);
            //	        }
            //		sendMessageToContent(messageTmp);
        }
        return;
    }
    else if (message.Type == "responseTextFocus") {
        for (var i = 0; i < SafetyObjStateList.length; i++) {
            if (SafetyObjStateList[i].ID == message.EmbedID && SafetyObjStateList[i].TabId == message.TabId) {
                //SafetyObjStateList[i].IsActived = true;
                SafetyObjStateList[i].LastActiveTime = new Date().getTime();
                SafetyObjStateList[i].ResponseBlur = true;
                break;
            }
        }

        var messageTmp =
	             {
	                 "Type": "ActiveObj",
	                 "ObjId": message.EmbedID,
	                 "IsPassword": message.IsPassword
	             }
        //if (portBackgroundToContent != null) {
        //    portBackgroundToContent.postMessage(messageTmp);
        //}
        //sendMsgByPortToCntent(messageTmp);
        sendMsgByPortTabIDToCntent(messageTmp);
        return;
    }
    /*else if (message.Type == "responseTextBlur") {
        for (var i = 0; i < SafetyObjStateList.length; i++) {
            if (SafetyObjStateList[i].Name == message.SafetyObject) {
                SafetyObjStateList[i].IsActived = false;
            }
        }
        return;
    }*/
    else if (message.Type == "ExeToChrome")//监听EXE和/chrome的链接
    {
        isExERuningNumb = 0;
        //响应EXE发来的连接并给返回
        //DebugOut("bkjs - ChromeToExe");
        var message = { "Type": "ChromeToExe" };
        portBackgroundToExe.postMessage(message);

        return;
    }
    else if (message.Type == "replayVerifyCode") {

        var messageTmp = {
            "Type": "replayVerifyCode",
            "verifyCode": message.verifyCode
        };
        //sendMsgByPortToCntent(messageTmp);
        sendMsgByPortTabIDToCntent(messageTmp);
        return;
    }
    else if (message.Type == "resetValue") {
        var messageTmp = {
            "Type": "resetValue",
            "Value": message.Value
        };
        //sendMsgByPortToCntent(messageTmp);
        sendMsgByPortTabIDToCntent(messageTmp);
        //      portBackgroundToContent.postMessage(messageTmp);
        //		sendMessageToContent(messageTmp);
        return;
    }

    messageFromExe = message;
}

function connect() {

    //DebugOut("bkjs - connect() in");

    if (isConnectBackToExe == true) {
        //DebugOut("bkjs - connect() isConnectBackToExe true return");
        return;
    }

    portBackgroundToExe = null;
    var hostName = "com.google.chrome.icbc.plugin";
    portBackgroundToExe = chrome.runtime.connectNative(hostName);

    //注册exe发出消息的监听函数onNativeMessage
    portBackgroundToExe.onMessage.addListener(onNativeMessage);
    portBackgroundToExe.onDisconnect.addListener(onDisconnected);

    if (portBackgroundToExe != undefined && portBackgroundToExe != null) {
        isConnectBackToExe = true;
        //DebugOut("isConnectBackToExe is true");
        for (var i = 0; i < SafetyObjStateList.length; i++) {
            //DebugOut("connect() SafetyObjStateList.length" + SafetyObjStateList.length);
            var message =
			{
			    "Type": "NewSafetyObject",
			    "name": SafetyObjStateList[i].Name,
			    "minLength": SafetyObjStateList[i].MinLen,
			    "maxLength": SafetyObjStateList[i].MaxLen,
			    "rule": SafetyObjStateList[i].Rule,
			    "UniqueID": SafetyObjStateList[i].UniqueID,
			    "isPassword": SafetyObjStateList[i].IsPassword,
			    "messageEmbed": SafetyObjStateList[i].ID,
			    "CryptAlg": SafetyObjStateList[i].CryptAlg,
			    "TabId":SafetyObjStateList[i].TabId
			};
            //DebugOut("bkjs to exe: " + JSON.stringify(message));
            DebugOut("bkjs to exe  SafetyObjStateList["+i+"].UniqueID:"+ SafetyObjStateList[i].UniqueID);
            portBackgroundToExe.postMessage(message);
        }
    }
    else {
        isConnectBackToExe = false;
        //DebugOut("isConnectBackToExe is false");
    }
}


//获取焦点
function textFocus(controlName,tabId) {
    var message =
        { 
            "Type": "textFocus",
            "SafetyObject": controlName,
            "TabId": tabId
        };
    portBackgroundToExe.postMessage(message);
}

//失去焦点
function textBlur(controlName) {
    var message = { Type: "textBlur", "SafetyObject": controlName };
    //DebugOut("bkjs message.Type: " + message.Type);
    //DebugOut("bkjs message.controlName: " + message.SafetyObject);
    portBackgroundToExe.postMessage(message);
}

//关闭窗口
function messageQuit() {
    //DebugOut("bkjs - messageQuit");
    var message = { "Type": "quit" };
    portBackgroundToExe.postMessage(message);
}


/////////////////////////////////

function CleanAll(strHost) {
    //DebugOut("bkjs - CleanAll in."+strHost);
    CleanHistory(strHost);
    CleanCache(strHost);
    CleanCookie(strHost);
}

function CleanHistory(strHost) {
    //DebugOut("bkjs - CleanHistory in."+strHost);	
    var strMatch = strHost;
    var urlArray = new Array();
    urlArray[0] = "";
    var i = 0, j = 0;
    while (i < strMatch.length) {
        if (strMatch[i] != "|") { urlArray[j] += strMatch[i]; }
        else { j++; urlArray[j] = ""; }
        i++;
    }
    chrome.history.search({
        "text": "",
        "startTime": 0
    },
    function (historyItems) {
        for (k = 0; k < urlArray.length; k++) { strMatch = urlArray[k]; var strRegExp = ""; for (ki = 0; ki < strMatch.length; ki++) { if (strMatch[ki] == "*") { strRegExp += "/"; } strRegExp += strMatch[ki]; } if (strRegExp == "") { continue; } var strFind = new RegExp(strRegExp); for (var kj = 0; kj < historyItems.length; kj++) { var url = historyItems[kj].url; if (strFind.test(url)) { chrome.history.deleteUrl({ "url": url }); } } }
    })
}


function CleanCache(strHost) {
    DebugOut("bkjs - CleanCache in." + strHost);
    var strMatch = strHost;
    chrome.browsingData.remove({ "since": 0 }, { "appcache": false, "cache": true, "cookies": false, "downloads": false, "fileSystems": false, "formData": false, "history": false, "indexedDB": false, "localStorage": false, "pluginData": false, "passwords": false, "webSQL": false });

}


function CleanCookie(strHost) {
    DebugOut("bkjs - CleanCache in." + strHost);
    var strMatch = strHost;
    var urlArray = new Array(); urlArray[0] = ""; var i = 0, j = 0; while (i < strMatch.length) { if (strMatch[i] != "|") { urlArray[j] += strMatch[i]; } else { j++; urlArray[j] = ""; } i++; } chrome.cookies.getAll({}, function (cookies) { for (k = 0; k < urlArray.length; k++) { strMatch = ""; strMatch = urlArray[k]; var strRegExp = ""; for (i = 0; i < strMatch.length; i++) { if (strMatch[i] == "*") { continue; } strRegExp += strMatch[i]; } for (var j in cookies) { var domain = cookies[j].domain; if (!strRegExp || domain.indexOf(strRegExp) != -1) { var url = "http" + (cookies[j].secure ? "s" : "") + "://" + cookies[j].domain + cookies[j].path; chrome.cookies.remove({ "url": url, "name": cookies[j].name }); } } } })


}
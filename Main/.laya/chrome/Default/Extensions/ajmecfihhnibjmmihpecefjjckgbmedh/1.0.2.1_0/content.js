

var isCrxLoad = 0;
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

//以创建对象数组
var safeObjIDAry = new Array();

//显示对象数组
var showObjIdAry = new Array();

function ActivedObject(id,obj) {
    var my = this;
    my.id = id;
    my.inputValue = "";
    my.value = "";
    my.obj = obj;
}
var theActivedObj = null;

//定义contentjs与background通信的portContentToBackground
var portContentToBackground = chrome.extension.connect({name: "contentPage"});


//实现当页面退出时向exe发送quit消息
function onbeforeunload_handler() {
    DebugOut("onbeforeunload_handler...");
    //portContentToBackground.postMessage({Type: "quit"});//退出exe

    if (portContentToBackground != null) {
        portContentToBackground.postMessage({Type: "FreeActiveObject"});
    }
}
window.onbeforeunload = onbeforeunload_handler;

//实现当页面失去焦点时向exe发送释放活动对象消息
function onblurwindow_handler() {
    DebugOut("onblurwindow_handler...");

    if(theActivedObj != null){
    	theActivedObj.obj.blur();
    	theActivedObj = null;
    }

    if (portContentToBackground != null) {
        portContentToBackground.postMessage({ Type: "FreeActiveObject" });
    }
}  
window.onblur = onblurwindow_handler;

//---------------------------------js处理函数------------------------
function ShowObject(objId, isShow, IsPassword) {
    DebugOut("ShowObject " + objId + " " + IsPassword + " " + isShow + " ");

    if(theActivedObj != null){
    	theActivedObj.obj.blur();
    	theActivedObj = null;
    }

    try{
        var obj = document.getElementById(objId);

        if (obj != null) {
            if (isShow) {
                if (IsPassword == "1") {
                    obj.type = "password";
                }
                else {
                    obj.type = "text";
                }
                console.log("page show obj");
            } else {
                obj.type = "hidden";
                console.log("page hide obj");
            }
        }
        else if(obj == null){
            for (var i = 0; i < frames.length; i++) {
                try {
                    obj = frames[i].document.getElementById(objId);
                } catch (e) {
                    console.log("frames1 ex:"+e.name);
                }
                if (obj == null) {
                    try {
                        obj = frames[i].contentWindow.document.getElementById(objId);
                    } catch (e) {
                        console.log("frames1 ex:" + e.name);
                    }
                }

                if(obj != null){
                    if(isShow){
			        if (IsPassword == "1") {
			            obj.type = "password";
			        }
			        else {
			            obj.type = "text";
			        }
                        console.log("frames1 show obj");
                    } else {
                        obj.type = "hidden";
                        console.log("frames1 hide obj");
                    }
                    return;
                } else {
                    for (var j = 0; j < frames[i].frames.length; j++) {
                        try {
                            obj = frames[i].frames[j].document.getElementById(objId);
                        } catch (e) {
                            console.log("frames2 ex:" + e.name);
                        }

                        if (obj == null) {
                            try {
                                obj = frames[i].frames[j].contentWindow.document.getElementById(objId);
                            } catch (e) {
                                console.log("frames2 ex:" + e.name);
                            }
                        }

                        if (obj != null) {
                            if (isShow) {
                                if (IsPassword == "1") {
                                    obj.type = "password";
                                }
                                else {
                                    obj.type = "text";
                                }
                                console.log("frames2 show obj");
                            } else {
                                obj.type = "hidden";
                                console.log("frames2 hide obj");
                            }return;
                        } else {
                            for (var k = 0; k < frames[i].frames[j].frames.length; k++) {
                                try {
                                    obj = frames[i].frames[j].frames[k].document.getElementById(objId);
                                } catch (e) {
                                    console.log("frames3 ex:" + e.name);
                                }
                                
                                if (obj == null) {
                                    try {
                                        obj = frames[i].frames[j].frames[k].contentWindow.document.getElementById(objId);
                                    } catch (e) {
                                        console.log("frames3 ex:" + e.name);
                                    }
                                }

                                if (obj != null) {
                                    if (isShow) {
                                        if (IsPassword == "1") {
                                            obj.type = "password";
                                        }
                                        else {
                                            obj.type = "text";
                                        }   
                                        console.log("frames3 show obj");
                                    } else {
                                        obj.type = "hidden";
                                        console.log("frames3 hide obj");
                                    }return;
                                } else {                             
                            		for (var m = 0; m < frames[i].frames[j].frames[k].frames.length; m++) {
                            		    try {
                            		        obj = frames[i].frames[j].frames[k].frames[m].document.getElementById(objId);
                            		    } catch (e) {
                            		        console.log("frames4 ex:" + e.name);
                            		    }

                            		    if (obj == null) {
                            		        try {
                            		            obj = frames[i].frames[j].frames[k].frames[m].contentWindow.document.getElementById(objId);
                            		        } catch (e) {
                            		            console.log("frames4 ex:" + e.name);
                            		        }
                            		    }

		                                if (obj != null) {
		                                    if (isShow) {
		                                        if (IsPassword == "1") {
		                                            obj.type = "password";
		                                        }
		                                        else {
		                                            obj.type = "text";
		                                        }
		                                        console.log("frames4 show obj");
		                                    } else {
		                                        obj.type = "hidden";
		                                        console.log("frames4 hide obj");
		                                    }return;
		                                } else {
		                                    for (var n = 0; n < frames[i].frames[j].frames[k].frames[m].frames.length; n++) {
		                                        try {
		                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].document.getElementById(objId);
		                                        } catch (e) {
		                                            console.log("frames5 ex:" + e.name);
		                                        }

		                                        if (obj == null) {
		                                            try {
		                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].contentWindow.document.getElementById(objId);
		                                            } catch (e) {
		                                                console.log("frames5 ex:" + e.name);
		                                            }
		                                        }

			                                    if (obj != null) {
			                                        if (isShow) {
			                                            if (IsPassword == "1") {
			                                                obj.type = "password";
			                                            }
			                                            else {
			                                                obj.type = "text";
			                                            }
			                                            console.log("frames5 show obj");
			                                        } else {
			                                            obj.type = "hidden";
			                                            console.log("frames5 hide obj");
			                                        }return;
			                                    }  
											    else {
			                                        for (var n6 = 0; n6 < frames[i].frames[j].frames[k].frames[m].frames[n].frames.length; n6++) {
			                                            try {
			                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].document.getElementById(objId);
			                                            } catch (e) {
			                                                console.log("frames6 ex:" + e.name);
			                                            }

			                                            if (obj == null) {
			                                                try {
			                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].contentWindow.document.getElementById(objId);
			                                                } catch (e) {
			                                                    console.log("frames6 ex:" + e.name);
			                                                }
			                                            }

			                                            if (obj != null) {
			                                                if (isShow) {
			                                                    if (IsPassword == "1") {
			                                                        obj.type = "password";
			                                                    }
			                                                    else {
			                                                        obj.type = "text";
			                                                    }
			                                                    console.log("frames6 show obj");
			                                                } else {
			                                                    obj.type = "hidden";
			                                                    console.log("frames6 hide obj");
			                                                }return;
			                                            }
			                                            else
			                                            {
			                                                for (var n7 = 0; n7 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames.length; n7++) {
			                                                    try {
			                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].document.getElementById(objId);
			                                                    } catch (e) {
			                                                        console.log("frames7 ex:" + e.name);
			                                                    }

			                                                    if (obj == null) {
			                                                        try {
			                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].contentWindow.document.getElementById(objId);
			                                                        } catch (e) {
			                                                            console.log("frames7 ex:" + e.name);
			                                                        }
			                                                    }

			                                                    if (obj != null) {
			                                                        if (isShow) {
			                                                            if (IsPassword == "1") {
			                                                                obj.type = "password";
			                                                            }
			                                                            else {
			                                                                obj.type = "text";
			                                                            }
			                                                            console.log("frames7 show obj");
			                                                        } else {
			                                                            obj.type = "hidden";
			                                                            console.log("frames7 hide obj");
			                                                        }return;
			                                                    }
			                                                    else
			                                                    {
			                                                        for (var n8 = 0; n8 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames.length; n8++) {
			                                                            try {
			                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].document.getElementById(objId);
			                                                            } catch (e) {
			                                                                console.log("frames8 ex:" + e.name);
			                                                            }

			                                                            if (obj == null) {
			                                                                try {
			                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].contentWindow.document.getElementById(objId);
			                                                                } catch (e) {
			                                                                    console.log("frames8 ex:" + e.name);
			                                                                }
			                                                            }

			                                                            if (obj != null) {
			                                                                if (isShow) {
			                                                                    if (IsPassword == "1") {
			                                                                        obj.type = "password";
			                                                                    }
			                                                                    else {
			                                                                        obj.type = "text";
			                                                                    }
			                                                                    console.log("frames8 show obj");
			                                                                } else {
			                                                                    obj.type = "hidden";
			                                                                    console.log("frames8 hide obj");
			                                                                }return;
			                                                            }
			                                                            else
			                                                            {
			                                                                for (var n9 = 0; n9 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames.length; n9++) {
			                                                                    try {
			                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].document.getElementById(objId);
			                                                                    } catch (e) {
			                                                                        console.log("frames9 ex:" + e.name);
			                                                                    }

			                                                                    if (obj == null) {
			                                                                        try {
			                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].contentWindow.document.getElementById(objId);
			                                                                        } catch (e) {
			                                                                            console.log("frames9 ex:" + e.name);
			                                                                        }
			                                                                    }

			                                                                    if (obj != null) {
			                                                                        if (isShow) {
			                                                                            if (IsPassword == "1") {
			                                                                                obj.type = "password";
			                                                                            }
			                                                                            else {
			                                                                                obj.type = "text";
			                                                                            }
			                                                                            console.log("frames9 show obj");
			                                                                            console.log("frames9 show obj name：" + obj.name);
			                                                                        } else {
			                                                                            obj.type = "hidden";
			                                                                            console.log("frames9 hide obj");
			                                                                        } return;
			                                                                    }
			                                                                    else {
			                                                                        for (var n10 = 0; n10 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames.length; n10++) {
			                                                                            try {
			                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].document.getElementById(objId);
			                                                                            } catch (e) {
			                                                                                console.log("frames10 ex:" + e.name);
			                                                                            }

			                                                                            if (obj == null) {
			                                                                                try {
			                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].contentWindow.document.getElementById(objId);
			                                                                                } catch (e) {
			                                                                                    console.log("frames10 ex:" + e.name);
			                                                                                }
			                                                                            }

			                                                                            if (obj != null) {
			                                                                                if (isShow) {
			                                                                                    if (IsPassword == "1") {
			                                                                                        obj.type = "password";
			                                                                                    }
			                                                                                    else {
			                                                                                        obj.type = "text";
			                                                                                    }
			                                                                                    console.log("frames10 show obj");
			                                                                                } else {
			                                                                                    obj.type = "hidden";
			                                                                                    console.log("frames10 hide obj");
			                                                                                } return;
			                                                                            }
			                                                                            else {
			                                                                                for (var n11 = 0; n11 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames.length; n11++) {
			                                                                                    try {
			                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].document.getElementById(objId);
			                                                                                    } catch (e) {
			                                                                                        console.log("frames11 ex:" + e.name);
			                                                                                    }

			                                                                                    if (obj == null) {
			                                                                                        try {
			                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].contentWindow.document.getElementById(objId);
			                                                                                        } catch (e) {
			                                                                                            console.log("frames11 ex:" + e.name);
			                                                                                        }
			                                                                                    }

			                                                                                    if (obj != null) {
			                                                                                        if (isShow) {
			                                                                                            if (IsPassword == "1") {
			                                                                                                obj.type = "password";
			                                                                                            }
			                                                                                            else {
			                                                                                                obj.type = "text";
			                                                                                            }
			                                                                                            console.log("frames11 show obj");
			                                                                                            console.log("frames11 show obj name：" + obj.name);
			                                                                                        } else {
			                                                                                            obj.type = "hidden";
			                                                                                            console.log("frames11 hide obj");
			                                                                                        } return;
			                                                                                    }
			                                                                                    else {
			                                                                                        for (var n12 = 0; n12 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames.length; n12++) {
			                                                                                            try {
			                                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].document.getElementById(objId);
			                                                                                            } catch (e) {
			                                                                                                console.log("frames12 ex:" + e.name);
			                                                                                            }

			                                                                                            if (obj == null) {
			                                                                                                try {
			                                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].contentWindow.document.getElementById(objId);
			                                                                                                } catch (e) {
			                                                                                                    console.log("frames12 ex:" + e.name);
			                                                                                                }
			                                                                                            }

			                                                                                            if (obj != null) {
			                                                                                                if (isShow) {
			                                                                                                    if (IsPassword == "1") {
			                                                                                                        obj.type = "password";
			                                                                                                    }
			                                                                                                    else {
			                                                                                                        obj.type = "text";
			                                                                                                    }
			                                                                                                    console.log("frames12 show obj");
			                                                                                                } else {
			                                                                                                    obj.type = "hidden";
			                                                                                                    console.log("frames12 hide obj");
			                                                                                                } return;
			                                                                                            }
			                                                                                            else {
			                                                                                                for (var n13 = 0; n13 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames.length; n13++) {
			                                                                                                    try {
			                                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].document.getElementById(objId);
			                                                                                                    } catch (e) {
			                                                                                                        console.log("frames13 ex:" + e.name);
			                                                                                                    }

			                                                                                                    if (obj == null) {
			                                                                                                        try {
			                                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].contentWindow.document.getElementById(objId);
			                                                                                                        } catch (e) {
			                                                                                                            console.log("frames13 ex:" + e.name);
			                                                                                                        }
			                                                                                                    }

			                                                                                                    if (obj != null) {
			                                                                                                        if (isShow) {
			                                                                                                            if (IsPassword == "1") {
			                                                                                                                obj.type = "password";
			                                                                                                            }
			                                                                                                            else {
			                                                                                                                obj.type = "text";
			                                                                                                            }
			                                                                                                            console.log("frames13 show obj");
			                                                                                                        } else {
			                                                                                                            obj.type = "hidden";
			                                                                                                            console.log("frames13 hide obj");
			                                                                                                        } return;
			                                                                                                    }
			                                                                                                    else {
			                                                                                                        for (var n14 = 0; n14 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames.length; n14++) {
			                                                                                                            try {
			                                                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].document.getElementById(objId);
			                                                                                                            } catch (e) {
			                                                                                                                console.log("frames14 ex:" + e.name);
			                                                                                                            }

			                                                                                                            if (obj == null) {
			                                                                                                                try {
			                                                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].contentWindow.document.getElementById(objId);
			                                                                                                                } catch (e) {
			                                                                                                                    console.log("frames14 ex:" + e.name);
			                                                                                                                }
			                                                                                                            }

			                                                                                                            if (obj != null) {
			                                                                                                                if (isShow) {
			                                                                                                                    if (IsPassword == "1") {
			                                                                                                                        obj.type = "password";
			                                                                                                                    }
			                                                                                                                    else {
			                                                                                                                        obj.type = "text";
			                                                                                                                    }
			                                                                                                                    console.log("frames14 show obj");
			                                                                                                                    console.log("frames14 show obj name：" + obj.name);
			                                                                                                                } else {
			                                                                                                                    obj.type = "hidden";
			                                                                                                                    console.log("frames14 hide obj");
			                                                                                                                } return;
			                                                                                                            }
			                                                                                                            else {
			                                                                                                                for (var n15 = 0; n15 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].frames.length; n15++) {
			                                                                                                                    try {
			                                                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n15].document.getElementById(objId);
			                                                                                                                    } catch (e) {
			                                                                                                                        console.log("frames15 ex:" + e.name);
			                                                                                                                    }

			                                                                                                                    if (obj == null) {
			                                                                                                                        try {
			                                                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n15].contentWindow.document.getElementById(objId);
			                                                                                                                        } catch (e) {
			                                                                                                                            console.log("frames15 ex:" + e.name);
			                                                                                                                        }
			                                                                                                                    }

			                                                                                                                    if (obj != null) {
			                                                                                                                        if (isShow) {
			                                                                                                                            if (IsPassword == "1") {
			                                                                                                                                obj.type = "password";
			                                                                                                                            }
			                                                                                                                            else {
			                                                                                                                                obj.type = "text";
			                                                                                                                            }
			                                                                                                                            console.log("frames15 show obj");
			                                                                                                                        } else {
			                                                                                                                            obj.type = "hidden";
			                                                                                                                            console.log("frames15 hide obj");
			                                                                                                                        } return;
			                                                                                                                    }
			                                                                                                                    else {
			                                                                                                                        var subFramesLength = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].frames[n15].frames.length;
			                                                                                                                        DebugOut("you should go on(16) --- subFrames Length:" + subFramesLength);
			                                                                                                                    }
			                                                                                                                }
			                                                                                                            }
			                                                                                                        }
			                                                                                                    }
			                                                                                                }
			                                                                                            }
			                                                                                        }
			                                                                                    }
			                                                                                }
			                                                                            }
			                                                                        }
			                                                                    }
			                                                                }
			                                                          }
			                                                       }
			                                                     }
			                                                }
			                                               }
			                                            }
			                                    }
		                                    }
		                                }
                                    }                                
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        DebugOut(e.name);
    }
}


function ActiveObject(objId, isShow, IsPassword) {
    DebugOut("ActiveObject " + objId + " " + isShow + " " + IsPassword + " ");
    try {
        var obj = document.getElementById(objId);
        if (obj == null) {
            for (var i = 0; i < frames.length; i++) {                
                try {
                    obj = frames[i].document.getElementById(objId);
                } catch (e) {
                    console.log("frames1.1 ex:" + e.name);
                }
                if (obj == null) {
                    try {
                        obj = frames[i].contentWindow.document.getElementById(objId);
                    } catch (e) {
                        console.log("frames1 ex:" + e.name);
                    }
                }

                if (obj != null) {
                    if (isShow) {
                        theActivedObj = new ActivedObject(objId,obj);
                        console.log("frames1 show obj name：" + obj.name);
                        if (IsPassword == "1") {
                            obj.type = "password";
                        }
                        else {
                            obj.type = "text";
                        }
                        obj.focus();
                    } else {
                        obj.type = "hidden";
                        console.log("Active frames1 hide obj");
			            //obj.blur();
                    }return;
                } else {
                    for (var j = 0; j < frames[i].frames.length; j++) {                        
                        try {
                            obj = frames[i].frames[j].document.getElementById(objId);
                        } catch (e) {
                            console.log("frames2.1 ex:" + e.name);
                        }
                        if (obj == null) {
                            try {
                                obj = frames[i].frames[j].contentWindow.document.getElementById(objId);
                            } catch (e) {
                                console.log("frames2.2 ex:" + e.name);
                            }
                        }

                        if (obj != null) {
                            theActivedObj = new ActivedObject(objId, obj);
                            console.log("frames2 show obj name：" + obj.name);
                            if (isShow) {
                                if (IsPassword == "1") {
                                    obj.type = "password";
                                }
                                else {
                                    obj.type = "text";
                                }
                                obj.focus();
                            } else {
                                obj.type = "hidden";
                                console.log("Active frames2 hide obj");
                                obj.value = "";
				                //obj.blur();
                            }return;
                        } else {
                            for (var k = 0; k < frames[i].frames[j].frames.length; k++) {
                                try {
                                    obj = frames[i].frames[j].frames[k].document.getElementById(objId);
                                } catch (e) {
                                    console.log("frames3.1 ex:" + e.name);
                                }
                                if (obj == null) {
                                    try {
                                        obj = frames[i].frames[j].frames[k].contentWindow.document.getElementById(objId);
                                    } catch (e) {
                                        console.log("frames3.2 ex:" + e.name);
                                    }
                                }
                                if (obj != null) {
                                    theActivedObj = new ActivedObject(objId, obj);
                                    console.log("frames3 show obj name：" + obj.name);
                                    if (isShow) {
                                        if (IsPassword == "1") {
                                            obj.type = "password";
                                        }
                                        else {
                                            obj.type = "text";
                                        }
                                        obj.focus();
                                    } else {
                                        obj.type = "hidden";
                                        console.log("Active frames3 hide obj");
                                	    obj.value = "";
                                    }return;
                                } else {                           
                                    for (var m = 0; m < frames[i].frames[j].frames[k].frames.length; m++) {
                                        try {
                                            obj = frames[i].frames[j].frames[k].frames[m].document.getElementById(objId);
                                        } catch (e) {
                                            console.log("frames4.1 ex:" + e.name);
                                        }
                                        if (obj == null) {
                                            try {
                                                obj = frames[i].frames[j].frames[k].frames[m].contentWindow.document.getElementById(objId);
                                            } catch (e) {
                                                console.log("frames4.2 ex:" + e.name);
                                            }
                                        }
                                        if (obj != null) {
                                            theActivedObj = new ActivedObject(objId, obj);
                                            console.log("frames4 show obj name：" + obj.name);
                                            if (isShow) {
                                                if (IsPassword == "1") {
                                                    obj.type = "password";
                                                }
                                                else {
                                                    obj.type = "text";
                                                }                                                
                                                obj.focus();
                                            } else {
                                                obj.type = "hidden";
                                                console.log("Active frames4 hide obj");
						                        obj.value = "";
                                            }return;
                                        } else {
                                            for (var n = 0; n < frames[i].frames[j].frames[k].frames[m].frames.length; n++) {
                                                try {
                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].document.getElementById(objId);
                                                } catch (e) {
                                                    console.log("frames5.1 ex:" + e.name);
                                                }
                                                if (obj == null) {
                                                    try {
                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].contentWindow.document.getElementById(objId);
                                                    } catch (e) {
                                                        console.log("frames5.2 ex:" + e.name);
                                                    }
                                                }
                                                if (obj != null) {
                                                    theActivedObj = new ActivedObject(objId, obj);
                                                        console.log("frames5 show obj name：" + obj.name);
                                                    if (isShow) {
                                                        if (IsPassword == "1") {
                                                            obj.type = "password";
                                                        }
                                                        else {
                                                            obj.type = "text";
                                                        }
                                                        obj.focus();
                                                    } else {
                                                        obj.type = "hidden";
                                                        console.log("Active frames5 hide obj");
							                            obj.value = "";
                                                    }return;
                                                }
                                                else {
                                                    //var subFramesLength = frames[i].frames[j].frames[k].frames[m].frames[n].frames.length;
                                                    //DebugOut("you should go on(6) --- subFramesLength:" + subFramesLength);
                                                    for (var n6 = 0; n6 < frames[i].frames[j].frames[k].frames[m].frames[n].frames.length; n6++) {
                                                        try {
                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].document.getElementById(objId);
                                                        } catch (e) {
                                                            console.log("frames6 ex:" + e.name);
                                                        }

                                                        if (obj == null) {
                                                            try {
                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].contentWindow.document.getElementById(objId);
                                                            } catch (e) {
                                                                console.log("frames6 ex:" + e.name);
                                                            }
                                                        }

                                                        if (obj != null) {
                                                            theActivedObj = new ActivedObject(objId, obj);
                                                                console.log("frames6 show obj name：" + obj.name);
                                                            if (isShow) {
                                                                if (IsPassword == "1") {
                                                                    obj.type = "password";
                                                                }
                                                                else {
                                                                    obj.type = "text";
                                                                }
                                                                console.log("frames6 show obj");
                                                            } else {
                                                                obj.type = "hidden";
                                                                obj.value = "";
                                                                console.log("Active frames6 hide obj");
                                                            } return;
                                                        }
                                                        else {
                                                            for (var n7 = 0; n7 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames.length; n7++) {
                                                                try {
                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].document.getElementById(objId);
                                                                } catch (e) {
                                                                    console.log("frames7 ex:" + e.name);
                                                                }

                                                                if (obj == null) {
                                                                    try {
                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].contentWindow.document.getElementById(objId);
                                                                    } catch (e) {
                                                                        console.log("frames7 ex:" + e.name);
                                                                    }
                                                                }

                                                                if (obj != null) {
                                                                    theActivedObj = new ActivedObject(objId, obj);
                                                                        console.log("frames7 show obj name：" + obj.name);
                                                                    if (isShow) {
                                                                        if (IsPassword == "1") {
                                                                            obj.type = "password";
                                                                        }
                                                                        else {
                                                                            obj.type = "text";
                                                                        }
                                                                        console.log("frames7 show obj");
                                                                    } else {
                                                                        obj.type = "hidden";
                                                                        obj.value = "";
                                                                        console.log("Active frames7 hide obj");
                                                                    } return;
                                                                }
                                                                else {
                                                                    for (var n8 = 0; n8 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames.length; n8++) {
                                                                        try {
                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].document.getElementById(objId);
                                                                        } catch (e) {
                                                                            console.log("frames8 ex:" + e.name);
                                                                        }

                                                                        if (obj == null) {
                                                                            try {
                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].contentWindow.document.getElementById(objId);
                                                                            } catch (e) {
                                                                                console.log("frames8 ex:" + e.name);
                                                                            }
                                                                        }

                                                                        if (obj != null) {
                                                                            theActivedObj = new ActivedObject(objId, obj);
                                                                            if (isShow) {
                                                                                if (IsPassword == "1") {
                                                                                    obj.type = "password";
                                                                                }
                                                                                else {
                                                                                    obj.type = "text";
                                                                                }
                                                                                console.log("frames8 show obj");
                                                                                console.log("frames8 show obj name：" + obj.name);
                                                                            } else {
                                                                                obj.type = "hidden";
                                                                                obj.value = "";
                                                                                console.log("Active frames8 hide obj");
                                                                            } return;
                                                                        }
                                                                        else {
                                                                            for (var n9 = 0; n9 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames.length; n9++) {
                                                                                try {
                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].document.getElementById(objId);
                                                                                } catch (e) {
                                                                                    console.log("frames9 ex:" + e.name);
                                                                                }

                                                                                if (obj == null) {
                                                                                    try {
                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].contentWindow.document.getElementById(objId);
                                                                                    } catch (e) {
                                                                                        console.log("frames9 ex:" + e.name);
                                                                                    }
                                                                                }

                                                                                if (obj != null) {
                                                                                    theActivedObj = new ActivedObject(objId, obj);
                                                                                    if (isShow) {
                                                                                        if (IsPassword == "1") {
                                                                                            obj.type = "password";
                                                                                        }
                                                                                        else {
                                                                                            obj.type = "text";
                                                                                        }
                                                                                        console.log("frames9 show obj");
                                                                                        console.log("frames9 show obj name：" + obj.name);
                                                                                    } else {
                                                                                        obj.type = "hidden";
                                                                                        obj.value = "";
                                                                                        console.log("Active frames9 hide obj");
                                                                                    } return;
                                                                                }
                                                                                else {
                                                                                    for (var n10 = 0; n10 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames.length; n10++) {
                                                                                        try {
                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].document.getElementById(objId);
                                                                                        } catch (e) {
                                                                                            console.log("frames10 ex:" + e.name);
                                                                                        }

                                                                                        if (obj == null) {
                                                                                            try {
                                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].contentWindow.document.getElementById(objId);
                                                                                            } catch (e) {
                                                                                                console.log("frames10 ex:" + e.name);
                                                                                            }
                                                                                        }

                                                                                        if (obj != null) {
                                                                                            theActivedObj = new ActivedObject(objId, obj);
                                                                                            if (isShow) {
                                                                                                if (IsPassword == "1") {
                                                                                                    obj.type = "password";
                                                                                                }
                                                                                                else {
                                                                                                    obj.type = "text";
                                                                                                }
                                                                                                console.log("frames10 show obj");
                                                                                                console.log("frames10 show obj name：" + obj.name);
                                                                                            } else {
                                                                                                obj.type = "hidden";
                                                                                                obj.value = "";
                                                                                                console.log("Active frames10 hide obj");
                                                                                            } return;
                                                                                        }
                                                                                        else {
                                                                                            for (var n11 = 0; n11 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames.length; n11++) {
                                                                                                try {
                                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].document.getElementById(objId);
                                                                                                } catch (e) {
                                                                                                    console.log("frames11 ex:" + e.name);
                                                                                                }

                                                                                                if (obj == null) {
                                                                                                    try {
                                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].contentWindow.document.getElementById(objId);
                                                                                                    } catch (e) {
                                                                                                        console.log("frames11 ex:" + e.name);
                                                                                                    }
                                                                                                }

                                                                                                if (obj != null) {
                                                                                                    theActivedObj = new ActivedObject(objId, obj);
                                                                                                    if (isShow) {
                                                                                                        if (IsPassword == "1") {
                                                                                                            obj.type = "password";
                                                                                                        }
                                                                                                        else {
                                                                                                            obj.type = "text";
                                                                                                        }      
                                                                                                        console.log("frames11 show obj");
                                                                                                        console.log("frames11 show obj name：" + obj.name);
                                                                                                    } else {
                                                                                                        obj.type = "hidden";
                                                                                                        obj.value = "";
                                                                                                        console.log("Active frames11 hide obj");
                                                                                                    } return;
                                                                                                }
                                                                                                else {
                                                                                                    for (var n12 = 0; n12 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames.length; n12++) {
                                                                                                        try {
                                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].document.getElementById(objId);
                                                                                                        } catch (e) {
                                                                                                            console.log("frames12 ex:" + e.name);
                                                                                                        }

                                                                                                        if (obj == null) {
                                                                                                            try {
                                                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].contentWindow.document.getElementById(objId);
                                                                                                            } catch (e) {
                                                                                                                console.log("frames12 ex:" + e.name);
                                                                                                            }
                                                                                                        }

                                                                                                        if (obj != null) {
                                                                                                            theActivedObj = new ActivedObject(objId, obj);
                                                                                                            if (isShow) {
                                                                                                                if (IsPassword == "1") {
                                                                                                                    obj.type = "password";
                                                                                                                }
                                                                                                                else {
                                                                                                                    obj.type = "text";
                                                                                                                }
                                                                                                                console.log("frames12 show obj");
                                                                                                                console.log("frames12 show obj name：" + obj.name);
                                                                                                            } else {
                                                                                                                obj.type = "hidden";
                                                                                                                obj.value = "";
                                                                                                                console.log("Active frames12 hide obj");
                                                                                                            } return;
                                                                                                        }
                                                                                                        else {
                                                                                                            for (var n13 = 0; n13 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames.length; n13++) {
                                                                                                                try {
                                                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].document.getElementById(objId);
                                                                                                                } catch (e) {
                                                                                                                    console.log("frames13 ex:" + e.name);
                                                                                                                }

                                                                                                                if (obj == null) {
                                                                                                                    try {
                                                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].contentWindow.document.getElementById(objId);
                                                                                                                    } catch (e) {
                                                                                                                        console.log("frames13 ex:" + e.name);
                                                                                                                    }
                                                                                                                }

                                                                                                                if (obj != null) {
                                                                                                                    theActivedObj = new ActivedObject(objId, obj);
                                                                                                                    if (isShow) {
                                                                                                                        if (IsPassword == "1") {
                                                                                                                            obj.type = "password";
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            obj.type = "text";
                                                                                                                        }
                                                                                                                        console.log("frames13 show obj");
                                                                                                                        console.log("frames13 show obj name：" + obj.name);
                                                                                                                    } else {
                                                                                                                        obj.type = "hidden";
                                                                                                                        obj.value = "";
                                                                                                                        console.log("Active frames13 hide obj");
                                                                                                                    } return;
                                                                                                                }
                                                                                                                else {
                                                                                                                    for (var n14 = 0; n14 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames.length; n14++) {
                                                                                                                        try {
                                                                                                                            obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].document.getElementById(objId);
                                                                                                                        } catch (e) {
                                                                                                                            console.log("frames14 ex:" + e.name);
                                                                                                                        }

                                                                                                                        if (obj == null) {
                                                                                                                            try {
                                                                                                                                obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].contentWindow.document.getElementById(objId);
                                                                                                                            } catch (e) {
                                                                                                                                console.log("frames14 ex:" + e.name);
                                                                                                                            }
                                                                                                                        }

                                                                                                                        if (obj != null) {
                                                                                                                            theActivedObj = new ActivedObject(objId, obj);
                                                                                                                            if (isShow) {
                                                                                                                                if (IsPassword == "1") {
                                                                                                                                    obj.type = "password";
                                                                                                                                }
                                                                                                                                else {
                                                                                                                                    obj.type = "text";
                                                                                                                                }
                                                                                                                                console.log("frames14 show obj");
                                                                                                                                console.log("frames14 show obj name：" + obj.name);
                                                                                                                            } else {
                                                                                                                                obj.type = "hidden";
                                                                                                                                obj.value = "";
                                                                                                                                console.log("Active frames14 hide obj");
                                                                                                                            } return;
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            for (var n15 = 0; n15 < frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].frames.length; n15++) {
                                                                                                                                try {
                                                                                                                                    obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n15].document.getElementById(objId);
                                                                                                                                } catch (e) {
                                                                                                                                    console.log("frames15 ex:" + e.name);
                                                                                                                                }

                                                                                                                                if (obj == null) {
                                                                                                                                    try {
                                                                                                                                        obj = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n15].contentWindow.document.getElementById(objId);
                                                                                                                                    } catch (e) {
                                                                                                                                        console.log("frames15 ex:" + e.name);
                                                                                                                                    }
                                                                                                                                }

                                                                                                                                if (obj != null) {
                                                                                                                                    theActivedObj = new ActivedObject(objId, obj);
                                                                                                                                    if (isShow) {
                                                                                                                                        if (IsPassword == "1") {
                                                                                                                                            obj.type = "password";
                                                                                                                                        }
                                                                                                                                        else {
                                                                                                                                            obj.type = "text";
                                                                                                                                        }
                                                                                                                                        console.log("frames15 show obj");
                                                                                                                                        console.log("frames15 show obj name：" + obj.name);
                                                                                                                                    } else {
                                                                                                                                        obj.type = "hidden";
                                                                                                                                        obj.value = "";
                                                                                                                                        console.log("Active frames15 hide obj");
                                                                                                                                    } return;
                                                                                                                                }
                                                                                                                                else {
                                                                                                                                    var subFramesLength = frames[i].frames[j].frames[k].frames[m].frames[n].frames[n6].frames[n7].frames[n8].frames[n9].frames[n10].frames[n11].frames[n12].frames[n13].frames[n14].frames[n15].frames.length;
                                                                                                                                    DebugOut("you should go on(16) --- subFrames Length:" + subFramesLength);
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            if (isShow) {
                theActivedObj = new ActivedObject(objId, obj);
                console.log("frames0 show obj name：" + obj.name);
                if (IsPassword == "1") {
                    obj.type = "password";
                }
                else {
                    obj.type = "text";
                }
                obj.focus();
            } else {
                obj.type = "hidden";
            }
        }
    } catch (e) {
        DebugOut(e.name);
    }
}


//---------------------------------js监听函数------------------------
//document.addEventListener('MS_ICBC_Event', function (evt) {
//  		var msgType = evt.detail;
//		//DebugOut("document.addEventListener in  msgType:"+msgType);
//  		if(msgType == "checkCrxRun"){
//			//DebugOut("document.addEventListener in  checkCrxRun");
//			//message = {"Type":"isCrxLoad"};
//			//portContentToBackground.postMessage(message);
//						
//    		clearInterval(checkCrxTimer);
//			checkCrxTimer = setInterval(function checkTime() {	
//	            if(isCrxLoad<=5 && portContentToBackground != null){	
//		            isCrxLoad++;
//		            portContentToBackground.postMessage({"Type":"isCrxLoad"});	
//	            }else{		
//		            for(var i = 0; i < safeObjIDAry.length; i++)
//		            {
//			            try{
//					        DebugOut("hidden1 ");
//					        ShowObject(safeObjIDAry[i],false);
//			            }catch(e){					
//					        DebugOut(e.name);
//				        }
//		            }
//		            //portContentToBackground = chrome.extension.connect({name: "contentPage"});
//	            }	
//            }, 3000);
//  		}

//},false);


function showObj(id, isShow, isPassword) {
    var my = this;
    my.EnableObjId = id;
    my.IsShow = false;
    my.IsPassword = isPassword;
}

function ShowAllInputObject() {
    for (var i = 0; i < showObjIdAry.length; i++) {
        if (!showObjIdAry[i].IsShow) {
            try {
                ShowObject(showObjIdAry[i].EnableObjId, true, showObjIdAry[i].IsPassword);
                //TODO:check return v
                showObjIdAry[i].IsShow = true;
            } catch (e) {
                DebugOut(e.name);
            }
        }
    }
}

function HideAllInputObject() {
    for (var i = 0; i < safeObjIDAry.length; i++) {
        try {
            ShowObject(safeObjIDAry[i], false);
        } catch (e) {
            DebugOut(e.name);
        }
    }
}


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
            if (isCrxLoad <= 5) {
                if (portContentToBackground != null) {
                    ShowAllInputObject();
                    isCrxLoad++;
                    portContentToBackground.postMessage({ "Type": "isCrxLoad" });
                }
            } else {
                DebugOut("Crx UnLoad, Hide All Inputbox");
                HideAllInputObject();
            }
        }, 1000);     //TODO:1000-3000
    }
}, 50);


//contentjs监听backgroundjs函数
portContentToBackground.onMessage.addListener(function (msg) {
    //DebugOut("contentjs监听backgroundjs - msg.type: "+ msg.Type + " msg.question:" + msg.question + " msg.embedID:" + msg.embedID ); 
    if (msg.Type == "Reply") {
        isCrxLoad = 0;
    }
    else if (msg.Type == "ActiveObj") {
        ActiveObject(msg.ObjId, true, msg.IsPassword);
    }
    else if (msg.Type == "UnActiveObj") {
        //ActiveObject(msg.ObjId, false, false);
        theActivedObj = null;
        ShowObject(msg.ObjId, false, false);
    }
    else if (msg.Type == "setObjAction") {
        if (msg.embedID != undefined) {
            for (var i = 0; i < safeObjIDAry.length; i++) {
                if (msg.embedID == safeObjIDAry[i]) {
                    return;
                }
            }
            //DebugOut("setObjAction :" + msg.embedID);
            safeObjIDAry.push(msg.embedID);
        }
        else if (msg.embedIDs != undefined) {
            var strIDs = safeObjIDAry.join(",");
            var idArray = msg.embedIDs.split(",");
            //DebugOut("setObjAction embedIDs:" + msg.embedIDs);
            if (strIDs != "") {
                for (var i = 0; i < idArray.length; i++) {
                    if (strIDs.indexOf(idArray[i]) == -1) {
                        safeObjIDAry.push(idArray[i]);
                        //DebugOut("setObjAction :" + idArray[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < idArray.length; i++) {
                    safeObjIDAry.push(idArray[i]);
                    //DebugOut("setObjAction :" + idArray[i]);
                }
            }
        }
    }
    else if (msg.question == "disable") {
        DebugOut("Crx found exe exited,HideAllInputObject");
        HideAllInputObject();
    }
    else if (msg.question == "null") {
        ShowObject(embedID, true, false);
    }
    else if (msg.Type == "dbgout") {
        console.log(msg.outinf);
    }
    else if (msg.Type == "Notify") {
        //alert("cntnt - msg.Notify:"+msg.inf);
        //NotifyInfo(msg.inf);
    }
    else if (msg.Type == "EnableObj") {
        DebugOut("content rcv EnableObjObject:" + JSON.stringify(msg));
        try {
            //storeObjectID(msg.EnableObjId);
            var obj = new showObj(msg.EnableObjId, false, msg.IsPassword);
            showObjIdAry.push(obj);
            DebugOut("content rcv ShowObject:" + JSON.stringify(msg.EnableObjId));
            ShowObject(msg.EnableObjId, true, msg.IsPassword);
        } catch (e) { }
    }
    else if (msg.Type == "replayVerifyCode") {
        DebugOut("contentjs rcv backgroundjs msg: " + JSON.stringify(msg));
        if (theActivedObj != null) {
            theActivedObj.inputValue += msg.verifyCode;
            theActivedObj.obj.value = theActivedObj.inputValue;
            DebugOut("theActivedObj value: " + theActivedObj.value);
        } else {
            console.error("Rcv input char,No ActivedObj Found!");
        }
    }
    else if (msg.Type == "resetValue") {
        DebugOut("contentjs rcv backgroundjs msg: " + JSON.stringify(msg));
        if (theActivedObj != null) {
            theActivedObj.inputValue = msg.Value;
            theActivedObj.obj.value = theActivedObj.inputValue;
        } else {
            console.error("Rcv resetValue,No ActivedObj Found!");
        }
    }
    else {
        DebugOut("contentjs rcv backgroundjs msg: " + JSON.stringify(msg));
    }

    if (msg.question == "disable") {
        var len = safeObjIDAry.length;
        for (var i = 0; i < len; i++) {
            try {
                ShowObject(safeObjIDAry[i], false, false);
            } catch (e) {
                DebugOut(e.name);
            }
        }
    }
});


DebugOut("contentjs end");
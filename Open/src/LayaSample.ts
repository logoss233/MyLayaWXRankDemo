import WebGL = Laya.WebGL;
// 程序入口
class GameMain{
    constructor()
    {
        Laya.MiniAdpter.init(true,true)
        Laya.init(1136,640);
        Laya.stage.scaleMode="noscale"
        //初始化子域对主域消息接收
        this.MessageInit()
        

    }

    //加载资源，等待主域加载完资源完后来调用它
    loadAsset(){
        var asset=[
            "res/atlas/comp.atlas"
        ]

        Laya.loader.load(asset,Laya.Handler.create(this,this.onLoaded))
    }
    onLoaded(){
        var view=new ui.uiUI()
        Laya.stage.addChild(view)


        
    }


    //初始化对主域消息的接收
    MessageInit(){
        //接收主域透传的数据
			if(Laya.Browser.onMiniGame)
			{
                let wx=Laya.Browser.window.wx
                let sharedCanvas=wx.getSharedCanvas()
                let MiniFileMgr=laya.wx.mini.MiniFileMgr

				wx.onMessage(function(message):void{
					console.log(message);
					if(message.isLoad == "filedata")
					{
                        
						MiniFileMgr.ziyuFileData[message.url] = message.data;//文本数据
					}else if(message.isLoad == "filenative")
					{
						//子域接收主域传递的文件信息
						if(message.isAdd)
							MiniFileMgr.filesListObj[message.url] = message.data;
						else
							delete MiniFileMgr.filesListObj[message.url];
					}else if (message.type == "resizeShared")
					{
						sharedCanvas.width = message.data.width;
						sharedCanvas.height = message.data.height;
						var tempMatrix = message.data.matrix;
						var matrix:Laya.Matrix = new Laya.Matrix();
						matrix.a = tempMatrix.a;
						matrix.b = tempMatrix.b;
						matrix.c = tempMatrix.c;
						matrix.d = tempMatrix.d;
						Laya.stage._canvasTransform = matrix;//重新设置矩阵
					}else if(message.cmd=="loadRes"){
                        this.loadAsset()
                    }
				});
			}
    }




}




new GameMain();
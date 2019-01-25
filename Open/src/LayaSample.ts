// 程序入口
class GameMain{
    constructor()
    {
        Laya.MiniAdpter.init(true,true)
        Laya.init(1136,640);
        Laya.stage.scaleMode=Laya.Stage.SCALE_EXACTFIT
        //初始化子域对主域消息接收
        this.MessageInit()
        
        //生成ui页面
        var rankView=new RankView()
        Laya.stage.addChild(rankView)

    }

    //加载资源，等待主域加载完资源完后来调用它  
    //由于没有用到资源，暂时不需要
    // loadAsset(){
    //     var asset=[
    //         "res/atlas/comp.atlas",
    //     ]

    //     Laya.loader.load(asset,Laya.Handler.create(this,this.onLoaded))
    // }
    // onLoaded(){
    //     var rankView=new RankView()
    //     Laya.stage.addChild(rankView)       
    // }


    //初始化对主域消息的接收
    MessageInit(){
        //接收主域透传的数据
			if(Laya.Browser.onMiniGame)
			{
                let wx=Laya.Browser.window.wx
                let MiniFileMgr=laya.wx.mini.MiniFileMgr

				wx.onMessage(message=>{
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
						var tempMatrix = message.data.matrix;
						var matrix:Laya.Matrix = new Laya.Matrix();
						matrix.a = tempMatrix.a;
						matrix.b = tempMatrix.b;
						matrix.c = tempMatrix.c;
						matrix.d = tempMatrix.d;
						Laya.stage._canvasTransform = matrix;//重新设置矩阵
					}
                    else if(message.cmd=="loadRes"){
                        //this.loadAsset()
                        //由于没有用到资源，暂时不需要
                    }else if(message.cmd=="setScore"){
                        this.setWeekScore(message.score)
                    }else if(message.cmd="showRank"){
                        //开启，刷新
                        $rankView.showRankList()   
                    }
				});
			}
    }

    //获取时间戳
    public getMondayTimestamp():number
    {
        let newDate = new Date();
        let day = newDate.getDay();
        let hour = newDate.getHours();
        let minute = newDate.getMinutes();
        let second = newDate.getSeconds();
        let diffSeconds = ((7 + day - 1) % 7) * 24 * 3600 + hour * 3600 + minute * 60 + second;
        let timestamp = newDate.valueOf()/1000 - diffSeconds;
        //console.log((new Date(timestamp * 1000)).toLocaleDateString());
        return timestamp;
    }

    //设置分数
    protected setWeekScore(score):void
    {
        if (Laya.Browser.onMiniGame) {
            let wx = Laya.Browser.window.wx;
            let mondayTimestamp = this.getMondayTimestamp();
            wx.getUserCloudStorage({
                keyList: ['week_score'], // 你要获取的、托管在微信后台的key
                success: res => {
                    let nowNum:number = 0;
                    let kvLen = res["KVDataList"].length;
                    for (let j = 0; j < kvLen; j++) {
                        if (res["KVDataList"][j]["key"] == 'week_score') {
                            let valueJson = JSON.parse(res["KVDataList"][j]["value"]);
                            if (valueJson["wxgame"]["update_time"] >= mondayTimestamp) { //是本周的
                                nowNum = valueJson["wxgame"]["score"];
                            }
                            break;
                        }
                    }

                    //修改分数
                    if (score<nowNum){
                        return
                    }
                    nowNum=score
                    wx.setUserCloudStorage({
                        KVDataList: [{ "key": 'week_score', "value": JSON.stringify({"wxgame":{"score":nowNum,"update_time": Math.round((new Date()).valueOf()/1000)}}) }],
                        success: res => {
                            console.log("设置周数据成功，" + res);
                        },
                        fail: res => {
                            console.log("设置周数据失败，" + res);
                        }
                    });
                }
            });
        }
    }


}




var $gameMain=new GameMain();
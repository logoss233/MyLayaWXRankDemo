// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.MiniAdpter.init(true, true);
        Laya.init(1136, 640);
        Laya.stage.scaleMode = "noscale";
        //初始化子域对主域消息接收
        this.MessageInit();
        //生成ui页面
        var rankView = new RankView();
        Laya.stage.addChild(rankView);
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
    GameMain.prototype.MessageInit = function () {
        var _this = this;
        //接收主域透传的数据
        if (Laya.Browser.onMiniGame) {
            var wx = Laya.Browser.window.wx;
            var MiniFileMgr_1 = laya.wx.mini.MiniFileMgr;
            wx.onMessage(function (message) {
                console.log(message);
                if (message.isLoad == "filedata") {
                    MiniFileMgr_1.ziyuFileData[message.url] = message.data; //文本数据
                }
                else if (message.isLoad == "filenative") {
                    //子域接收主域传递的文件信息
                    if (message.isAdd)
                        MiniFileMgr_1.filesListObj[message.url] = message.data;
                    else
                        delete MiniFileMgr_1.filesListObj[message.url];
                }
                else if (message.type == "resizeShared") {
                    var tempMatrix = message.data.matrix;
                    var matrix = new Laya.Matrix();
                    matrix.a = tempMatrix.a;
                    matrix.b = tempMatrix.b;
                    matrix.c = tempMatrix.c;
                    matrix.d = tempMatrix.d;
                    Laya.stage._canvasTransform = matrix; //重新设置矩阵
                }
                else if (message.cmd == "loadRes") {
                    //this.loadAsset()
                    //由于没有用到资源，暂时不需要
                }
                else if (message.cmd == "setScore") {
                    _this.setWeekScore(message.score);
                }
                else if (message.cmd = "showRank") {
                    //开启，刷新
                    $rankView.showRankList();
                }
            });
        }
    };
    //获取时间戳
    GameMain.prototype.getMondayTimestamp = function () {
        var newDate = new Date();
        var day = newDate.getDay();
        var hour = newDate.getHours();
        var minute = newDate.getMinutes();
        var second = newDate.getSeconds();
        var diffSeconds = ((7 + day - 1) % 7) * 24 * 3600 + hour * 3600 + minute * 60 + second;
        var timestamp = newDate.valueOf() / 1000 - diffSeconds;
        //console.log((new Date(timestamp * 1000)).toLocaleDateString());
        return timestamp;
    };
    //设置分数
    GameMain.prototype.setWeekScore = function (score) {
        if (Laya.Browser.onMiniGame) {
            var wx_1 = Laya.Browser.window.wx;
            var mondayTimestamp_1 = this.getMondayTimestamp();
            wx_1.getUserCloudStorage({
                keyList: ['week_score'],
                success: function (res) {
                    var nowNum = 0;
                    var kvLen = res["KVDataList"].length;
                    for (var j = 0; j < kvLen; j++) {
                        if (res["KVDataList"][j]["key"] == 'week_score') {
                            var valueJson = JSON.parse(res["KVDataList"][j]["value"]);
                            if (valueJson["wxgame"]["update_time"] >= mondayTimestamp_1) { //是本周的
                                nowNum = valueJson["wxgame"]["score"];
                            }
                            break;
                        }
                    }
                    //修改分数
                    if (score < nowNum) {
                        return;
                    }
                    nowNum = score;
                    wx_1.setUserCloudStorage({
                        KVDataList: [{ "key": 'week_score', "value": JSON.stringify({ "wxgame": { "score": nowNum, "update_time": Math.round((new Date()).valueOf() / 1000) } }) }],
                        success: function (res) {
                            console.log("设置周数据成功，" + res);
                        },
                        fail: function (res) {
                            console.log("设置周数据失败，" + res);
                        }
                    });
                }
            });
        }
    };
    return GameMain;
}());
var $gameMain = new GameMain();
//# sourceMappingURL=LayaSample.js.map
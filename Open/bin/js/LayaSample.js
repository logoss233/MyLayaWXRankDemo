// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.MiniAdpter.init(true, true);
        Laya.init(1136, 640);
        Laya.stage.scaleMode = "noscale";
        //初始化子域对主域消息接收
        this.MessageInit();
        //等待后读取资源
        Laya.timer.once(1000, this, this.loadAsset);
    }
    //加载资源，等待主域加载完资源完后来调用它
    GameMain.prototype.loadAsset = function () {
        var asset = [
            "res/atlas/comp.atlas"
        ];
        Laya.loader.load(asset, Laya.Handler.create(this, this.onLoaded));
    };
    GameMain.prototype.onLoaded = function () {
        var view = new ui.uiUI();
        Laya.stage.addChild(view);
    };
    //初始化对主域消息的接收
    GameMain.prototype.MessageInit = function () {
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
                //else if(message.cmd=="loadRes"){
                //    this.loadAsset()
                //}
            });
        }
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map
import WebGL = Laya.WebGL;
// 程序入口
class GameMain{
    constructor()
    {
        Laya.MiniAdpter.init(true,false)
        Laya.init(1136,640, WebGL);
        Laya.stage.scaleMode="noscale"

        //设置共享画布
        if (Laya.Browser.onMiniGame)
			{
				Laya.timer.once(1000, this, function():void{
                    let wx=Laya.Browser.window.wx
                    let sharedCanvas=wx.getSharedCanvas()
					//设置共享画布大小
					sharedCanvas.width = Laya.stage.width;
					sharedCanvas.height = Laya.stage.height;
					//主域往子域透传消息
					wx.postMessage({type:"resizeShared",url:"",data:{width:Laya.stage.width,height:Laya.stage.height,matrix:Laya.stage._canvasTransform},isLoad:false});
				});
			}




        this.loadAsset()
    }
    loadAsset(){
        var asset=[
            "res/atlas/comp.atlas"
        ]

        Laya.loader.load(asset,Laya.Handler.create(this,this.onLoaded))
    }
    onLoaded(){
        //通知子域加载资源
        if (Laya.Browser.onMiniGame){
            Laya.Browser.window.wx.getOpenDataContext().postMessage({"cmd":"loadRes"}) 
        }
        //等待一会儿再开始初始化
        Laya.timer.once(3000, this, this.start)
    }
    start(){
        //主域自己的ui
        var view=new ui.uiUI()
        Laya.stage.addChild(view)

        if (Laya.Browser.onMiniGame){
            //子域显示
            var sprite:Laya.Sprite = new Laya.Sprite();
            sprite.pos(0, 0);
            var texture:Laya.Texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
            texture.bitmap.alwaysChange = true;//小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true
            sprite.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
            Laya.stage.addChild(sprite);
        }
        
    }
}
new GameMain();
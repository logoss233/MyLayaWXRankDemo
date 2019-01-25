
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class rankUI extends View {
		public rankList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":1136,"top":0,"left":0,"height":640},"child":[{"type":"Rect","props":{"y":26,"x":288,"width":505,"lineWidth":1,"height":531,"fillColor":"#233b2d"}},{"type":"List","props":{"y":94,"x":313,"width":464,"var":"rankList","height":401},"child":[{"type":"Box","props":{"width":464,"renderType":"render","height":88},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":464,"lineWidth":0,"height":86,"fillColor":"#c1c0ba"}},{"type":"Image","props":{"y":8,"x":89,"width":70,"name":"avatar","height":70}},{"type":"Text","props":{"y":23,"x":-52,"width":120,"text":"1","overflow":"hidden","name":"rankLabel","height":26,"fontSize":40,"font":"SimSun","color":"#84592E","align":"right"}},{"type":"Text","props":{"y":30,"x":170,"width":120,"text":"1","overflow":"hidden","name":"nickname","height":26,"fontSize":26,"font":"SimSun","color":"#84592E","align":"left"}},{"type":"Text","props":{"y":10,"x":298,"width":81,"text":"总分:","name":"scoreText","height":26,"fontSize":26,"font":"SimSun","color":"#BA9F7B","align":"left"}},{"type":"Text","props":{"y":10,"x":366,"width":89,"text":"99999","name":"scoreNum","height":26,"fontSize":26,"font":"SimSun","color":"#F07538","align":"center"}},{"type":"Text","props":{"y":47,"x":307,"width":134,"text":"2018/7/5","overflow":"hidden","name":"dateString","height":26,"fontSize":26,"font":"SimSun","color":"#BA9F7B","align":"right"}}]}]},{"type":"Text","props":{"y":39,"x":481,"text":"排行榜","fontSize":40,"color":"#ffffff"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.rankUI.uiView);

        }

    }
}


import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class uiUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Text","props":{"y":273,"x":457,"width":308,"text":"子域","height":126,"fontSize":50,"color":"#4cef00"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.uiUI.uiView);

        }

    }
}


import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class uiUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"Text","props":{"y":0,"x":0,"width":315,"text":"主域","height":88,"fontSize":60,"color":"#21d908"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.uiUI.uiView);

        }

    }
}

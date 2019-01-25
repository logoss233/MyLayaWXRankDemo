var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var uiUI = /** @class */ (function (_super) {
        __extends(uiUI, _super);
        function uiUI() {
            return _super.call(this) || this;
        }
        uiUI.prototype.createChildren = function () {
            View.regComponent("Text", laya.display.Text);
            _super.prototype.createChildren.call(this);
            this.createView(ui.uiUI.uiView);
        };
        uiUI.uiView = { "type": "View", "props": { "width": 1136, "height": 640 }, "child": [{ "type": "Text", "props": { "y": 273, "x": 457, "width": 308, "text": "子域", "height": 126, "fontSize": 50, "color": "#4cef00" } }, { "type": "Image", "props": { "y": 179, "x": 592, "skin": "comp/image.png" } }] };
        return uiUI;
    }(View));
    ui.uiUI = uiUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map
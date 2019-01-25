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
    var rankUI = /** @class */ (function (_super) {
        __extends(rankUI, _super);
        function rankUI() {
            return _super.call(this) || this;
        }
        rankUI.prototype.createChildren = function () {
            View.regComponent("Text", laya.display.Text);
            _super.prototype.createChildren.call(this);
            this.createView(ui.rankUI.uiView);
        };
        rankUI.uiView = { "type": "View", "props": { "width": 1136, "top": 0, "left": 0, "height": 640 }, "child": [{ "type": "Rect", "props": { "y": 26, "x": 288, "width": 505, "lineWidth": 1, "height": 531, "fillColor": "#233b2d" } }, { "type": "List", "props": { "y": 94, "x": 313, "width": 464, "var": "rankList", "height": 401 }, "child": [{ "type": "Box", "props": { "width": 464, "renderType": "render", "height": 88 }, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 464, "lineWidth": 0, "height": 86, "fillColor": "#c1c0ba" } }, { "type": "Image", "props": { "y": 8, "x": 89, "width": 70, "name": "avatar", "height": 70 } }, { "type": "Text", "props": { "y": 23, "x": -52, "width": 120, "text": "1", "overflow": "hidden", "name": "rankLabel", "height": 26, "fontSize": 40, "font": "SimSun", "color": "#84592E", "align": "right" } }, { "type": "Text", "props": { "y": 30, "x": 170, "width": 120, "text": "1", "overflow": "hidden", "name": "nickname", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#84592E", "align": "left" } }, { "type": "Text", "props": { "y": 10, "x": 298, "width": 81, "text": "总分:", "name": "scoreText", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#BA9F7B", "align": "left" } }, { "type": "Text", "props": { "y": 10, "x": 366, "width": 89, "text": "99999", "name": "scoreNum", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#F07538", "align": "center" } }, { "type": "Text", "props": { "y": 47, "x": 307, "width": 134, "text": "2018/7/5", "overflow": "hidden", "name": "dateString", "height": 26, "fontSize": 26, "font": "SimSun", "color": "#BA9F7B", "align": "right" } }] }] }, { "type": "Text", "props": { "y": 39, "x": 481, "text": "排行榜", "fontSize": 40, "color": "#ffffff" } }] };
        return rankUI;
    }(View));
    ui.rankUI = rankUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map
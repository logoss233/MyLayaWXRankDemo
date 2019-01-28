var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var $rankView;
var RankView = /** @class */ (function (_super) {
    __extends(RankView, _super);
    function RankView() {
        var _this = _super.call(this) || this;
        $rankView = _this;
        _this.rankList.vScrollBarSkin = "";
        _this.rankList.renderHandler = new Laya.Handler(_this, _this.rankListRender);
        _this.rankList.array = [];
        return _this;
    }
    //重置排行榜
    RankView.prototype.showRankList = function () {
        var _this = this;
        //获取好友排行榜数据
        var wx = Laya.Browser.window.wx;
        wx.getFriendCloudStorage({
            keyList: ['week_score'],
            success: function (res) {
                _this.processFriendDataList(res.data);
                _this.rankList.scrollTo(0);
            }
        });
        //展示
        //this.mockList();
    };
    RankView.prototype.processFriendDataList = function (data) {
        var mondayTimestamp = $gameMain.getMondayTimestamp();
        var resultArr = [];
        //console.log(data);
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var kvLen = data[i]["KVDataList"].length;
            for (var j = 0; j < kvLen; j++) {
                if (data[i]["KVDataList"][j]["key"] == 'week_score') {
                    var valueJson = JSON.parse(data[i]["KVDataList"][j]["value"]);
                    if (valueJson["wxgame"]["update_time"] >= mondayTimestamp) { //是本周的
                        var newDate = new Date(valueJson["wxgame"]["update_time"] * 1000);
                        resultArr.push({
                            "avatar": data[i]["avatarUrl"],
                            "nickname": data[i]["nickname"],
                            "scoreNum": valueJson["wxgame"]["score"],
                            "dateString": newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate()
                        });
                    }
                    break;
                }
            }
        }
        resultArr.sort(function (a, b) { return b["scoreNum"] - a["scoreNum"]; });
        this.rankList.array = resultArr;
    };
    RankView.prototype.mockList = function () {
        var num = Math.round(1 + 10 * Math.random());
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push({ "avatar": "", "nickname": "测试" + i, "scoreNum": Math.round(num * Math.random()), "dateString": "2018/9/30" });
        }
        arr.sort(function (a, b) { return b["scoreNum"] - a["scoreNum"]; });
        this.rankList.array = arr;
    };
    RankView.prototype.rankListRender = function (cell, index) {
        var arr = this.rankList.array;
        if (index >= arr.length) {
            return;
        }
        cell.getChildByName("avatar").skin = arr[index]["avatar"];
        cell.getChildByName("nickname").text = arr[index]["nickname"];
        cell.getChildByName("scoreNum").text = arr[index]["scoreNum"];
        cell.getChildByName("dateString").text = arr[index]["dateString"];
        cell.getChildByName("rankLabel").text = String(index + 1);
    };
    return RankView;
}(ui.rankUI));
//# sourceMappingURL=RankView.js.map
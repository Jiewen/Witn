mui.init({
	swipeBack: true, //启用右滑关闭功能
	preloadPages: [{
		url: 'user_abus.html',
		id: 'user_abus'
	}],
});
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui.back = function() {
	//返回不是关闭  而是隐藏  这样就能保证只有用户用到了之后才会预加载
	mui.currentWebview.hide("pop-out");
}

if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {};

var user_seting_mpush = document.getElementById("user_seting_mpush"); //消息推送
var user_seting_nomap = document.getElementById("user_seting_nomap"); //无图模式
var user_seting_back = document.getElementById("user_seting_back");  //返回
user_seting_back.addEventListener("tap",function(){
	mui.back();
});
mui("#user_seting_path li").each(function() {
	this.addEventListener("tap", function() {
		var data_href = this.dataset.href;

		if (data_href == "user_abus.html") {
			openWindow('user_abus');
		} else if (data_href == "user_feedback.html") {
			mui.toast("此功能未开通"); //TODO
		} else if (data_href == "user_seting_update") {
			plus.nativeUI.showWaiting("正在检测...");
			setTimeout("checkUpdateOver()", Math.random() * 3000);
		} else if (data_href == "user_seting_share") {
			shareSystem();
		}
	});
});

function checkUpdateOver() {
	mui.toast("V1.0.0已经是最新版本");
	plus.nativeUI.closeWaiting();
}



var shares = null,
	bhref = false;
var Intent = null,
	File = null,
	Uri = null,
	main = null;
// H5 plus事件处理
function plusReady() {
	if (plus.os.name == "Android") {
		Intent = plus.android.importClass("android.content.Intent");
		main = plus.android.runtimeMainActivity();
	}
}
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
/**
 * 调用系统分享
 * 调用
 */
function shareSystem() {
	if (plus.os.name !== "Android") {
		plus.nativeUI.alert("此平台暂不支持系统分享功能!");
		return;
	}
	var intent = new Intent(Intent.ACTION_SEND);
	intent.setType("text/plain");
	intent.putExtra(Intent.EXTRA_SUBJECT, "微投");
	intent.putExtra(Intent.EXTRA_TEXT, "大家好，我正在使用微投，下载地址:http://www.witn.com/download");
	intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	main.startActivity(Intent.createChooser(intent, "系统分享"));
}
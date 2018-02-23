mui.init();

var isLoginSuccess = false;
var userDetailInfo, userAccBalance, sysMessages, nickname;


mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui.plusReady(function() {
	mui.preload({
		url: 'login.html',
		id: 'login'
	});
});
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	autoLogin(); 
}

/**
 *自动登录 
 */
function autoLogin(){
	var LoginInfo = plus.storage.getItem("LoginInfo");
	if (LoginInfo == null || LoginInfo == "") {
		return;
	} else {
		mui.ajax(witnUrl + 'loginAction_login.action', {
			data: {
				sendInfo: LoginInfo
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.result == "usererror") {
					plus.nativeUI.toast("自动登录失败");
				} else if (data.result == "success") {
					plus.nativeUI.toast("自动登陆成功！");
					Refresh(); //请求数据
				} else if (data.result == "statuslock") {
					plus.nativeUI.toast("由于您的违规操作，该账号已被锁定");
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				alert("登录异常，请检查您的网络连接");
			}
		});
	}
}

var user_headimg = document.getElementById("user_headimg");
var user_name = document.getElementById("user_name");
var user_psign = document.getElementById("user_psign");
var user_system_message = document.getElementById("user_system_message");
var user_my_message = document.getElementById("user_my_message");
var user_my_money = document.getElementById("user_my_money");
var user_seting = document.getElementById("user_seting");

user_seting.addEventListener('tap', function() {
	openWindowUrl("ui/user_seting.html");
});
user_headimg.addEventListener('tap', function() {
	if (isLoginSuccess == false) {
		openWindow('login');
	}
});

mui("#user_subpage_path li").each(function() {
	this.addEventListener('tap', function() {
		var data_href = this.dataset.href;
		if (data_href == "ui/user_exit") {
			plus.nativeUI.confirm("退出登录？", function(e) {
				if (e.index == 0) {
					//退出登录
					plus.storage.removeItem("LoginInfo"); //清除LoginInfo中的信息
					isLoginSuccess = false;
					resetUserHtml();
				}
			}, "微投", ["是", "否"]);
		} else if (isLoginSuccess) { //TODO isLoginSuccess
			var sendData = null;
			//显示系统消息
			if (data_href == "ui/user_system_news.html") {
				sendData = sysMessages;
			} else if (data_href == "ui/user_hami_money.html") {
				sendData = userAccBalance;
			} else if (data_href == "ui/user_as.html") {
				mui.openWindow({
					url: data_href,
					createNew: false, //是否创建具有同样ID的页面
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300
					},
					extras: {
						sendData:userDetailInfo,
						nickName:nickname 
					},
					waiting: {
						autoShow: false,
					}
				})
				return false;
			}
			mui.openWindow({
				url: data_href,
				createNew: false, //是否创建具有同样ID的页面
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
					duration: 300
				},
				extras: {
					sendData: sendData
				},
				waiting: {
					autoShow: false,
				}
			})
		} else {
			openWindow('login');
		}
	});
});
document.addEventListener('refresh', function(e) {
	console.log(e.detail.from);
	var from = e.detail.from;
	if (from == 1) { //由登录界面返回的参数登录刷新数据
		Refresh();
	} else if (from == 2) {  //由系统页面返回的参数
		sysMessages = e.detail.data;
		var user_system_messageHtml = "<img src='img/icon/iconfont-xitongxiaoxi.png' /><font>系统消息</font>";
		user_system_messageHtml += "<span class='mui-badge mui-badge-red'>" + sysMessages.length + "</span>";
		user_system_message.innerHTML = user_system_messageHtml;
	}else if (from ==3 ){ //由详细信息页面返回的参数
		Refresh();
	}
}, false);

function Refresh() {
	//	mui.preload({url: 'ui/user_account.html',id: 'user_account'}); //预加载账单界面
	mui.ajax(witnUrl + 'loginAction_index.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.error != null) {
				mui.toast("登录已过期，请重新登录！");
			} else {
				userDetailInfo = data.detailInfo;
				sysMessages = data.sysMessages;
				userAccBalance = data.accBalance;
				nickname = data.nickname;
				changeUserHtml(); //重新修改subpage-user.html界面
			}
		},
		error: function(xhr, type, errorThrown) {
			alert("获取信息时网络异常，请检查您的网络连接");
		}
	});
}

function resetUserHtml() {
	user_headimg.src = "img/icon/mine_photo_default.png";
	user_name.innerText = "请登录";
	user_psign.innerText = "";
	user_system_message.innerHTML = "<img src='img/icon/iconfont-xitongxiaoxi.png' /><font>系统消息</font>";
	user_my_money.innerHTML = "<img src='img/icon/iconfont-zhanghuyue.png' /><font>我的哈密币</font>";
	isLoginSuccess = false;
}

function changeUserHtml() {
	user_headimg.src = witnUrl + userDetailInfo.headurl;
	user_name.innerText = nickname;
	user_psign.innerText = userDetailInfo.psign;
	var user_system_messageHtml = user_system_message.innerHTML;
	user_system_messageHtml += "<span class='mui-badge mui-badge-red'>" + sysMessages.length + "</span>";
	user_system_message.innerHTML = user_system_messageHtml;
	var user_my_moneyHtml = user_my_money.innerHTML;
	user_my_moneyHtml += "<span class='mui-badge mui-badge-success'>" + userAccBalance.balance + "</span>";
	user_my_money.innerHTML = user_my_moneyHtml;
	isLoginSuccess = true;
}
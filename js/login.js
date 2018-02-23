var isLoginSuccess = false;
mui.init({
	preloadPages:[{
		url: 'reg_phone.html',
		id: 'reg_phone'
	}],
	beforeback: function() {
		if (isLoginSuccess) {
			isLoginSuccess = false;
			var user_page = plus.webview.getWebviewById('subpage-user.html');
			//触发列表界面的自定义事件（refresh）,从而进行数据刷新
			mui.fire(user_page, 'refresh',{
				from:1
			});
			//返回true，继续页面关闭逻辑
		}
		return true;
	}
});

if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {}
var loginBtn = document.getElementById("loginBtn");
var regBtn = document.getElementById("regBtn");
mui("#login_check_allow").on('change', 'input', function() {
	var value = this.checked ? "true" : "false";
	if (value == "false") {
		loginBtn.disabled = true;
		regBtn.disabled = true;
	} else {
		loginBtn.disabled = false;
		regBtn.disabled = false;
	}
});

regBtn.addEventListener('tap', function() {
	openWindow("reg_phone");
});

loginBtn.addEventListener('tap', function() {
	var sendInfo = gainFormValue("login_form", "no");
	if (sendInfo != "") {
		console.log(  sendInfo );
		plus.nativeUI.showWaiting("正在登陆中..."); //打开等待框
		mui.ajax(witnUrl + 'loginAction_login.action', {
			data: {
				sendInfo: sendInfo
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				console.log( 'login.js:'+data.result );
				plus.nativeUI.closeWaiting();
				if (data.result == "usererror") {
					plus.nativeUI.toast("用户名或密码错误");
				} else if (data.result == "success") {
					isLoginSuccess = true;
					plus.nativeUI.toast("登陆成功");
					plus.storage.setItem("LoginInfo", sendInfo); //将信息保存
					mui.back(); //返回
				}else if( data.result =="statuslock" ){
					plus.nativeUI.toast("用户锁定");
				}else if ( data.result=="unfinish" ){
					plus.nativeUI.toast("请编写您的详细信息");
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				alert("网络异常，请检查您的网络连接");
			}
		});
	} else {
		plus.nativeUI.toast("信息不完善");
	}
});
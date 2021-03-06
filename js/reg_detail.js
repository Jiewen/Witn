mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
//需要打开相机选择图片
document.addEventListener("plusready", onPlusReady, false);

var headUrl = "";
var reg_detail_headimg = document.getElementById("reg_detail_headimg");
var reg_detail_phone = document.getElementById("reg_detail_phone");
var reg_detail_idcard = document.getElementById("reg_detail_idcard");
var reg_detail_email = document.getElementById("reg_detail_email");
var reg_detail_password = document.getElementById("reg_detail_password");
var reg_detail_repassword = document.getElementById("reg_detail_repassword");
var reg_detail_sex = document.getElementById("reg_detail_sex");


function onPlusReady() {
	var self = plus.webview.currentWebview();
	var phone = self.phone;
	reg_detail_phone.value = phone;
}
var reg_confirm = function() {
	plus.storage.removeItem("headUrl"); //清除LoginInfo中的信息
	var reg_detail_idcard_value = reg_detail_idcard.value;
	var reg = /^[\d]{6}(19|20)[\d]{2}((0[1-9])|(11|12))([012][\d]|(30|31))[\d]{3}[xX\d]$/;
	if (!reg.test(reg_detail_idcard_value)) {
		mui.toast("身份证号码有误");
		return false;
	}
	var reg_detail_email_value = reg_detail_email.value;
	reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
	if (reg_detail_email_value != "" && !reg.test(reg_detail_email_value)) {
		mui.toast("邮箱地址不正确");
		return false;
	}
	var reg_detail_password_value = reg_detail_password.value;
	var reg_detail_repassword_value = reg_detail_repassword.value;
	if (reg_detail_password_value != "" && reg_detail_password_value.length < 6) {
		mui.toast("密码不得小于6位");
		return false;
	}
	if (reg_detail_password_value != reg_detail_repassword_value) {
		mui.toast("两次密码不一致");
		return false;
	}
	var sendInfo = gainFormValue("reg_detail", "yes");
	sendInfo = sendInfo.substring(0, sendInfo.length - 85) + "password:"; //MD5加密的时候出现的问题，当值为空时也会生成代码
	if (reg_detail_password_value != "") {
		sendInfo += hex_md5(reg_detail_password_value);
	}
	if( headUrl != "" ){
		sendInfo += ",headUrl:"+headUrl;
	}
	console.log(  'reg_detail.js:'+sendInfo );
	plus.nativeUI.showWaiting("正在上传信息");
	mui.ajax(witnUrl + 'loginAction_registerPass.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			plus.nativeUI.closeWaiting();
			if( data.result=="success" ){
				mui.toast("资料上传成功！");
				plus.webview.close(plus.webview.currentWebview());
				var reg_phone = plus.webview.getWebviewById('reg_phone');
				plus.webview.close(reg_phone);
				openWindow('login');
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.toast("网络异常，请检查您的网络连接或服务器未开启");
		}
	});


	return false;
}
reg_detail_headimg.addEventListener('tap', function() {
	// 从相册中选择图片
	plus.gallery.pick(function(path) {
		mui.openWindow({
			url: 'ui/user_headimg.html',
			id:'user_headimg',
			createNew: false, //是否创建具有同样ID的页面
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				duration: 300
			},
			extras: {
				path: path
			},
			waiting: {
				autoShow: false //自动显示等待框，默认为true
			}
		})
	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image"
	});
});
reg_detail_sex.addEventListener('tap',function(){
	var bts=[{title:"男"},{title:"女"},{title:"不男不女"}];
	plus.nativeUI.actionSheet({title:"选择性别",buttons:bts},
		function(e){
			reg_detail_sex.value = bts[e.index-1].title;
		}
	);
});
//添加自定义事件
document.addEventListener('refresh', Refresh, false);
function Refresh() {
	headUrl = plus.storage.getItem("headUrl");
	document.getElementById("reg_headimg").src = witnUrl + headUrl;
	console.log( witnUrl+headUrl );
}
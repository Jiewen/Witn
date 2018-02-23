var sysMessages;
var sysMessageIndex = 0;
var deleteIndex = 0; //当前删除的消息的index
mui.init({
	beforeback: function() {
		var user_page = plus.webview.getWebviewById('subpage-user.html');
		mui.fire(user_page, 'refresh', {
			from: 2,
			data: sysMessages
		});
		return true;
	}
});
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
var system_messageList = "";

var user_system_message = document.getElementById("user_system_message");

if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	var self = plus.webview.currentWebview();
	sysMessages = self.sendData;
	changeHtml();
}

function activeClick() {
	mui("#user_system_message li").each(function() {
		this.addEventListener('tap', function() {
			deleteIndex = this.dataset.index;
			var liData = sysMessages[deleteIndex];
			var UUID = liData.uuid;
			plus.nativeUI.confirm(liData.content, function(e) {
				switch (e.index) {
					case 0:
						deleteSystemNew(UUID);
						break;
					case 1:
						console.log("确定!");
						break;
				}
			}, liData.title, ["删除", "确定"]);
		})
	});
}


document.getElementById("user_system_popver_one").addEventListener("tap", function() {
	deleteSystemNew("all");
})


function changeHtml() {
	sysMessageIndex = 0;
	system_messageList = "";
	sysMessages.forEach(function(e) {
		system_messageList += "<li class='mui-table-view-cell' data-index=" +
			(sysMessageIndex++) + "><span>" + e.title + "<label>" + e.sm_time + "</label></span><font>" +
			e.content + "</font></li>";
	});
	user_system_message.innerHTML = system_messageList;
	activeClick();
}

function deleteSystemNew(uuid) {
	var sendInfo = "";
	var deleteOpinion;
	if (uuid == "all") {
		//删除所有
		deleteOpinion = 1;
		sendInfo = "delete:" + uuid;
	} else {
		//删除单个
		deleteOpinion = 2;
		sendInfo = "delete:" + uuid;
	}
	mui.ajax(witnUrl + 'sysMessageAction_deleteMessages.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			console.log(data.result);
			if (data.result == 'success') {
				if (deleteOpinion == 1) {
					mui("#user_system_popver_one").popover("toggle");
					sysMessages = new Array();
				} else {
					sysMessages.splice(deleteIndex, 1); //删除这条元素
				}
				mui.toast("删除成功");
				changeHtml();
			} else {
				mui.toast('对不起，删除失败');
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}
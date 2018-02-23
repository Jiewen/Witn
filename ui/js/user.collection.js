mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui.back = function() {
	//显示上一个界面；
	mui.currentWebview.hide("pop-out");
}
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	ajaxData();
}

var collection_loading = document.getElementById("collection_loading");
var collection_nothing = document.getElementById("collection_nothing");
var collection_table_view = document.getElementById("collection_table_view");
var collection_back = document.getElementById("collection_back");

function ajaxData() {
	console.log("正在获取收藏数据");
	mui.ajax(witnUrl + 'myCollectionAction_getMyCollections.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 20000, //超时时间设置为10秒；
		success: function(data) {
			collection_loading.style.display = "none";
			var response = data.response;
			if (response == "success") {
				var collectionInfo = data.collectionInfo;
				if (collectionInfo.length == 0) {
					collection_nothing.style.display = "flex";
				} else {
					var innerHtml = "";
					collectionInfo.forEach(function(e) {
						innerHtml += "<li class='mui-table-view-cell hami-item-box' data-uuid='" + e.H_UUID + "'>" +
							"<table cellspacing='0px' cellpadding='0px'>" +
							"<tr><td>标的证券</td><td>集资额度</td><td>人数</td><td>共集资</td><td>当前状态</td></tr>" +
							"<tr class='hami-up'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
							"<td>" + e.sum_people + "</td><td>￥" + e.sum_money + "</td><td>" + e.VC_DICTDISCRIP + "</td></tr></table></li>"
					});
					collection_table_view.innerHTML = innerHtml;
					collection_table_view.style.display = "block";
					activeClick();
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}

function activeClick() {
	mui("#collection_table_view li").each(function() {
		this.addEventListener('tap', function() {
			mui.toast("此功能尚未完善，升级下版本后可用！");
		});
	})
};

collection_back.addEventListener("tap", function() {
	mui.back();
});
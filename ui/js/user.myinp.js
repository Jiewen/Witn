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

var hami_user_myinp_panel = document.getElementById("hami_user_myinp_panel"); //主面板
var hami_myinp_refresh = document.getElementById("hami_myinp_refresh"); //刷新
var hami_myinp_loading = document.getElementById("hami_myinp_loading");

hami_myinp_refresh.addEventListener("tap", function() {
	hami_user_myinp_panel.style.visibility = "hidden";
	hami_myinp_loading.style.visibility = "visible";
	ajaxData();
})

function ajaxData() {
	mui.ajax(witnUrl + 'myCollectionAction_getMyInpool.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			console.log(data.response);
			if (data.response == "SUCCESS") {
				var profiting = data.profiting; //正在收益
				var publish = data.publish; //即将揭晓
				var collect = data.collect; //正在集资
				var profited = data.profited; //收益结束

				var panelInnerHtml = "<div class='hami-alert-mark'>正在收益</div>";
				if (profiting.length == 0) {
					panelInnerHtml += "<div class='hami-nothing'><font>你暂时没有正在收益的投资哦</font></div>";
				} else {
					panelInnerHtml += "<ul class='mui-table-view'>";
					profiting.forEach(function(e) {
						panelInnerHtml += "<li class='mui-table-view-cell hami-item-box'><table cellspacing='0px' cellpadding='0px'>" +
							"<tr><td>标的股票</td><td>共集资</td><td>购买价格</td><td>当前价</td><td>共收益</td></tr>"
						if (e.F_CurPrice >= e.F_BuyPrice) {
							panelInnerHtml += "<tr class='hami-up'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
								"<td>￥" + e.F_BuyPrice + "</td><td>￥" + e.F_CurPrice + "</td><td>￥" + e.Sum_Profit + "</td></tr></table></li>";
						} else {
							panelInnerHtml += "<tr class='hami-down'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
								"<td>￥" + e.F_BuyPrice + "</td><td>￥" + e.F_CurPrice + "</td><td>￥" + e.Sum_Profit + "</td></tr></table></li>";
						}
					});
					panelInnerHtml += "</ul>"
				}


				panelInnerHtml += "<div class='hami-alert-mark'>即将揭晓</div>"
				if (publish.length == 0) {
					panelInnerHtml += "<div class='hami-nothing'><font>你暂时没有即将揭晓的投资哦</font></div>";
				} else {
					panelInnerHtml += "<ul class='mui-table-view'>";
					publish.forEach(function(e) {
						panelInnerHtml += "<li class='mui-table-view-cell hami-item-box'><table cellspacing='0px' cellpadding='0px'>" +
							"<tr><td>标的股票</td><td>共集资</td><td>集资人数</td><td>揭晓时间</td><td>我投资</td></tr>" +
							"<tr class='hami-up'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
							"<td>" + e.sum_people + "</td><td>" + e.over_time + "</td><td>￥" + e.l_trade_money + "</td></tr></table></li>";
					});
					panelInnerHtml += "</ul>"
				}


				panelInnerHtml += "<div class='hami-alert-mark'>正在集资</div>"
				if (collect.length == 0) {
					panelInnerHtml += "<div class='hami-nothing'><font>你暂时没有正在集资的投资哦</font></div>";
				} else {
					panelInnerHtml += "<ul class='mui-table-view'>";
					collect.forEach(function(e) {
						panelInnerHtml += "<li class='mui-table-view-cell hami-item-box'><table cellspacing='0px' cellpadding='0px'>" +
							"<tr><td>标的股票</td><td>共集资</td><td>集资人数</td><td>集资量</td><td>我投资</td></tr>" +
							"<tr class='hami-up'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
							"<td>" + e.sum_people + "</td><td>" + e.sum_money + "</td><td>￥" + e.l_trade_money + "</td></tr></table></li>";
					});
					panelInnerHtml += "</ul>"
				}

				panelInnerHtml += "<div class='hami-alert-mark'>收益结束</div>"
				if (profited.length == 0) {
					panelInnerHtml += "<div class='hami-nothing'><font>你暂时没有收益结束的投资哦</font></div>";
				} else {
					panelInnerHtml += "<ul class='mui-table-view'>";
					profited.forEach(function(e) {
						panelInnerHtml += "<li class='mui-table-view-cell hami-item-box'><table cellspacing='0px' cellpadding='0px'>" +
							"<tr><td>标的股票</td><td>共集资</td><td>购买价格</td><td>平仓价格</td><td>共收益</td></tr>" +
							"<tr class='hami-up'><td>" + e.VC_SNAME + "</td><td>￥" + e.L_LIMIT + "</td>" +
							"<td>￥" + e.F_BuyPrice + "</td><td>￥" + e.F_OverPrice + "</td><td>￥" + e.Sum_Profit + "</td></tr></table></li>";
					});
					panelInnerHtml += "</ul>"
				}
				hami_myinp_loading.style.visibility = "hidden";
				hami_user_myinp_panel.style.visibility = "visible";
				hami_user_myinp_panel.innerHTML = panelInnerHtml;
				activeClick();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}

function activeClick() {
	console.log( 1 );
	var hami_item_box_list = document.getElementsByClassName("hami-item-box");
	for(var i=0;i<hami_item_box_list.length;i++ ){
		hami_item_box_list[i].addEventListener("tap",function(){
			mui.toast("此功能尚未完善，升级下版本后可用！");
		});
	}
	
}
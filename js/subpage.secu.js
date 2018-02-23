var getVoteOption = function(chartType) {
	var option = {
		title: {
			text: '当前投票数量前五的股票',
			textStyle: {
				fontSize: 14,
				color: '#777'
			},
			padding: 12,
		},
		grid: {
			x: 40,
			x2: 10,
			y: 40,
			y2: 25
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			padding: 12,
			data: ['总数', '当前价'],
			x: 'right',
			textStyle: {
				fontSize: 12,
				color: '#777'
			},
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: ['恒生电子', '中国移动', '中国联通', '中国电信', '北斗星通']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '总数',
			type: 'bar',
			data: [34, 10, 12, 23, 25]

		}, {
			name: '当前价',
			type: 'bar',
			data: [9.8, 8.9, 7.0, 6.4, 5.7]
		}]
	};
	return option;
};
var getHosOption = function(chartType) {
	var option = {
		title: {
			text: '历史投资池排名前五的股票',
			textStyle: {
				fontSize: 14,
				color: '#777'
			},
			padding: 12,
		},
		grid: {
			x: 40,
			x2: 10,
			y: 40,
			y2: 25
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			padding: 12,
			data: ['总数', '当前价'],
			x: 'right',
			textStyle: {
				fontSize: 12,
				color: '#777'
			},
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: ['恒生电子', '中国移动', '中国联通', '中国电信', '北斗星通']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '总数',
			type: 'bar',
			data: [56, 10, 43, 76, 12]

		}, {
			name: '当前价',
			type: 'bar',
			data: [9.8, 8.9, 7.0, 6.4, 5.7]
		}]
	};
	return option;
};
var voteChart = echarts.init(document.getElementById('voteChart'));
voteChart.setOption(getVoteOption('bar'));
var hosChart = echarts.init(document.getElementById('hosChart'));
hosChart.setOption(getHosOption('bar'));
//图表暂时虚拟

mui.init();
var getStatus = 1; //1：刷新所有  2：加载更多
var curIndex = 0; //当前显示界面
var container;
var pageVote = 1; //投票第几页
var pageHos = 1; //历史第几页
var num = 5; //每页条数
var pageVote_over = false;
var pageHos_over = false;
var dv = false; //直接投票为false
var secu_search_btn = document.getElementById("secu_search_btn"); //搜索关键字
var secu_div_vote = document.getElementById("secu_div_vote");
var secu_div_hos = document.getElementById("secu_div_hos");
(function($) {
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						curIndex = index;
						container = this;
						pullDownFresh();
					}
				},
				up: {
					callback: function() {
						curIndex = index;
						container = this;
						pullUpFresh();
					}
				}
			});
		});
	});
})(mui);
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	ajaxData();
}

function ajaxData() {
	//获取投票数据信息和历史投资信息分别获取五条
	getVoteInfo();
	getHosInfo();
}

//下拉刷新
function pullDownFresh() {
	getStatus = 1;
	if (curIndex == 0) {
		if (pageVote_over) {
			mui.toast("已经没有更多有投票的证券了，请搜索你想要投票的证券！");
		} else {
			getVoteInfo();
		}
	} else { //历史
		if (pageHos_over) {
			mui.toast("已经没有更多的历史数据了！");
		} else {
			getHosInfo();
		}
	}
}
//上拉加载更多
function pullUpFresh() {
	getStatus = 2;
	if (curIndex == 0) {
		if (pageVote_over) {
			mui.toast("已经没有更多的证券了！");
			container.endPullUpToRefresh();
		} else {
			pageVote++;
			getVoteInfo();
		}
	} else { //历史
		if (pageHos_over) {
			mui.toast("已经没有更多的历史数据了！");
			container.endPullUpToRefresh();
		} else {
			pageHos++;
			getHosInfo();
		}
	}
}

function getVoteInfo() { //获取投票信息
	var keyWord = secu_search_btn.value;
	var sendInfo = "";
	if (getStatus == 1) {
		sendInfo = "page:" + 1 + ",num:" + (pageVote * num) + ",keyWord:" + keyWord;
	} else {
		sendInfo = "page:" + pageVote + ",num:" + num + ",keyWord:" + keyWord;
	}
	mui.ajax(witnUrl + 'secuAction_getVoteInfo.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.response == "nomore") {
				if (getStatus == 1) {
					//刷新没有的话
					secu_div_vote.innerHTML = "<div class='hami-nothing'><font>搜索结果为空</font></div>";
				}
				pageVote_over = true;
				container.endPullDownToRefresh();
				container.endPullUpToRefresh();
			} else if (data.response == "success") {
				var voteInfo = data.voteInfo;
				var secu_div_voteInnerHtml = "";
				voteInfo.forEach(function(e) {
					secu_div_voteInnerHtml += "<li class='mui-table-view-cell hami-item-box' data-sumvote='"+e.sum_vote+"' data-sname='" + e.VC_SNAME + "' data-scode='" + e.VC_SCODE + "'>" +
						"<span>" + e.VC_SNAME + "<font>代码：" + e.VC_SCODE + "</font><font>共有：" + e.sum_vote + "票</font></span>" +
						"<table cellspacing='0px' cellpadding='0px'><tr><th rowspan='2'><img src='" + witnUrl + "../" + e.VC_STOCKLOGO + "' />" +
						"</th><td>当前价</td><td>涨跌额</td><td>操作</td></tr>";
					if (e.F_CgPrice >= 0) {
						secu_div_voteInnerHtml += "<tr class='hami-up'><td>￥" + e.F_CurPrice + "</td><td>" + e.F_CgPrice + "</td><td>" +
							"<button class='mui-btn mui-btn-negative  mui-btn-outlined hami-vote-btn' data-scode='" + e.VC_SCODE + "'>投票</button>" +
							"</td></tr></table></li>"
					} else {
						secu_div_voteInnerHtml += "<tr class='hami-down'><td>￥" + e.F_CurPrice + "</td><td>" + e.F_CgPrice + "</td><td>" +
							"<button class='mui-btn mui-btn-green  mui-btn-outlined hami-vote-btn' data-scode='" + e.VC_SCODE + "'>投票</button>" +
							"</td></tr></table></li>"
					}
				})
				if (getStatus == 1) {
					//刷新所有
					secu_div_vote.innerHTML = secu_div_voteInnerHtml;
					if (container != null) {
						container.endPullDownToRefresh();
					}
				} else {
					//加载更多
					var old_secu_div_voteInnerHtml = secu_div_vote.innerHTML;
					secu_div_voteInnerHtml = old_secu_div_voteInnerHtml + secu_div_voteInnerHtml;
					secu_div_vote.innerHTML = secu_div_voteInnerHtml;
					container.endPullUpToRefresh();
				}
				activeVoteClick();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}


function getHosInfo() { //获取投票信息
	var keyWord = secu_search_btn.value;
	var sendInfo = "";
	if (getStatus == 1) {
		sendInfo = "page:" + 1 + ",num:" + (pageHos * num) + ",keyWord:" + keyWord;
	} else {
		sendInfo = "page:" + pageHos + ",num:" + num + ",keyWord:" + keyWord;
	}
	mui.ajax(witnUrl + 'secuAction_getHosInfo.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.response == "nomore") {
				if (getStatus == 1) {
					//刷新没有的话
					secu_div_hos.innerHTML = "<div class='hami-nothing'><font>搜索结果为空</font></div>";
				}
				pageHos_over = true;
				container.endPullDownToRefresh();
				container.endPullUpToRefresh();
			} else if (data.response == "success") {
				var hosInfo = data.hosInfo;
				var secu_div_hosInnerHtml = "";
				hosInfo.forEach(function(e) {
					secu_div_hosInnerHtml += "<li class='mui-table-view-cell hami-item-box' data-uuid='"+e.H_UUID+"'>" +
						"<span>" + e.VC_SNAME + "<font>集资时间：" + e.issue_time + "→" + e.FREND_TIME + "</font></span>" +
						"<div><table cellspacing='0px' cellpadding='0px'><tr><th rowspan='2'>" +
						"<img src='" + witnUrl + "../" + e.VC_STOCKLOGO + "' />" +
						"</th><td>哈密儿</td><td>购买人次</td><td>共集资</td><td>共收益</td></tr>"
					if (e.sum_profit >= 0) {
						secu_div_hosInnerHtml += "<tr class='hami-up'><td>" + e.VC_NICKNAME + "</td><td>" + e.sum_people + "</td>" +
							"<td>" + e.L_LIMIT + "</td><td>" + e.sum_profit + "</td></tr></table></div></li>";
					} else {
						secu_div_hosInnerHtml += "<tr class='hami-down'><td>" + e.VC_NICKNAME + "</td><td>" + e.sum_people + "</td>" +
							"<td>" + e.L_LIMIT + "</td><td>" + e.sum_profit + "</td></tr></table></div></li>";
					}
				})
				if (getStatus == 1) {
					//刷新所有
					secu_div_hos.innerHTML = secu_div_hosInnerHtml;
					if (container != null) {
						container.endPullDownToRefresh();
					}
				} else {
					//加载更多
					var old_secu_div_hosInnerHtml = secu_div_hos.innerHTML;
					secu_div_hosInnerHtml = old_secu_div_hosInnerHtml + secu_div_hosInnerHtml;
					secu_div_hos.innerHTML = secu_div_hosInnerHtml;
					container.endPullUpToRefresh();
				}
				activeHosClick();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}

var reg = /[，。,.!！]/g; //用来去除语音输入之后存在的逗号和句号
secu_search_btn.onfocus = function() {
	this.value = this.value.replace(reg, "");
}
secu_search_btn.onkeydown = function(e) {
	if (e.keyCode == 13) {
		//执行搜索
		if (this.value == "") {
			//这么多证券 看都看不完
			pageVote_over = false; //也就是说当没有关键字的时候
		}
		getStatus = 1; //关键字应该是刷新
		if (curIndex == 0) {
			getVoteInfo();
		}else{
			getHosInfo();
		}
	}
}

function activeVoteClick() {
	var hami_vote_btns = document.getElementsByClassName("hami-vote-btn");
	for (var i = 0; i < hami_vote_btns.length; i++) {
		hami_vote_btns[i].addEventListener("tap", function() {
			var scode = this.dataset.scode;
			dv = true; //直接投票为true  阻止li事件 
			mui.ajax(witnUrl + 'secuAction_addVoteInfo.action', {
				data: {
					sendInfo: "scode:" + scode
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					var response = data.response;
					if (response == "loginInvalid") {
						mui.toast("尚未登录，不能投票！");
					} else if (response == "existvote") {
						mui.toast("您已经投过票了！");
					} else {
						mui.toast("投票成功！");
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log(type);
				}
			});
		})
	}

	mui("#secu_div_vote li").each(function() {
		this.addEventListener('tap', function() {
			if (dv) {
				dv = false;
				return;
			}
			//打开界面
			var scode = this.dataset.scode;
			var sname = this.dataset.sname;
			var sumvote = this.dataset.sumvote;
			mui.openWindow({
				url: 'ui/secu_vote.html',
				id: 'secu_vote',
				createNew: false, //是否创建具有同样ID的页面
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
					duration: 300
				},
				extras: {
					scode: scode,
					sname: sname,
					sumvote: sumvote
				},
				waiting: {
					autoShow: false,
				}
			})
		});
	})
}

function activeHosClick() {
mui("#secu_div_hos li").each(function() {
		this.addEventListener('tap', function() {
			//打开界面
			var uuid = this.dataset.uuid;
			mui.openWindow({
				url: 'ui/secu_hos.html',
				id: 'secu_hos',
				createNew: false, //是否创建具有同样ID的页面
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
					duration: 300
				},
				extras: {
					uuid: uuid
				},
				waiting: {
					autoShow: false,
				}
			})
		});
	})
}
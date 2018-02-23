mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
var hami_loading = document.getElementById("hami_loading");
var secu_vote_panel = document.getElementById("secu_vote_panel");


if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

var scode, sname, sumvote;
var secu_vote_title = document.getElementById("secu_vote_title");
var secu_vote_nownum = document.getElementById("secu_vote_nownum");
var secu_vote_vote = document.getElementById("secu_vote_vote");

function plusReady() {
	var self = plus.webview.currentWebview();
	scode = self.scode;
	sname = self.sname;
	sumvote = self.sumvote;
	changeHtml();
}

function changeHtml() {
	secu_vote_title.innerHTML = sname + "-" + scode;
	secu_vote_nownum.innerHTML = "现有投票数：" + sumvote + "票";
	var barChart = echarts.init(document.getElementById('KChart'));
	barChart.setOption(getOption());
	setTimeout("show()", Math.random() * 3000);
}

secu_vote_vote.addEventListener("tap", function() {
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
});


function show() {
	hami_loading.style.visibility = "hidden";
	secu_vote_panel.style.visibility = "visible";
}


var getOption = function() {
	var option = {
		title: {
			text: '七日收盘价',
			padding: 15,
			textStyle: {
				fontSize: 14,
				color: '#777',
			}
		},
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			x: 25,
			x2: 15,
			y: 45,
			y2: 25
		},
		legend: {
			padding: 15,
			data: ['收盘价']
		},

		calculable: false,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '收盘价',
			type: 'line',
			smooth: true,
			itemStyle: {
				normal: {
					areaStyle: {
						type: 'default'
					}
				}
			},
			data: [50.23, 49.24, 48.12, 44.21, 42.12, 39.28, 41.21],
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
		}]
	};
	return option;
};
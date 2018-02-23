mui.init();
var moneyInfo;
var isSuccess = false;
mui.back = function() {
	mui.currentWebview.hide("pop-out");
}
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	getHamiData();
}

var money_loading = document.getElementById("money_loading");
var hami_money_panel = document.getElementById("hami_money_panel");
var money_sum_money = document.getElementById("money_sum_money");
var barChart = echarts.init(document.getElementById('KChart'));
var money_recharge = document.getElementById("money_recharge");  //充值
var money_cash = document.getElementById("money_cash");  //提现
var hami_money_refresh = document.getElementById("hami_money_refresh");  //刷新

//获取数据
function getHamiData() {
	mui.ajax(witnUrl + 'myCollectionAction_getMyMoney.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 20000, //超时时间设置为10秒；
		success: function(data) {
			if (data.response == "success") {
				money_loading.style.visibility = "hidden";					
				moneyInfo = data.moneyInfo[0];
				barChart.setOption(getOption());
				money_sum_money.innerText = moneyInfo.sum_money+moneyInfo.l_balance;
				hami_money_panel.style.visibility = "visible";
				isSuccess = true;
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}
hami_money_refresh.addEventListener("tap",function(){
	hami_money_panel.style.visibility = "hidden";
	money_loading.style.visibility = "visible";		
	getHamiData();
});
money_recharge.addEventListener("tap",function(){
	//TODO
	if( isSuccess ){
		mui.toast("对不起，其功能暂不提供支持");
	}else{
		mui.toast("余额获取出现问题，请稍后再试");
	}
});
money_cash.addEventListener("tap",function(){
	//TODO 
	if( isSuccess ){
		mui.toast("对不起，其功能暂不提供支持！");
	}else{
		mui.toast("余额获取出现问题，请稍后再试");
	}
});

function getOption() {
	 var option= {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'horizontal',
			margin: [20, 0, 20, 0],
			x: 'center',
			data: ['账户余额', '正在投资']
		},
		calculable: true,
		series: [{
			name: '资产类别',
			type: 'pie',
			radius: ['40%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: true
					},
					labelLine: {
						show: true
					}
				}
			},
			data: [{
				value: moneyInfo.l_balance,
				name: '账户余额'
			}, {
				value: moneyInfo.sum_money,
				name: '正在投资'
			}]
		}]
	}
	return option;
}
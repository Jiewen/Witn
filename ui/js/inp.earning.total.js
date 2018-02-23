var uuids;
document.getElementById('keep_scoc').addEventListener('tap', function() {
	alert(uuids);
	var sendInfo = uuids
	mui.ajax(witnUrl + 'myCollectionAction_addCollection.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.response == "loginInvalid") {
				alert("未登录！");
			} else if (data.response == "exist") {
				alert("已经存在！");
			} else if (data.response == "success") {
				alert("收藏成功！");
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			alert("网络异常，请检查您的网络连接");
			mui.currentWebview.show();
		}
	});
});

window.onload = function() { //onload事件完成之后才会显示这个界面  但是可以异步
	mui.plusReady(function() {
		uuids=plus.webview.currentWebview().proid;
	    var uname=plus.webview.currentWebview().proname;
		var sendInfo = "scode:" + uname;
		alert(uname);
		mui.ajax(witnUrl + 'colProductAction_priceAndrate.action', {
			data: {
				sendInfo: sendInfo
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.result == "clterror") {
					plus.nativeUI.closeWaiting();
					alert("暂无数据！");
					mui.currentWebview.show();
				} else if (data.error == "1") {
					var myDate = new Date();
					plus.nativeUI.closeWaiting();
					document.getElementById('lastpx').innerText = data.Last_px;
					document.getElementById('pxchange').innerText = data.Px_change;
					document.getElementById('pxrate').innerText = data.Px_change_rate + '%';
					document.getElementById('updatetime').innerText = myDate.toLocaleString();
					mui.currentWebview.show('zoom-fade-out');
				} else {
					alert("未知问题");
					plus.nativeUI.closeWaiting();
					mui.currentWebview.show();
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				alert("网络异常，请检查您的网络连接");
				mui.currentWebview.show();
			}
		});
	});

	var getOption = function() {
		var option = {
			title: {
				text: '日收益情况',
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
				x: 35,
				x2: 15,
				y: 45,
				y2: 25
			},
			legend: {
				padding: 15,
				data: ['持仓收益']
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: ['3月1日', '3月2日', '3月3日', '3月4日', '3月5日', '3月6日', '3月7日', '3月8日', '3月9日']
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: '持仓收益',
				type: 'line',
				smooth: true,
				itemStyle: {
					normal: {
						areaStyle: {
							type: 'default'
						}
					}
				},
				data: [200, 948, 888, 1100, 677, 888, 999, 888, 999],
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
	var barChart = echarts.init(document.getElementById('detalchart'));
	barChart.setOption(getOption());
};

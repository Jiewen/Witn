mui.init({
	swipeBack: false
});
//当前模块全局变量
var count = 0; //刷新计数
var poolValue; //水池的值
var collcInfo; //记录获取的信息
var collcInfolength; //数据条数
var refreshcode;
//下拉刷新
function pullupRefresh() {
	if (count >= collcInfolength) {
		mui.toast('没有更多的数据');
		return;
	}
	var table = document.body.querySelector('.mui-table-view');
	var cells = document.body.querySelectorAll('.mui-table-view-cell');
	var btn_more = document.getElementById('btn_more');
	setTimeout(function() {
		mui.each(collcInfo, function(i, item) {
			count++;
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right">' + item.scode + '</a></li>';
			table.insertBefore(li, btn_more);
			//绑定事件
			li.addEventListener('tap', function() {
				var itcode = item.scode.trim();
				var innerCode = this.innerText.trim();
				if (itcode == innerCode) {
					if(refreshcode==innerCode){
//						alert(refreshcode);
						getCollectingInfo(item.uuid);
					}else{
						var needColc = item.limit;
						var havedColc = item.collecting;
						var percent = Math.ceil(havedColc / needColc * 100);
						document.getElementById('hami-product').innerText = item.scode;
						document.getElementById('hami-prouuid').innerText=item.uuid;
						document.getElementById('needColc').innerText = item.limit;
						document.getElementById('havedColc').innerText = item.collecting;
						document.getElementById("pool_rate").innerHTML = percent + "%";
						clearInterval(poolValue);
						poolValue = setInterval('WaveMove(' + percent + ')', 100); //开启水池效果
						offCanvasWrapper.offCanvas('close');
					}
				}
			});
		});
	}, 800);
	btn_more.addEventListener('tap', function() {
		pullupRefresh();
	});
}

//侧滑容器父节点
var offCanvasWrapper = mui('#offCanvasWrapper');
//主界面容器
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
//菜单容器
var offCanvasSide = document.getElementById("offCanvasSide");
//移动效果是否为整体移动
var moveTogether = true;
//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
var classList = offCanvasWrapper[0].classList;
//变换侧滑动画移动效果；
if (moveTogether) {
	//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
	offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
}
classList.add('mui-scalable');
//主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll({
	bounce: true,
	indicators: true //是否显示滚动条
});
mui('#offCanvasContentScroll').scroll();
//实现ios平台的侧滑关闭页面；
if (mui.os.plus && mui.os.ios) {
	offCanvasWrapper[0].addEventListener('shown', function(e) { //菜单显示完成事件
		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
	});
	offCanvasWrapper[0].addEventListener('hidden', function(e) { //菜单关闭完成事件
		plus.webview.currentWebview().setStyle({
			'popGesture': 'close'
		});
	});
}
//打开详情界面
document.getElementById('opendeail').addEventListener('tap', function() {
	var proId = document.getElementById('hami-prouuid').innerText;
	plus.storage.setItem("currentUUID", proId); 
	mui.openWindow({
		url: 'inp_collected.html',
		id: 'inp_collected',
		show: {
			autoShow: false, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: 300
		},
		waiting: {
			autoShow: true,
			title: '疯狂加载中...'
		}
	});
});
document.getElementById('secu_vote_detail').addEventListener('tap', function() {
	var proId = document.getElementById('hami-prouuid').innerText;
	plus.storage.setItem("currentUUID", proId); 
	mui.openWindow({
		url: 'inp_collected.html',
		id: 'inp_collected',
		show: {
			autoShow: false, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: 300
		},
		waiting: {
			autoShow: true,
			title: '疯狂加载中...'
		}
	});
});
//控制选择的值为0
mui('#box_cut')[0].addEventListener('tap', function() {
	var val = mui('#box')[0].value;
	if (val <= 0) {
		mui('#box')[0].value = 1;
	}
});
//支付
document.getElementById('pay-finish').addEventListener('tap', function() {
	var pay = document.getElementById("box").value;
	var proId = document.getElementById('hami-prouuid').innerText;
	if (collcInfo != null) {
//		mui.each(collcInfo, function(i, item) {
//			if (item.scode == code) {
//				proId = item.uuid;
//			}
//		});
		var sendInfo = "prodName:" + proId + ",pay:" + pay;
		console.log(sendInfo);
		plus.nativeUI.showWaiting("正在支付...");
		mui.ajax(witnUrl + 'buyProductAction_buy.action', {
			data: {
				sendInfo: sendInfo
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.result == "payerror") {
					plus.nativeUI.closeWaiting();
					alert("支付失败");
				} else if (data.result == "paysuccess") {
					plus.nativeUI.closeWaiting();
					alert("支付成功");
					refreshcode=data.inPool.scode;
					var needColc = data.inPool.limit;
					var havedColc = data.inPool.collecting;
					var percent = Math.ceil(havedColc / needColc * 100);
					document.getElementById('hami-product').innerText = data.inPool.scode;
					document.getElementById('needColc').innerText = data.inPool.limit;
					document.getElementById('havedColc').innerText = data.inPool.collecting;
					document.getElementById("pool_rate").innerHTML = percent + "%";
					clearInterval(poolValue);
					poolValue = setInterval('WaveMove(' + percent + ')', 100); //开启水池效果
					//plus.storage.setItem("LoginInfo", sendInfo); 
				} else {
					plus.nativeUI.closeWaiting();
					alert("支付失败");
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				alert("网络异常，请检查您的网络连接");
			}
		});
	}
});

//打开支付界面
document.getElementById("btn").addEventListener('tap', function(event) {
	var money = document.getElementById("box").value;
	document.getElementById("money").innerHTML = '<h5>需支付</h5><h5>' + money + '</h5>';
	mui('#pay')[0].innerHTML = '<a href="#hami-pay"><b>支付</b></a>';
});
//加载集资的数据
//获取正在集资信息
function getCollectingInfo(proIds) {
	var sendInfo = "productCode:" + proIds;
	console.log(sendInfo);
	plus.nativeUI.showWaiting();
	mui.ajax(witnUrl + 'colProductAction_getcollectingInfo.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.reason == '0') {
				alert("获取数据失败！");
			} else if (data.reason == '1') {
				var needColc = data.result.limit;
				var havedColc = data.result.collecting;
				var percent = Math.ceil(havedColc / needColc * 100);
				document.getElementById('hami-product').innerText = data.result.scode;
				document.getElementById('hami-prouuid').innerText=data.result.uuid;
				document.getElementById('needColc').innerText = data.result.limit;
				document.getElementById('havedColc').innerText = data.result.collecting;
				document.getElementById("pool_rate").innerHTML = percent + "%";
				clearInterval(poolValue);
				poolValue = setInterval('WaveMove(' + percent + ')', 100); //开启水池效果
				offCanvasWrapper.offCanvas('close');
				plus.nativeUI.closeWaiting();
			} else if(data.error_code=='shortparam'){
				alert("没有参数！");
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			alert("网络异常，请检查您的网络连接");
		}
	});
}
//初始加载
//TODO
window.onload = function() { //onload事件完成之后才会显示这个界面  但是可以异步
	mui.plusReady(function() {
		var sendInfo = "collecting:collectingInfo";
		if (sendInfo != null) {
			//plus.nativeUI.showWaiting("别急加载数据中...");
			console.info(sendInfo);
			mui.ajax(witnUrl + 'colProductAction_collcting.action', {
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
					} else if (data.reason == "请求成功！") {
						plus.nativeUI.closeWaiting();
						//界面初始化
						var needColc = data.result[0].limit;
						var havedColc = data.result[0].collecting;
						var percent = Math.ceil(havedColc / needColc * 100);
						document.getElementById('hami-product').innerText = data.result[0].scode;
						document.getElementById('hami-prouuid').innerText=data.result[0].uuid;
						document.getElementById('needColc').innerText = data.result[0].limit;
						document.getElementById('havedColc').innerText = data.result[0].collecting;
						document.getElementById("pool_rate").innerHTML = percent + "%";
						poolValue = setInterval('WaveMove(' + percent + ')', 100); //开启水池效果
						collcInfo = data.result;
						collcInfolength = data.result.length;
						mui.currentWebview.show('zoom-fade-out');
					} else {
						alert("未知问题");
						plus.nativeUI.closeWaiting();
						mui.currentWebview.show();
						poolValue = setInterval('WaveMove(0)', 100);
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.closeWaiting();
					alert("网络异常，请检查您的网络连接");
					mui.currentWebview.show();
					poolValue = setInterval('WaveMove(0)', 100);
				}
			});
			pullupRefresh(); //初始化侧滑栏数据
		}
	});
	//图形
	var getOption = function() {
		var dates = ['1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日', '1月9日', '1月10日', '1月11日', '1月12日', '11月13日'];
		var collec = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
		var pepNum = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3];
		var option = {
			grid: {
				x: 35,
				x2: 15,
				y: 45,
				y2: 25
			},
			title: {
				text: '集资详情',
				textStyle: {
					fontSize: 14,
					color: '#FFFFFF',
					fontFamily: '微软雅黑'
				}
			},
			tooltip: {
				trigger: 'axis'

			},
			legend: {
				data: ['集资总额', '集资人数'],
				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
					color: '#FFFFFF',
					fontFamily: '微软雅黑'
				}
			},
			dataZoom: {
				orient: 'horizontal', // 布局方式，默认为水平布局，可选为：
				// 'horizontal' ¦ 'vertical'
				// x: {number},            // 水平安放位置，默认为根据grid参数适配，可选为：
				// {number}（x坐标，单位px）
				// y: {number},            // 垂直安放位置，默认为根据grid参数适配，可选为：
				// {number}（y坐标，单位px）
				width: 800, // 指定宽度，横向布局时默认为根据grid参数适配
				height: 200, // 指定高度，纵向布局时默认为根据grid参数适配
			},

			calculable: true,
			xAxis: [{
				axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
					show: true,
					rotate: 0,
					margin: 8,
					textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						color: '#FFFFFF',
						fontSize: 12,
						fontFamily: '微软雅黑'
					}
				},
				axisLine: { // 坐标轴线
					show: false, // 默认显示，属性show控制显示与否
				},
				splitLine: { // 分隔线
					show: false // 默认显示，属性show控制显示与否
				},
				axisTick: { // 坐标轴小标记
					show: true, // 属性show控制显示与否，默认不显示
					interval: 'auto',
					inside: false, // 控制小标记是否在grid里 
					length: 5, // 属性length控制线长
					lineStyle: { // 属性lineStyle控制线条样式
						color: '#FFFFFF',
						width: 1
					}
				},
				type: 'category',
				data: dates
			}],
			yAxis: [{
				axisLabel: { // 坐标轴文本标签
					show: true,
					rotate: 0,
					margin: 8,
					textStyle: { // 其余属性默认使用全局文本样式
						color: '#FFFFFF'
					}
				},
				axisLine: { // 坐标轴线
					show: false, // 默认显示，属性show控制显示与否
				},
				type: 'value'
			}],
			series: [{
				name: '集资总额',
				type: 'bar',
				data: collec,
				markPoint: {
					data: [{
						type: 'max',
						name: '最大值'
					}, {
						type: 'min',
						name: '最小值'
					}]
				},
				markLine: {
					data: [{
						type: 'average',
						name: '平均值'
					}]
				}
			}, {
				name: '集资人数',
				type: 'bar',
				data: pepNum,
				markPoint: {
					data: [{
						name: '年最高',
						value: 182.2,
						xAxis: 7,
						yAxis: 183,
						symbolSize: 18
					}, {
						name: '年最低',
						value: 2.3,
						xAxis: 11,
						yAxis: 3
					}]
				},
				markLine: {
					data: [{
						type: 'average',
						name: '平均值'
					}]
				}
			}]
		}
		return option;
	};

	var getCOption = function() {
		var option = {
			title: {
				text: '每日投资情况',
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
				data: ['集资数量']
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
				name: '集资数量',
				type: 'line',
				smooth: true,
				itemStyle: {
					normal: {
						areaStyle: {
							type: 'default'
						}
					}
				},
				data: [998, 948, 888, 1100, 677, 888, 999],
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

	var barChart = echarts.init(document.getElementById('KChart'));
	barChart.setOption(getOption()); //TODO  也可以换成收益情况

	var cChart = echarts.init(document.getElementById('CChart'));
	cChart.setOption(getCOption());
}
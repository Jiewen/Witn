mui.init({

});
//document.getElementById('clickDetail').addEventListener('tap', function() {
//	plus.storage.setItem("currentUUID", item.uuid); 
//	mui.openWindow({
//		url: 'inp_collected.html',
//		id: 'inp_collected',
//		show: {
//			autoShow: true, //页面loaded事件发生后自动显示，默认为true
//			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
//			duration: 300
//		}
//	});
//});
document.getElementById('haveCollected').addEventListener('tap', function() {
	var uuids=document.getElementById('uuids').innerHTML;
	var uname=document.getElementById('uname').innerHTML;
//	plus.storage.setItem("currentUUIDs", uuids); 
	alert(uuids+""+uname);
	mui.openWindow({
		url: 'inp_earnings_total.html',
		id: 'inp_earnings_total',
		show: {
			autoShow: false, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
			duration: 300
		},
		extras:{
			proid:uuids,
			proname:uname
		},
		waiting: {
			autoShow: true,
			title: '像疯子一样加载中...' //等待对话框上显示的提示内容
		}
	});
});
//加载数据
var earningInfo;
mui.plusReady(function() {
	var sendInfo = "earning:earningInfo";
	if (sendInfo != null) {
		//plus.nativeUI.showWaiting("别急加载数据中...");
		mui.ajax(witnUrl + 'colProductAction_income.action', {
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
				} else if (data.error_code == "0") {
					plus.nativeUI.closeWaiting();
					//界面初始化
					earningInfo = data.result;
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
	}
});
(function($) {
	//阻尼系数
	var deceleration = mui.os.ios ? 0.00003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: false, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							ul.insertBefore(createFragment(ul, index, 3, true), ul.firstChild);
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							ul.appendChild(createFragment(ul, index, 3));
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			}).pullDownLoading();
		});

		function isNULL(values) {
			if (values == null) {
				var myDate = new Date();
				return myDate.getTime();
			} else {
				return values;
			}
		}
		var count=0;
		//创建节点
		var createFragment = function(ul, index, count, reverse) {
			var length = ul.querySelectorAll('li').length;
			var fragment = document.createDocumentFragment();
			var li;
			mui.each(earningInfo, function(i, item) {
				count++;
				li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.innerHTML = '<div class="hami-earning-click mui-slider-right mui-disabled">' +
					'<a id="more_"' + i + ' class="mui-btn mui-btn-yellow iconfont icon-view"></a>' +
					'</div>' +
					'<div class="mui-slider-handle hami-item-box" style="border-right:2px solid rgb(240, 173, 78);">' +
					'<span>' + item.scode + '<font>集资时间：' + isNULL(item.issue_time) + '→' + isNULL(item.frend_time) + '</font></span>' +
					'<table cellspacing="0px" cellpadding="0px">' +
					'<tr>' +
					'<th rowspan="2">' +
					'<img src="../img/icon/mine_photo_default.png" />' +
					'</th>' +
					'<td>购买人次</td>' +
					'<td>共集资</td>' +
					'<td>历史收益</td>' +
					'</tr>' +
					'<tr class="hami-up">' +
					'<td>807' + i + '</td>' +
					'<td>' + item.limit + '</td>' +
					'<td>-1203' + i + '</td>' +
					'</tr>' +
					'</table>' +
					'</div>';
				fragment.appendChild(li);
				//详情界面
				li.getElementsByClassName('hami-earning-click')[0].addEventListener('tap', function() {
					plus.storage.setItem("currentUUID", item.uuid);
					mui.openWindow({
						url: 'inp_collected.html',
						id: 'inp_collected',
						show: {
							autoShow: true, //页面loaded事件发生后自动显示，默认为true
							aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
							duration: 300
						}
					});
				});
				//取值事件
				li.getElementsByClassName('mui-slider-handle')[0].addEventListener('tap', function() {
					var totalCollecVal = this.getElementsByTagName('tr')[1].children[1].innerHTML;
					var haveEarVal = this.getElementsByTagName('tr')[1].children[2].innerHTML;
					document.getElementById('lastEarn').innerHTML = totalCollecVal + '.00元';
					document.getElementById('totalCollec').innerHTML = totalCollecVal + '元';
					document.getElementById('haveEar').innerHTML = haveEarVal + '元';
					document.getElementById('uuids').innerHTML =  item.uuid;
					document.getElementById('uname').innerHTML = item.scode;
					mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
				});

			});
			return fragment;
		};
	});
})(mui);
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui.init({
	swipeBack: true //启用右滑关闭功能
});
var slider = mui("#slider");
slider.slider({
	interval: 3000
});
//预加载页面
mui.plusReady(function() {
	mui.preload({
		url: 'ui/inp_qa.html',
		id: 'inp_qa'
	});
});
document.getElementById("inp_qa").addEventListener('tap', function() {
	openWindow('inp_qa');
});
//打开正在集资界面
document.getElementById('collecting').addEventListener('tap', function() {
	mui.openWindow({
		url: 'ui/inp_collecting.html',
		id: 'inp_collecting',
		show: {
			autoShow: false, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: 300,
			title: '正在加载'
		},
		waiting: {
			autoShow: true,
			title: '疯狂加载中...' //等待对话框上显示的提示内容
		}
	});
});
//打开正在揭晓
document.getElementById('publishing').addEventListener('tap', function() {
	mui.openWindow({
		url: 'ui/inp_publishing.html',
		id: 'publishing',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: 300
		},
		waiting: {
			title: '正在加载...', //等待对话框上显示的提示内容
		}
	});
});
//打开正在收益
document.getElementById('earnings').addEventListener('tap', function() {
	mui.openWindow({
		url: 'ui/inp_earnings.html',
		id: 'earnings',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'zoom-fade-out', //页面显示动画，默认为”slide-in-right“；
			duration: 300
		},
		waiting: {
			title: '正在加载...', //等待对话框上显示的提示内容
		}
	});
});
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
mui.plusReady(function() {
	//关闭等待框
	plus.nativeUI.closeWaiting();
	//显示当前页面
	mui.currentWebview.show();
});

var inp_trecommend = document.getElementById("inp_trecommend");
var inp_information = document.getElementById("inp_information");
var information,recomment;

function plusReady() {
	mui.ajax(witnUrl + 'recommendAction_listAll.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if (data.length == 0) {
				inp_trecommend.innerHTML = "<h4>今日推荐</h4><div class='hami-nothing'><font>今日无推荐</font></div>";
			} else {
				recomment = data;
				var inp_trecommend_html = "<h4>今日推荐</h4><ul class='mui-table-view'>";
				var i=0;
				data.forEach(function(e) {
					inp_trecommend_html += "<li class='mui-table-view-cell mui-media' data-index='"+(i++)+"'><a href='javascript:void(0)'>" +
						"<img class='mui-media-object mui-pull-left' src='" + witnUrl + "../" + e.stocklogo + "'>" +
						"<div class='mui-media-body'>" + e.company_name + "<p class='mui-ellipsis'>" + e.reason + "</p></div></a></li>"
				});
				inp_trecommend_html += "</ul>";
				inp_trecommend.innerHTML = inp_trecommend_html;
				activeRecommentClick();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("error" + type);
		}
	});
	mui.ajax(witnUrl + 'secuAction_getInfomation.action', {
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			information = data.Infomation;
			if (information.length == 0) {
				inp_information.innerHTML = "<h4>今日资讯</h4><div class='hami-nothing'><font>今日无资讯</font></div>";
			} else {
				var i =0;
				var inp_trecommend_html = "<h4>今日资讯</h4><ul class='mui-table-view'>";
				information.forEach(function(e) {
					inp_trecommend_html += "<li class='mui-table-view-cell mui-media' data-index='"+(i++)+"'><a href='javascript:void(0)'>" +
									"<img class='mui-media-object mui-pull-left' src='"+ witnUrl + "../" + e.VC_TITLEIMG +"'>"+
									"<div class='mui-media-body'>"+e.VC_TITLE+
									"<p class='mui-ellipsis'>"+e.VC_CONTENT+"</p></div></a></li>"
				});
				inp_trecommend_html += "</ul>";
				inp_information.innerHTML = inp_trecommend_html;
				activeInformationClick();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log("error" + type);
		}
	});
}

function activeRecommentClick(){
	mui("#inp_trecommend li").each(function(){
		this.addEventListener("tap",function(){
			var index = this.dataset.index;
			var liData = recomment[index];
			mui.alert(liData.reason);
		})
	})
}

function activeInformationClick(){
	mui("#inp_information li").each(function(){
		this.addEventListener("tap",function(){
			var index = this.dataset.index;
			sendData = information[index];
			mui.openWindow({
				url: 'ui/title_content_show.html',
				id: 'title_content_show',
				createNew: false, //是否创建具有同样ID的页面
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
					duration: 300
				},
				extras: {
					sendData: sendData
				},
				waiting: {
					autoShow: false,
				}
			})
		});
	})
}

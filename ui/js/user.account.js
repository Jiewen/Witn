var page = 3;
var num = 5;
var sendInfo = "";
var hami_loading = document.getElementById("hami_loading");
var accountContainer = document.getElementById("accountContainer");
var accountList = document.getElementById("accountList");
var pullStaus = 1; //1 刷新所有  2 加载更多
var firstLoad = true;

mui.init({
	pullRefresh: {
		container: accountContainer,
		down: {
			callback: pullupFresh
		},
		up: {
			callback: pulldownLoad
		}
	}
});

function pullupFresh() {
	pullStaus = 1;
	accountRefresh(1,page*num);
}

function pulldownLoad() {
	pullStaus = 2;
	if (firstLoad) { //首次加载  加载多条
		accountRefresh(1, page * num); //加载
		firstLoad = false;
	} else {
		accountRefresh(page, num);
	}
	page++; //页数加1
}
if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#accountContainer').pullRefresh().pullupLoading();
		}, 800);

	});
} else {
	mui.ready(function() {
		mui('#accountContainer').pullRefresh().pullupLoading();
	});
}

/** 
 *
 * @param {Object} p第几页
 * @param {Object} n每页多少条
 */
function accountRefresh(p, n) {
	console.log( p+"======="+n );
	sendInfo = "page:" + p + ",num:" + n;
	mui.ajax(witnUrl + 'accExpenseAction_getBill.action', {
		data: {
			sendInfo: sendInfo
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if( data.result=="success" ){
				var pageResult = data.pageResult.rows;
			console.log( data.pageResult.rows.length );
			var accountListHtml = "";
			if( pullStaus==2 ){
				accountListHtml = accountList.innerHTML;  //加载更多
				if( pageResult.length==0 ){  //说明没有数据了
					mui('#accountContainer').pullRefresh().endPullupToRefresh(true);
				}else{
					mui('#accountContainer').pullRefresh().endPullupToRefresh(false);
				}
			}else{
				mui('#accountContainer').pullRefresh().endPulldownToRefresh();
			}
			pageResult.forEach(function(e){
				accountListHtml += "<li class='mui-table-view-cell'><span>"+e.ae_status+"<label>"+e.ae_time+"</label></span><font>"+e.remark+"</font></li>";
			});
			accountList.innerHTML = accountListHtml;
			}else{
				mui('#accountContainer').pullRefresh().endPullupToRefresh(true);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);  //有错
			mui('#accountContainer').pullRefresh().endPullupToRefresh(true);
		}
	});
}
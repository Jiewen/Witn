mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
var getOption = function() {
	var option = {
		title: {
			text: '期间涨跌',
			padding: 15,
			textStyle: {
				fontSize: 14,
				color: '#777',
			}
		},
		//  tooltip : {
		//      trigger: 'axis'
		//  },
		tooltip: {
			trigger: 'axis',
			formatter: "{c}%"
		},
		grid: {
			x: 40,
			x2: 15,
			y: 45,
			y2: 25
		},
		legend: {
			padding: 15,
			data: ['期间涨跌']
		},

		calculable: false,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: ['10/19', '10/19', '10/19', '10/19', '10/19', '10/19', '10/19']
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				show: true,
				interval: 'auto',
				formatter: '{value} %'
			}
		}],
		series: [{
			name: '期间涨跌',
			type: 'line',
			smooth: true,
			itemStyle: {
				normal: {
					areaStyle: {
						type: 'default'
					}
				}
			},
			data: [10, 8.5, 7.5, -5.6, 9.0, 10.0, -8.9],
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
barChart.setOption(getOption());

mui.plusReady(function() {
	//每个页面都调用这个函数   webview模式的页面都预加载一下
//	mui.preload({
//		url: 'secu_record.html',
//		id: 'secu_record'
//	});
});
function temp(){
	mui.openWindow({
    url:'secu_record.html',
    id:'secu_record',
    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
    //页面loaded事件发生后自动显示，默认为true
//  show:{
//    autoShow:false
//  },
    waiting:{
      autoShow:true,//自动显示等待框，默认为true
      title:'正在加载数据，请稍后...'//等待对话框上显示的提示内容
    }
})
}

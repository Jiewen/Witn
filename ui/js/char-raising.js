mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
var getOption = function() {

	var option = {
		color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
			'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
			'#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
			'#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
		],

		title: {
			text: '最近收益',
			textStyle: {
				fontSize: 14,
				color: '#FFFFFF',
				fontFamily:'微软雅黑'
			}
		},
		tooltip: {
			trigger: 'axis'

		},
		legend: {
			data: ['涨值', '跌值'],
			textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				color: '#FFFFFF',
				fontFamily:'微软雅黑'
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
					fontFamily:'微软雅黑'
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
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
			name: '涨值',
			type: 'bar',
			data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
			name: '跌值',
			type: 'bar',
			data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
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
var barChart = echarts.init(document.getElementById('KChart'));
barChart.setOption(getOption());
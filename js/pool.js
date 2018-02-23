var _clientwidth = document.body.clientWidth;

var _poolDia = _clientwidth / 2; //水池直径
var canvas = document.getElementById('pool');
//var waterSpaceHeight = _poolDia - heights * _poolDia / 100; //水池距离顶端有高度
//设定canvas的基本属性
canvas.width = _clientwidth / 2;
canvas.height = _clientwidth / 2;
//canvas.style.marginLeft = _poolDia / 2 + "px";
canvas.style.borderRadius = _clientwidth / 2 + "px";
//获取context对象
var context = canvas.getContext("2d");
//设定颜色   水的rgba
context.fillStyle = "rgba(213,94,65,.5)";
context.font = "italic 20px 微软雅黑";
//水的波动常量
var maxPY = Math.PI * 5; //最大偏移量
var indexPY = -maxPY; //起点偏移量  也就是说起点的X值偏移了多少 
var indexCH = _poolDia / (2*Math.PI); //波的个数
var blHeight = _poolDia/100;   //波高
var speed = 0.5; //速度
var startX = 0; //绘制起点X 下同理
var startY = 0;
var currX = 0; //当前点X
var currY = 0;
var endX = 0;
var endY = 0;
//WaveMove();
//setInterval('WaveMove()', 100);
//水的波动
function WaveMove(heights) {
	var waterSpaceHeight = _poolDia - heights * _poolDia / 100;
	context.clearRect(0, 0, _poolDia, _poolDia);
	context.beginPath();
	startX = 0;
	startY = waterSpaceHeight + Math.sin(startX)*5;
	for (var i = 0; i < _poolDia-indexPY; i = i + 1) {
		currX = i;
		currY = Math.sin(currX/indexCH+indexPY)*blHeight   + waterSpaceHeight;
		context.lineTo(currX, currY);
	}
	
	context.lineTo(_poolDia, _poolDia);
	context.lineTo(startX,_poolDia);
	context.lineTo(startX,startY);
	context.fill();
	context.closePath();
	indexPY = indexPY + speed;
	if (indexPY >= -Math.PI) {
		indexPY = -maxPY;
	}
	
}
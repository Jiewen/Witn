mui.init({ 
	preloadPages:[
    {
      url:"user_ctc_chat.html",
      id:"user_ctc_chat"
    }]
	});
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

mui("#user_pl_list li").each(function(){
	this.addEventListener('tap',function(){
		openWindow("user_ctc_chat");
	});
});

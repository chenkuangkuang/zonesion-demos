

$(function(){


    //轮播图
    $("#banner").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:1});

    //首页下方三项导航
    $(".content-right-1 ul li").mouseover(function(){
        $(this).addClass("content-active").siblings().removeClass("content-active");
        var con = $(this).index();
        $(".content-right-2>ul>li:eq("+con+")").addClass("content-li-active").siblings().removeClass("content-li-active");
    })

    //兼容360兼容模式，左列表鼠标移入效果
    $(".project-li-not").hover(function(){
        if($(this).attr("class").split(" ")[1]=="project-li-not"){
            $(this).stop().addClass("project-li-not-active").children("a").css("color", "#fff").animate({textIndent: "-=30px"}, 200);
        }
    },function(){
        if($(this).attr("class").split(" ")[1]=="project-li-not") {
            $(this).stop().removeClass("project-li-not-active").children("a").css("color", "#444").animate({textIndent: "+=30px"}, 200);
        }
    })
    $(".product-li-not").hover(function(){
        if($(this).attr("class").split(" ")[1]=="product-li-not"){
            $(this).stop().addClass("product-li-not-active").children("a").css("color", "#fff").animate({textIndent: "-=30px"}, 200);
        }
    },function(){
        if($(this).attr("class").split(" ")[1]=="product-li-not") {
            $(this).stop().removeClass("product-li-not-active").children("a").css("color", "#444").animate({textIndent: "+=30px"}, 200);
        }
    })

    //首页成功案例定时效果
    var i=0;
    function changei(){
        $(".content .content-left ul li:eq("+i+")").addClass("success-active").animate({paddingLeft:"8px"},300).siblings().removeClass("success-active").animate({paddingLeft:"0"},300);
        i++;
        if(i==$(".content .content-left ul li").length){
            i=0;
        }
    }
    setInterval (changei, 1500);

    $(".content .content-left ul li").mouseover(function(){
        i=$(this).index();
    })


    //判断分类页面，添加样式到menu和project_li
    var $now_html=$(".about-img1-1").text();
    switch ($now_html)
    {
        case "关于我":
            addMenuClass(0);
            break;
        case "工商代":
            addMenuClass(1);
            break;
        case "会计代":
            addMenuClass(2);
            break;
        case "资质代":
            addMenuClass(3);
            break;
        case "成功案":
            addMenuClass(4);
            break;
        case "联系我":
            addMenuClass(5);
            break;
        case "用户登":
            $(".header-welcome div a").css("color","#000");
            break;
    }
    function addMenuClass(a){
        $(".menu_li:eq("+a+")").addClass("menu_active").siblings().removeClass("menu_active");
        $(".project-li:eq("+(a-1)+")").addClass("project-li-active").removeClass("project-li-not").siblings().addClass("project-li-not").removeClass("project-li-active");
    }

    //判断文章详情类别页面，添加样式到menu和project_li
    var $news_html=$(".news-position a:eq(1)").text();

    switch($news_html){
        case "工商代理":
            addNewsClass(1);
            break;
        case "会计代账":
            addNewsClass(2);
            break;
        case "资质代理":
            addNewsClass(3);
            break;
    }
    function addNewsClass(b){
        $(".menu_li:eq("+b+")").addClass("menu_active").siblings().removeClass("menu_active");
        $(".project-li:eq("+(b-1)+")").addClass("project-li-active").removeClass("project-li-not").siblings().addClass("project-li-not").removeClass("project-li-active");
        $(".product-li:eq("+(b-1)+")").addClass("product-li-active").removeClass("product-li-not").siblings().addClass("product-li-not").removeClass("product-li-active");
    }

    //阴影特效
    $('.content-left-header').longShadow({
        colorShadow: '#a00',
        sizeShadow: 70
    });$('.project-header').longShadow({
        colorShadow: '#a00',
        sizeShadow: 70
    });

    //产品页面，进入后判断类别，在菜单和类别名添加效果
    var navHeader = $(".project-header span").text();
    switch(navHeader){
        case "工商代理":
            addNewsClass(1);
            break;
        case "会计代账":
            addNewsClass(2);
            break;
        case "资质代理":
            addNewsClass(3);
            break;
    }
    var h1 = $(".pro-title1").text();
    var nav1=$(".product-li");

    for(var b=0;b<nav1.length;b++){
        var navT = $(".product-li:eq("+b+")");
        if(navT.text()==h1){
            navT.addClass("product-li-active").removeClass("product-li-not").siblings().addClass("product-li-not").removeClass("product-li-active");
        }
    }
    //项目页面，根据tag修改背景色
    var group =$(".product-group");
    for(var a=0;a<group.length;a++){
        var groupT =$(".product-group:eq("+a+")").text();
        switch(groupT){
            case "公司注册":
                $(".product-group:eq("+a+")").css("background","#800000");
                break;
            case "公司注销":
                $(".product-group:eq("+a+")").css("background","#D2691E");
                break;
            case "公司变更":
                $(".product-group:eq("+a+")").css("background","#ffeb94");
                break;
        }
    }
    var btnT;
    $(".product-btn").mouseover(function(){
        btnT = $(this).text();
        $(this).text("查看详情");
    }).mouseout(function(){
        $(this).text(btnT);
        btnT="";
    })

    checkPrice();

    function checkPrice(){
        var price = $("#pro-price").text();

        if(price.length <3){
            $("#pro-price").text("暂无价格");
        }
    }
})

//页尾待select跳转函数，不放在$(function)中

function MM_jumpMenu(targ,selObj,restore){
    eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
    if(restore) selObj.selectedIndex=0;
}


$(function(){
    $(".content-right-1 ul li").mouseover(function(){
        $(this).addClass("content-active").siblings().removeClass("content-active");
        var con = $(this).index();
        $(".content-right-2>ul>li:eq("+con+")").addClass("content-li-active").siblings().removeClass("content-li-active");
    })

    $(".project .project-nav ul .project-li-not").mouseover(function(){
        $(this).children("a").css("color","#fff");
    }).mouseout(function(){
        $(this).children("a").css("color","#444");
    })

    $(".banner").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:1});

    var i=0;
    function changei(){
        $(".content .content-left ul li:eq("+i+")").addClass("success-active").animate({paddingLeft:"8px"},300).siblings().removeClass("success-active").animate({paddingLeft:"-8px"},300);
        i++;
        if(i==$(".content .content-left ul li").length){
            i=0;
        }
    }
    setInterval (changei, 1500);

    $(".content .content-left ul li").mouseover(function(){
        i=$(this).index();
    })


})

//待select跳转函数，不放在$(function)中

function MM_jumpMenu(targ,selObj,restore){
    eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
    if(restore) selObj.selectedIndex=0;
}
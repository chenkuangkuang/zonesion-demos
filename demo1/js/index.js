

$(function(){


    //�ֲ�ͼ
    $("#banner").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:1});

    //��ҳ�·������
    $(".content-right-1 ul li").mouseover(function(){
        $(this).addClass("content-active").siblings().removeClass("content-active");
        var con = $(this).index();
        $(".content-right-2>ul>li:eq("+con+")").addClass("content-li-active").siblings().removeClass("content-li-active");
    })

    //����360����ģʽ�����б��������Ч��
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

    //��ҳ�ɹ�������ʱЧ��
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


    //�жϷ���ҳ�棬�����ʽ��menu��project_li
    var $now_html=$(".about-img1-1").text();
    switch ($now_html)
    {
        case "������":
            addMenuClass(0);
            break;
        case "���̴�":
            addMenuClass(1);
            break;
        case "��ƴ�":
            addMenuClass(2);
            break;
        case "���ʴ�":
            addMenuClass(3);
            break;
        case "�ɹ���":
            addMenuClass(4);
            break;
        case "��ϵ��":
            addMenuClass(5);
            break;
        case "�û���":
            $(".header-welcome div a").css("color","#000");
            break;
    }
    function addMenuClass(a){
        $(".menu_li:eq("+a+")").addClass("menu_active").siblings().removeClass("menu_active");
        $(".project-li:eq("+(a-1)+")").addClass("project-li-active").removeClass("project-li-not").siblings().addClass("project-li-not").removeClass("project-li-active");
    }

    //�ж������������ҳ�棬�����ʽ��menu��project_li
    var $news_html=$(".news-position a:eq(1)").text();

    switch($news_html){
        case "���̴���":
            addNewsClass(1);
            break;
        case "��ƴ���":
            addNewsClass(2);
            break;
        case "���ʴ���":
            addNewsClass(3);
            break;
    }
    function addNewsClass(b){
        $(".menu_li:eq("+b+")").addClass("menu_active").siblings().removeClass("menu_active");
        $(".project-li:eq("+(b-1)+")").addClass("project-li-active").removeClass("project-li-not").siblings().addClass("project-li-not").removeClass("project-li-active");
        $(".product-li:eq("+(b-1)+")").addClass("product-li-active").removeClass("product-li-not").siblings().addClass("product-li-not").removeClass("product-li-active");
    }

    //��Ӱ��Ч
    $('.content-left-header').longShadow({
        colorShadow: '#a00',
        sizeShadow: 70
    });$('.project-header').longShadow({
        colorShadow: '#a00',
        sizeShadow: 70
    });

    //��Ʒҳ�棬������ж�����ڲ˵�����������Ч��
    var navHeader = $(".project-header span").text();
    switch(navHeader){
        case "���̴���":
            addNewsClass(1);
            break;
        case "��ƴ���":
            addNewsClass(2);
            break;
        case "���ʴ���":
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
    //��Ŀҳ�棬����tag�޸ı���ɫ
    var group =$(".product-group");
    for(var a=0;a<group.length;a++){
        var groupT =$(".product-group:eq("+a+")").text();
        switch(groupT){
            case "��˾ע��":
                $(".product-group:eq("+a+")").css("background","#800000");
                break;
            case "��˾ע��":
                $(".product-group:eq("+a+")").css("background","#D2691E");
                break;
            case "��˾���":
                $(".product-group:eq("+a+")").css("background","#ffeb94");
                break;
        }
    }
    var btnT;
    $(".product-btn").mouseover(function(){
        btnT = $(this).text();
        $(this).text("�鿴����");
    }).mouseout(function(){
        $(this).text(btnT);
        btnT="";
    })

    checkPrice();

    function checkPrice(){
        var price = $("#pro-price").text();

        if(price.length <3){
            $("#pro-price").text("���޼۸�");
        }
    }
})

//ҳβ��select��ת������������$(function)��

function MM_jumpMenu(targ,selObj,restore){
    eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
    if(restore) selObj.selectedIndex=0;
}


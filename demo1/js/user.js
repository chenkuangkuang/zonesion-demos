
$(function(){
    //路由
    function home(){}
    var allroutes = function() {
        var route = window.location.hash.slice(2);
        // console.log(route);
        // console.log(route.indexOf("/"));
        var pageid1 = route, pageid2;
        if(route.indexOf("/")>-1){
            var arr = route.split("/");
            pageid1 = arr[0];
            pageid2 = arr[1];
            // console.log(pageid2);
            $(".plan_content").hide().filter('[data-route=' + pageid2 + ']').show();
            $("#"+pageid2+"Li").addClass("header_active").siblings("li").removeClass("header_active");
            $("#planLi a").attr("href", "#/"+route);
        }
        // 保存本地localStorage
        // localStorage.SmartCupHref = pageId;
        // 隐藏所有右侧content，并显示当前content
        $(".content_nav").hide().filter('[data-route=' + pageid1 + ']').show();
        $("#"+pageid1+"Li").addClass("header_active").siblings("li").removeClass("header_active");
        // $("#"+route+"Li").addClass("header_active").siblings("li").removeClass("header_active");
        // var sections = $('.content_nav');
        // var section;
        // section = sections.filter('[data-route=' + route + ']');
        // if (section.length) {
        //     sections.hide(250);
        //     section.show(250);
        // }
    };
    //
    // define the routing table.
    //
    var routes = {
        '/plan': home,
        '/bulid': home,
        '/display': home,
        '/system': home,
        '/shop': home,
        '/plan/discribe': home,
        '/plan/train': home,
        '/plan/course': home,
        '/plan/environment': home,
        '/plan/resource': home,
        '/plan/education': home,
    };
    //
    // instantiate the router.
    //
    var router = Router(routes);
    //
    // a global configuration setting.
    //
    router.configure({
        on: allroutes
    });
    router.init();
    loadFirstpage();
})
function loadFirstpage(){
    if(location.href.substr(location.href.length-4,4)=="html"){
        location.href +="#/plan";
    }
}
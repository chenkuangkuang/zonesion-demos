//禁用移动端点击300ms
window.addEventListener( "load", function() {
    FastClick.attach( document.body );
}, false );

//标题块点击展开内容简介
$(".container-fluid").on("click",".gird",function (e) {
    var index = $(this).parent("div").index();
    getModal(index);
    var $modal = $("#modal") , $modal0 = $("#modal")[0];
    if(!$modal.hasClass("modal_in modal_show")){
        $modal.addClass("modal_in modal_show").next("#modal-bg").addClass("modal-bg-in");
    }else{
        $modal.removeClass("modal_in modal_show").next("#modal-bg").removeClass("modal-bg-in");
    }
    $(document).on("click",function(ee){
        if($modal0  !== ee.target &&  !$.contains($modal0, ee.target)){
            $modal.removeClass("modal_in modal_show").next("#modal-bg").removeClass("modal-bg-in");
        }
    })
    e.stopPropagation();
})

//模态框点击关闭
$("#closeModal").on("click", function () {
    $(this).parents("#modal").removeClass("modal_in modal_show").next("#modal-bg").removeClass("modal-bg-in");
})

$("#inputTxt").val(localStorage.input);

$("#confirm").on("click",function(){
    var txt = $(this).prev("#inputTxt").val();
    localStorage.input = txt;
})

//替换modal模态框内容
function getModal(i){
    var v_html = eval("html_"+(i+1));
    $("#modal").find("img").attr("src","img/item"+(i+1)+".png").parents("#modal").find("#modal-mess").html(v_html);
}

//获取窗口宽度并打印到左上角
//get_width();

window.onresize=function(){
    get_width();
};

function get_width(){
    var width_dom = document.getElementById('width');
    var width_txt =  window.innerWidth;
    var height_txt =  window.innerHeight;
    width_dom.innerHTML=width_txt+"...."+height_txt;
}

//消息弹出函数
var message_timer = null;
function message_show(t) {
    if (message_timer) {
        clearTimeout(message_timer);
    }
    message_timer = setTimeout(function(){
        $("#toast").removeClass("toast_show");
    }, 3000);
    $("#toast_txt").text(t);
    $("#toast").addClass("toast_show");
}

var html_1 = "<p> 云端开放在线实验平台（InCloudLab)</p>" +
    "<p><b>项目简介：</b>继慕课（MOOC）在线教育之后，面向高校实验室开放在线实验（MOOE）的解决方案，它解决了传统实验室在时间、空间与实验内容等限制，能够在任意时间和地点快速构建复杂度高、隔离性强的各种实验环境。</p>"+
    "<p><b>项目内容：</b>云端开放在线实验室</p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_2 = "<p> 智云大数据教学科研案例(ZCloud-BigDataCase)</p>" +
    "<p><b>项目简介：</b>继慕课（MOOC）在线教育之后，面向高校实验室开放在线实验（MOOE）的解决方案，它解决了传统实验室在时间、空间与实验内容等限制，能够在任意时间和地点快速构建复杂度高、隔离性强的各种实验环境。</p>"+
"<p><b>项目内容：</b>智云大数据教学案例      智云物联网大数据案例     智云电商大数据案例      智云智云城市大数据案例 智云交通大数据案例      智云通信大数据案例</p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_3 = "<p> 智云虚拟仿真开放平台（ZCloud-HCADA/HSIMS）</p>" +
    "<p><b>项目简介：</b>智云虚拟仿真开发平台围绕智云开放互联云中间件平台开发，为物联网项目的应用层和硬件层提供快速的原型验证，降低开发难度和节约开发时间。平台主要包括图形化组态应用和硬件数据源仿真两大模块。</p>"+
    "<p><b>项目内容：</b>智云图形化组态应用      智云硬件数据源仿真  智云在线仿真实验室      智云虚拟现实实验室</p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_4 = "<p> 智能硬件创新创业平台（ZMagic-IHDPlat）</p>" +
    "<p><b>项目简介：</b>智能硬件是继智能手机之后的一个科技概念，通过软硬件结合的方式，对传统设备进行改造，进而让其拥有智能化的功能。智能化之后，硬件具备连接的能力，实现互联网服务的加载，形成“云+端”的典型架构，具备了大数据等附加价值。</p>"+
    "<p><b>项目内容：</b>智能手表   运动手环   健康腕带  体重体脂秤   创意水杯  绿色家居    视频监控  </p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_5 = "<p> 智云综合创新实训工位（ZCloud-FwsPlatform）</p>" +
    "<p><b>项目简介：</b>智云综合创新实训工位是一款物联网工程综合教学实训平台，包含了完整的物联网架构，包括：感知层、网络层和应用层实例的实验实训设备。它以创新性的项目实践网板为基础环境，提供智能家居、智能农业、智能安防、智能医疗、城市环境、智慧工厂、智能考勤等实践组件包，每个实践组件包能够完成一个完整的物联网应用实训案例。</p>"+
    "<p><b>项目内容：</b>实训项目第四章   实训项目第五章</p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_6 = "<p> 智云开放互联云平台（ZCloud）</p>" +
    "<p><b>项目简介：</b>智云物联开放互联云平台，为用户提供物联网中间件快速接入互联网核心能力，提供给可穿戴设备、智能家居、智能车载、传统硬件等项目应用，实现用户与设备及设备与设备之间的互联互通互动，使物联网传感器数据的接入、存储和展现变得轻松简单，让开发者能够快速开发出专业的物联网应用系统。</p>"+
    "<p><b>项目内容：</b>智云物联开放网站         智云网站优秀项目展示  智云物联专家系统         智能家居专家系统  智能农业专家系统         水产养殖专家系统  仪器预约专家系统         远程抄表系统  项目在线测试工具         LabView数据展示系统 </p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_7 = "<p> 实验室基础教学产品（ZDroid/ZXBee）</p>" +
    "<p><b>项目简介：</b>中智讯依托于武汉理工大学2006年合作至今的科研团队，致力于高校嵌入式、互联网+、物联网、云计算学科教学解决方案。面向嵌入式和移动互联网，推出经典的“ZDroid”系列基础教学平台。面向物联网和传感网，推出经典的“ZXBee”系列基础教学平台。</p>"+
    "<p><b>项目内容：</b>智云多网融合物联网教学系统     智云IPv6多网融合教学系统      智云移动互联网教学系统     智云Cortex-M3嵌入式教学系统  嵌入式/移动互联网应用模块    物联网节点&传感器  </p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

var html_8 = "<p> 智慧农业/项目定制（TionLink）</p>" +
    "<p><b>项目简介：</b>中智讯行业物联网事业部为用户提供智慧农业、智慧教室、嵌入式定制等专业服务。智慧农业解决方案基于互联网+思维重新定义现代农业种植、生态、溯源、销售等产业体系，通过智能传感器、无线传输技术、大规模数据处理与远程控制等物联网核心技术，实现科学种植、增产增收、绿色环保、精准营销的目标。</p>"+
    "<p><b>项目内容：</b>智慧农业大棚在线演示      智慧水培工厂在线演示  智慧教室/智能家居在线演示</p>"+
    "<p><b>资料下载：</b><a href='#'>项目书籍</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目光盘</a>&nbsp;&nbsp;&nbsp;<a href='http://www.zhiyun360.com/Home/Projects'>项目彩页</a>&nbsp;&nbsp;&nbsp;<a href='#'>项目视频</a></p>"

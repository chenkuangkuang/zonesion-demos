/***********************************************************************************
 * 文件：FwsSmartCare（老人看护系统）
 *
 * 作者：Chenyang		 2017.08.29
 *
 * 说明：主js包括导航与按钮功能的实现和数据的连接，实现整个系统的功能
 *
 * 修改：Chenyang 	    2017.08.26 	     完成初始版本
 *
 *            Chenyang        2017.08.30         添加android返回键退出，修复模式设置无法保存及其他几个小问题
 *
 *            FangJJ               2017.09.07         验证config.js，添加退出确认等
 * *********************************************************************************/

var router, routes;
var currentColor_r = "",currentColor_g = "",currentColor_b = "";
var current_scene_index;
var local = {
    'scene' : {
        '默认' : {
            'index' : 0,
            'stage1' : {
                'title' : '出门',
                'time' : '08:00',
                'hours' : 11,
                'rgb' : 'red',
                'open' : [1,3,6],
                'tem' : [10, 50],
                'humi' : [10, 50],
                'illum' : [500, 2000],
                'PM' : [0, 135]
            },
            'stage2' : {
                'title' : '在家',
                'time' : '19:00',
                'hours' : 4,
                'rgb' : 'pink',
                'open' : [8,9,10],
                'tem' : [10, 50],
                'humi' : [10, 50],
                'illum' : [500, 2000],
                'PM' : [0, 135]
            },
            'stage3' : {
                'title' : '睡眠',
                'time' : '23:00',
                'hours' : 9,
                'rgb' : 'purple',
                'open' : [3,9,11],
                'tem' : [10, 50],
                'humi' : [10, 50],
                'illum' : [500, 2000],
                'PM' : [0, 135]
            }
        },
        '关爱' : {
            'index' : 1,
            'rgb' : 'red',
            'open' : [0,2,5],
            'tem' : [10, 50],
            'humi' : [10, 50],
            'illum' : [500, 2000],
            'PM' : [0, 135]
        },
        '生日' : {
            'index' : 2,
            'rgb' : 'green',
            'open' : [0,2,5],
            'tem' : [10, 50],
            'humi' : [10, 50],
            'illum' : [500, 2000],
            'PM' : [0, 135]
        }
    },
    'mode' : 'hand',
    'curScene' : '',
    'control' : {
        'elec' : {
            
        },
        'controller' : {
            
        }
    },
    'secure' : {
        'rfid' : {
            '0' : {
                'name' : '王小虎',
                'sex' : '男',
                'rfid' : 'A9C3F735'
            },
            '1' : {
                'name' : '张文兰',
                'sex' : '女',
                'rfid' : '34A100DE'
            },
            '2' : {
                'name' : '徐冰',
                'sex' : '男',
                'rfid' : '00FA43B5'
            }
        },
        'warn' : [
                ['body' , '2017年5月1日-17:00'],
                ['gas' , '2017年5月2日-17:00'],
                ['fire' , '2017年5月3日-17:00']
            ],
        photo_his : {

        },
        rfid_his : {
            '0': {
                'rfid' : '0D69CFF0',
                'name' : '王小虎',
                'sex' : '男',
                'time' : '2017年5月1日-17:00',
                'photo_url' : 'http://a.zhiyun360.com:1001/tmpfs/auto.jpg?-usr=admin&-pwd=admin&14827187246080.591860486044651',
            }
        }
        },
    'set' : {
        'ID' :  config['id'],
        'KEY' :  config['key'],
        'SERVER' :  config['server']
    },
    'camera' : {
        'homeCameraSet' : {
            'addr' : config['homeCameraSet']['addr'],
            'type' : config['homeCameraSet']['type'],
            'user' : config['homeCameraSet']['user'],
            'pw' : config['homeCameraSet']['pw']
        },
        'secureCameraSet' : {
            'addr' : config['secureCameraSet']['addr'],
            'type' : config['secureCameraSet']['type'],
            'user' : config['secureCameraSet']['user'],
            'pw' : config['secureCameraSet']['pw']
        }
    },
    'tem' : [0, 50, 0, 100], //首页温度阈值
    'humi' : [10, 80, 0, 100], // 首页湿度阈值
    'PM' : [0, 200, 0, 500], // 首页PM2.5阈值
    'illum' : [0, 2000, 0, 5000], // 首页光照度阈值
    'socket' : [0, 2200, 0, 8800], // 首页电表功率阈值
    'gas' : 1, // 软件显示的传感器开关
    'fire' : 1, // 软件显示的传感器开关
    'body' : 1, // 软件显示的传感器开关
    'window' : 1, // 软件显示的传感器开关
    'emergency' : 1, // 软件显示的传感器开关
    'alarmLight' : 1, // 软件显示的传感器开关
    'user' : ["徐艳梅", 57, "女"],
    'userHis' : [
        [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37],
        [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    ]
}
var inTimeSet = 0,  //
    inTimeSetTxt = "",  // 默认模式下，当前的时间段名称
    ledLocal,
    // 定义二维码生成div
    qrcode,
    isCurRGB,
    scene_switch,  // 场景开关对象
    switch_lamp,
    switch_fan,switch_curtain, switch_rgb, switch_humidifier, switch_purifier, switch_lock, switch_fridge, switch_washingmachine,
    switch_lamp1={}, switch_lamp2, switch_lamp3, switch_lamp4,
    switch_mode,
    // 预留两个switch对象供自定义对象开关使用
    switch_add,
    switch_socket1, switch_socket2, switch_socket3, switch_socket4, switch_socket5, switch_socket6, switch_socket7, switch_socket8;

var page = {
    curMode : 'hand',
    init : function () {
        var routes = {
            '/health': page.healthRouter,
            '/home': page.homeRouter,
            '/control': page.homeRouter,
            '/control/elec': page.controlRouter,
            '/control/scene': page.controlRouter,
            '/control/controller': page.controlRouter,
            '/secures': page.secureRouter
        };
        var router = Router(routes);
        router.configure();
        router.init();
        this.loadFirstPage();
        // 时间初始化
        this.getTime();
        // 控件初始化
        control.init();
        // 读取localStorage
        page.getLocalStorage();

    },
    weather_init : false,
    getWeather : function () {
        if(!page.weather_init){
            message_show("天气查询中…")
            $.ajax({
                type: "GET",
                url: 'http://api.map.baidu.com/telematics/v3/weather?location=%E6%AD%A6%E6%B1%89&output=json&ak=iPDh1pGEOnyz8ewa6R246UMXMsk6GqLR',
                dataType: "jsonp",
                success: function (data) {
                    var result =  data['results'][0];
                    var index = result['index'];
                    var forcast = result['weather_data'][0];
                    $("#weatherTxt").text(forcast['weather']);
                    $("#weatherWind").text(forcast['wind']);
                    $("#weatherRange").text(forcast['temperature']);
                    $("#weatherCold").text(index[2]['zs']);
                    $("#weatherOut").text(index[0]['des']);
                    $("#weatherColdTxt").text(index[2]['des']);
                    $("#weatherSportTxt").text(index[3]['des']);
                    $("#weatherRaysTxt").text(index[4]['des']);
                    $("#weatherImg").attr("src", data['results'][0]['weather_data'][0]['dayPictureUrl']);
                    page.weather_init = true;
                    message_show("天气信息查询成功！");
                },
                error: function (e) {
                    message_show("天气信息获取失败，请点击天气模块重新获取！");
                    page.weather_init = false;
                },
                compete: function (e) {
                    console.log("compete : " + JSON.stringify(e));
                }
            })
        }
        else{
            message_show("天气已查询！");
        }
    },
    getConfig : function () {
        //on_get_aid_akey(config.id, config.key, config.server);
        $("#id_address").val(config['id']);
        $("#key_address").val(config['key']);
        $("#server_address").val(config['server']);
        $("#home_camera_addr").val(config['homeCameraSet']['addr']);
        $("#home_camera_type").val(config['homeCameraSet']['type']);
        $("#home_camera_user").val(config['homeCameraSet']['user']);
        $("#home_camera_pw").val(config['homeCameraSet']['pw']);
        $("#secure_camera_addr").val(config['secureCameraSet']['addr']);
        $("#secure_camera_type").val(config['secureCameraSet']['type']);
        $("#secure_camera_user").val(config['secureCameraSet']['user']);
        $("#secure_camera_pw").val(config['secureCameraSet']['pw']);
    },
    getLocalStorage : function () {
        if(localStorage.FwsSmartCare) {
            //console.log("读取原localStorage="+JSON.stringify(localStorage.FwsSmartCare));
            //console.log("合并之前的local="+JSON.stringify(local));
            //var newlocal = JSON.parse(localStorage.FwsSmartCare);
            //local = $.extend(local, newlocal);
            local = JSON.parse(localStorage.FwsSmartCare);
            console.log(JSON.stringify(local));
            //根据localStorage还原自定义电器
            if (local['control']['elec']) {
                var name = local['control']['elec']['name'];
                if(name)
                    control.name2Img(name,1);
            }
            //根据localStorage还原场景个数
            if (local['scene']) {
                var obj = local['scene'];
                var num =0;
                for (var i in obj) {
                    if(obj[i]['index']>2){
                        var title = scene.sinName2title[i] ? scene.sinName2title[i] : "sin-other";
                        var newSin = '<div class="sin" data-title="' + title + '"><span>' + i + '模式</span></div>';
                        $(newSin).insertBefore("#sinAdd");
                    }
                    num++;
                }
                if(num>7){
                    $("#sinAdd").addClass("hidden");
                }
            }
            if (local['secure']) {
                if (local['secure']['rfid']) {
                    //console.log("in rfid");
                    var tbody = $("#rfidTable tbody");
                    var data = local['secure']['rfid'];
                    tbody.empty();
                    for (var i in data) {
                        //console.log("rfidTable----i="+i);
                        var tr = '<tr><td><input type="checkbox"/></td><td class="name">' + data[i]['name'] + '</td><td class="sex">' + data[i]['sex'] + '</td>><td class="rfid">' + data[i]['rfid'] + '</td>><td class="actionTd"><a class="edit-id" href="#"data-toggle="modal" data-target="#editModal"  data-type="rfid">编辑</a></td></tr>';
                        $("#rfidTable").append(tr);
                        //$("#rfidTable tr:eq(" + (i+1 )+ ")").find("td[class!='actionTd']").on("click", secure.getCheckbox).attr("title",'rfid');
                    }
                }
                if(local['secure']['warn']){
                    var warn_arr = local['secure']['warn'];
                    if(warn_arr){
                        $("#warnTable tbody").find("tr").remove();
                        for(var i=0;i<warn_arr.length;i++){
                            var warnName = secure.warn2txt[warn_arr[i][0]]['name'];
                            var warnTxt = secure.warn2txt[warn_arr[i][0]]['txt'];
                            var tr = '<tr><td class="warn-name">'+warnName+'</td><td class="warn-state">检测到'+warnTxt+'</td>><td class="warn-time">'+warn_arr[i][1]+'</td>></tr>';
                            $("#warnTable").append(tr);
                        }
                    }
                }
                if(local['secure']['rfid_his']){
                    secure.getlocalIdHistoryIdTable(local['secure']['rfid_his']);
                }
            }
            if(local['set']){
                $("#id_address").val(local['set']['ID']);
                $("#key_address").val(local['set']['KEY']);
                $("#server_address").val(local['set']['SERVER']);
                //on_get_aid_akey(local['set']['ID'], local['set']['KEY'], local['set']['SERVER']);
            }
            if(local['camera']){
                if(local['camera']['homeCameraSet']){
                    $("#home_camera_addr").val(local['camera']['homeCameraSet']['addr']);
                    $("#home_camera_type").val(local['camera']['homeCameraSet']['type']);
                    $("#home_camera_user").val(local['camera']['homeCameraSet']['user']);
                    $("#home_camera_pw").val(local['camera']['homeCameraSet']['pw']);
                }
                if(local['camera']['secureCameraSet']){
                    $("#secure_camera_addr").val(local['camera']['secureCameraSet']['addr']);
                    $("#secure_camera_type").val(local['camera']['secureCameraSet']['type']);
                    $("#secure_camera_user").val(local['camera']['secureCameraSet']['user']);
                    $("#secure_camera_pw").val(local['camera']['secureCameraSet']['pw']);
                }
            }
            if(local['curScene']){
                scene.curSetScene = local['curScene'];
                scene.get_scene_val();
            }
            page.curMode = local['mode'];
            //根据localStorage还原红外遥控设置
            if (local['control']['controller']) {
                var newObj = local['control']['controller'];
                for (var i in newObj) {
                    $("#mode-" + i).find(".mode_txt").text(newObj[i]);
                }
            }
            if(local.user){
                health.updateUserInfo();
            }
            scene.get_scene_arr();
        }
        else
            page.getConfig();
        // 初始化风扇、灯泡等电器的开关按钮
        control.init_switch();
    },
    clearLocalStorage : function () {
        //localStorage.clear();
        localStorage.removeItem("FwsSmartCare");
        localStorage.FwsSmartCare = "";
        alert("localStorage已清除！");
        window.location.reload();
    },
    storeLocalStorage : function(){
        localStorage.FwsSmartCare = JSON.stringify(local);
        console.log("保存localStorage："+localStorage.FwsSmartCare);
    },
    canvas_init : 0,
    health_init : false,
    healthRouter : function (outPage) {
        var pageId = outPage ? outPage : window.location.hash.slice(2);
        page.activePage(pageId);
          if(!page.health_init){
              // 环形图表
              //console.log("刷新环形图表");
              tempChart = new JustGage({id: "tempChart", value: 37, min: 35, max: 42, levelColors: ["#e88024"]});
              heartChart = new JustGage({id: "heartChart", value: 77, min: 50, max: 150, levelColors: ["#61a9dc"]});
              blood1Chart = new JustGage({id: "blood1Chart", value: 80, min: 40, max: 120, levelColors: ["#f17c67"]});
              blood2Chart = new JustGage({id: "blood2Chart", value: 100, min: 70, max: 160, levelColors: ["#f17c67"]});
              page.health_init = true;
          }
    },
    homeRouter : function (outPage) {
        var pageId = outPage ? outPage : window.location.hash.slice(2);
        page.activePage(pageId);
        if(pageId=="home" && !page.canvas_init){
            //获取天气信息
            page.getWeather();
            page.canvas_init = 1;
        }
    },
    secureRouter : function (outPage) {
        var pageId = outPage ? outPage : window.location.hash.slice(2);
        page.activePage(pageId);
        // 检测合法ID列表、报警电话列表长度并选择是否禁用添加按钮
        secure.checkTableLength($("#rfidTable"), $("#rfidAdd"));
        secure.checkTableLength($("#phoneTable"), $("#phoneAdd"));
    },
    controlRouter : function () {
        var pageArr = window.location.hash.slice(2).split("/");
        page.homeRouter(pageArr[0]);
        $("#"+pageArr[0]+"Li").find("a").attr("href", "#/control/"+pageArr[1]);
        control.curPage = pageArr[1];
        //console.log("control.curPage="+control.curPage);
        page.activePage(control.curPage);
        if(control.curPage=="socket"){
            control_2("智能插排", "query");
        }
        else if(control.curPage=="elec"){
            control_2("继电器组", "query");
            control_2("风扇", "query");
            control_2("步进电机", "query");
            control_2("电磁锁", "query");
        }
    },
    activePage : function (id) {
        $("#"+ id+"Li").addClass("active").siblings("li").removeClass("active");
        $("#"+ id).removeClass("hidden").siblings("div").addClass("hidden");
    },
    loadFirstPage : function () {
        var href = window.location.href;
        var newHref = href.substring(href.length,href.length-4);
        if(newHref == "html"){
            page.homeRouter();
            window.location.href = window.location.href+"#/health";
        }
    },
    toPage : function (currentpage, lastpage) {
        $(currentpage).addClass("hidden");
        $(lastpage).removeClass("hidden");
        if(lastpage=="#sins"){
            $("#scene .bootstrap-switch").hide();
        }
    },
    getWidth : function () {
        var width_dom = document.getElementById('width');
        var width_txt =  window.innerWidth;
        var height_txt =  window.innerHeight;
        width_dom.innerHTML=width_txt+"...."+height_txt;
    },
    getTime : function () {
        var date_info=document.getElementById("date_info"),//获取date_info
            time_info = document.getElementById("time_info");// 获去时间id
        var nowdate = new Date();
        //获取年月日时分秒
        var month = nowdate.getMonth()+1,
            year = nowdate.getFullYear(),
            hours = nowdate.getHours(),
            minutes = nowdate.getMinutes(),
            date = nowdate.getDate();
        //var weekday =["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        // 获取日期id
        date_info.innerHTML=month+"月"+date+"日";
        var hour_info = hours >=10 ? hours : "0"+hours;
        var minute_info = minutes >=10 ? minutes : "0"+minutes;
        time_info.innerHTML = hour_info + " : " + minute_info;
        page.cur_time = year + "年" +month+"月"+date+"日"+"-"+hour_info + ":" + minute_info;
        //console.log("page.cur_time="+page.cur_time);
    },
    cur_time : '2000年3月3日-17:00',
    hinToCamera : function () {
        location.href =  location.href.substr(0, location.href.length-4) + "secures";
        page.toPage('.secures-tabs', '#cameraInfo');
    },
    hin_online : function (id) {
        $(id).text("在线").addClass("hin-state-on");
    },
    hin_offline : function (id) {
        $(id).text("离线").addClass("text-danger").removeClass("text-success");
    },
    camera_show : function (e) {
        $(e).find(".camera-info").removeClass("hidden");
    },
    camera_hide : function (e) {
        $(e).find(".camera-info").addClass("hidden");
    }
}
var chartt;

var health = {
    his_init : false,
    getUserHis : function () {
        page.toPage('#health_show', '#health_his');
        console.log(local.userHis[0]);
        if(!health.his_init){
            $.getScript("https://gw.alipayobjects.com/as/g/datavis/g2/2.3.8/index.js", function () {
                console.log("异步加载G2.js并获取历史信息");
                //setTimeout(function () {
                    health.getHisChart();
                //}, 300)
            })
            health.his_init = 1;
        }
    },
    updateUserInfo : function () {
        $(".user-name").text(local.user[0]);
        $(".user-age").text(local.user[1]);
        $(".user-sex").text(local.user[2]);
        $(".user-img").attr("src", local.user[2]=="女" ? "img/woman.png" : "img/man.png");
    },
    saveUser : function () {
        var currentName = $("#curName").val();
        var currentAge = parseInt($("#curAge").val());
        var currentSex = $("#userModal input:checked").val();
        local.user = [currentName, currentAge, currentSex];
        page.storeLocalStorage();
        message_show("用户信息修改成功！");
        $("#userModal").modal("hide");
        health.updateUserInfo();
    },
    getHisChart : function () {
        $("#hisChart").empty();
        var val = $("#hisSelect").val();
        var dataSource = local.userHis[val];
        //console.log("data="+dataSource);
        var titleArr = ["体温", "心率", "舒张压", "收缩压"];
        var title = titleArr[val];
        var data = [];
        for(var i=0;i<dataSource.length;i++){
            var obj = {
                index : i,
                val : dataSource[i]
            }
            data.push(obj);
        }
        var height = $(document).height();
        $("#userImg2").animate({width:height*0.1},100);
        var chart = new G2.Chart({
            id: 'hisChart',
            forceFit: true,
            height: height*0.5
        });
        chart.source(data, {
            index: {
                alias: '次',
                range: [0, 1]
            },
            val: {
                alias: title
            }
        });
        chart.line().position('index*val').size(2);
        chart.render();
    }
}
var control = {
    curPage : '0',
    sinTimeArr : [
        ['出门08:00-19:00',   11],
        ['在家18:00-23:00',       5],
        ['睡眠23:00-08:00',    9]
    ],
    timeNum : 65,
    time2txt : {
    },
    time0 : '',
    title2txt : {
        "tem" : "环境温度",
        "humi" : "环境湿度",
        "illum" : "光照度",
        "PM" : "PM2.5",
        "socket" : "功率",
    },
    rgb_on : false,
    rgb_connect : false,
    curRGBmode : 0,
    controlMode : 0,
    qrcode_init : 0,
    init : function () {

        control.rgb_connect = true;

        var aa = parseInt(local['scene']['默认']['stage1']['hours']);

        $("#rgb_switch").prop("checked", true);

        //时间改变事件：
        $(".time-btn")
            .on("click", function () {
                control.time0 = $(this).text();
            })
            .on("change", function () {
                var nowTime = $(this).text();
                var timePoint = this.id;
                var timeIndex = $(this).index();
                var changeTime;
                console.log("timepoint="+timePoint);
                console.log(nowTime, timePoint, timeIndex);
                if(timePoint=="onWork"){
                    local['scene']['默认']['stage1']['time'] = nowTime;
                    changeTime = parseInt(nowTime) - parseInt(control.time0);
                    local['scene']['默认']['stage1']['hours'] = parseInt(local['scene']['默认']['stage1']['hours']-changeTime);
                    local['scene']['默认']['stage3']['hours'] = parseInt(local['scene']['默认']['stage3']['hours']+changeTime);
                    control.update_time_chart();
                }
                else if(timePoint=="outWork"){
                    local['scene']['默认']['stage2']['time'] = nowTime;
                    changeTime = parseInt(nowTime) - parseInt(control.time0);
                    local['scene']['默认']['stage1']['hours'] = parseInt(local['scene']['默认']['stage1']['hours']+changeTime);
                    local['scene']['默认']['stage2']['hours'] = parseInt(local['scene']['默认']['stage2']['hours']-changeTime);
                    control.update_time_chart();
                }
                else if(timePoint=="sleep"){
                    local['scene']['默认']['stage3']['time'] = nowTime;
                    changeTime = parseInt(nowTime) - parseInt(control.time0);
                    local['scene']['默认']['stage1']['hours'] = parseInt(local['scene']['默认']['stage2']['hours']-changeTime);
                    local['scene']['默认']['stage2']['hours'] = parseInt(local['scene']['默认']['stage3']['hours']+changeTime);
                    control.update_time_chart();
                }
                page.storeLocalStorage();
                console.log("local="+JSON.stringify(local));
        })

        //时间设置模块初始化
        $("#dtBox").DateTimePicker();

        //select初始化
        //$('.selectpicker').selectpicker({});

        // 感知页面-阈值设置滑块
        $('#nstSliderX').nstSlider({
            "left_grip_selector": "#leftGripX",
            "right_grip_selector": "#rightGripX",
            "value_bar_selector": "#barX",
            "value_changed_callback": function(cause,leftValue,rightValue) {
                var $container = $(this).parent();
                $container.find('#leftLabelX').text(leftValue);
                $container.find('#rightLabelX').text(rightValue);
                // 移动高亮条
                $('#nstSliderX').nstSlider('highlight_range',leftValue,rightValue);
                // 上报阈值数据
            },
            "highlight": {
                "grip_class": "gripHighlighted",
                "panel_selector": ".highlightPanel"
            },
        });
        
        //个人信息模态框展开
        $("#userModal").on("show.bs.modal", function () {
            $("#curName").val(local.user[0]);
            $("#curAge").val(local.user[1]);
            $("#currentSexGroup").find("input[value='"+local.user[2]+"']").click();
        })

        // 阈值设置模态框展开
        $("#thresholdModal")
            .on("show.bs.modal", function (e) {
                var title = modal.curThreshold = $(e.relatedTarget).data("title");
                $("#thresholdTitle").text(control.title2txt[title]+"阈值");
                $("#nstSliderX").nstSlider("set_range", local[title][2], local[title][3]);
                $("#nstSliderX").nstSlider("set_position", local[title][0], local[title][1]);
            })
            .on("hidden.bs.modal", function () {
                $("#thresholdTitle").html("&nbsp;&nbsp;&nbsp;&nbsp;");
            });

        //调试用：默认rgb为开启状态
        control.rgb_on = 1;
        //RGB图标事件
        $("#rgbIcon").on("click", function () {
            if(!control.rgb_on){
                message_show("开启RGB灯后可进入设置");
                return false;
            }
        })
        
        // 异步加载qrcode.js
        //$("#myModal").on("show.bs.modal", function () {
        //    if(!control.qrcode_init){
        //         console.log("qrcode init");
        //        $.getScript("https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js", function () {
        //
        //        })
        //        control.qrcode_init = 1;
        //    }
        //})

        //$("#backModal").modal("show");

    },
    // 初始化风扇、灯泡等电器的开关按钮
    switch_arr : ['switch_rgb', 'switch_lamp', 'switch_fan', 'switch_curtain', 'switch_lock', 'switch_humidifier', 'switch_fridge', 'switch_washingmachine'],
    init_switch : function () {
        for(var i=0;i<control.switch_arr.length;i++){
            eval(control.switch_arr[i]+"= new Switchery(document.querySelector('#'+control.switch_arr[i]))");
            if((page.curMode=="auto"|| local['mode']=="auto")){
                eval(control.switch_arr[i]+".disable()");
                control.all_switch = true;
            }
        }
    },
    all_switch : false, // 为true时，所有开关为禁用状态
    manage_switcher : function (bool) {
        if(bool!=control.all_switch){
            var txt = (page.curMode=="auto" || local['mode']=="auto") ? ".disable()" : ".enable()";
            for(var i=0;i<control.switch_arr.length;i++){
                eval(control.switch_arr[i]+txt);
            }
            control.all_switch = txt == ".disable()" ? true : false;
        }
    },
    init_after_switch: function (id, index) {
        switch_add = new Switchery(document.querySelector(id));
    },
    setSwitchery : function (switchElement, checkedBool) {
        if(switchElement){
            if((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
                switchElement.setPosition(true);
                //switchElement.handleOnchange(true);
            }
        }
    },
    // 动态更新默认模式下左侧圆饼图
    update_time_chart : function () {

    },
    checkSwitchOnline : function (sensor) {
        if(!rtc._connect){
            message_show("数据未连接，请连接后重试！");
            return false;
        }
        if(sensor){
            var type = title2type[sensor]["type"];
            if($("#type_"+type)){
                if($("#type_"+type).val()==""){
                    console.log("type_"+type+"----"+$("#type_"+type).val());
                    message_show(sensor+"不在线！");
                    return false;
                }
            }
        }
        return true;
    },
    // 照明灯动画
    lamp : function (e) {
        if(control.checkSwitchOnline("继电器组")){
            var state = $(e).data("title");
            if(state=="off"){
                console.log("控制客厅灯");
                control_2("继电器组", "on1");
            }else{
                console.log("控制客厅灯关");
                control_2("继电器组", "off1");
            }
        }
    },
    // RGB灯下修改灯泡颜色
    changeLightColor : function (ev) {
        if (control.checkSwitchOnline("LED")){
            if (control.rgb_connect) {
                if (control.rgb_on) {
                    var ev = ev || window.event;
                    var target = ev.target || ev.srcElement;
                    if ($(target).hasClass("rgb-c")) {
                        var txt = target.id.split("_")[2];
                        console.log("选择颜色：" + txt);
                        var order = control.color2com[txt];
                        var t = title2type["遥控"];
                        if (t) {
                            console.log("t=" + t + "---t.type=" + t.type);
                            var mac = type2mac[t.type];
                            console.log("即将发送颜色指令：order=" + order + "----mac=" + mac + "---rtc._connect=" + rtc._connect);
                            if (mac && rtc._connect) {
                                rtc.sendMessage(mac, '{CD1=1,V0=' + order + '}');
                                console.log("颜色指令：" + '{CD1=1,V0=' + order + '}');
                            }
                        }
                    }
                } else {
                    message_show("RGB灯未开启！")
                }
            } else {
                message_show("RGB灯未连接！")
            }
        }
    },
    // RGB灯下修改灯泡显示模式
    changeLightMode : function (ev) {
        if (control.checkSwitchOnline("LED")){
            if (control.rgb_connect) {
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                var lightMode = target.id.split("_")[2];
                if (control.rgb_on) {
                    console.log("选择RGB灯模式：" + lightMode);
                    var order = control.color2com[lightMode];
                    var t = title2type["遥控"];
                    if (t) {
                        var mac = type2mac[t.type];
                        console.log("即将发送RGB模式指令：" + order);
                        if (mac && rtc._connect) {
                            rtc.sendMessage(mac, '{OD1=1,V0=' + order + '}');
                            console.log("RGB模式指令：" + order);
                        }
                    }
                } else {
                    message_show("RGB灯未开启！")
                }

            } else {
                message_show("RGB灯未连接！")
            }
        }
    },
    // RGB灯开关
    switch_rgb : function(e){
        if(control.checkSwitchOnline("LED")){
            var state = $(e).data("title");
            console.log("RGB灯开关，state="+state);
            if(state == "off"){
                // 发送rgb开启指令
                control_2("LED", "on");
                //control.rgb_on = 1;
                //$("#rgb_switch").text("关闭").data("title", "on").addClass("rgb_on");
            }else if(state == "on"){
                // 发送rgb关闭指令
                control_2("LED", "off");
                //control.rgb_on = 0;
                //$("#rgb_switch").text("开启").data("title", "off").removeClass("rgb_on");
            }
        }
    },
    selectNum : 0,
    selectall : function (e) {
        var checkbox = $(e).find("input[type='checkbox']");
        checkbox.prop("checked", !checkbox.prop("checked"));
        var state = checkbox.prop("checked");
        $(e).parents("table").find("input[class!='selectall']").prop("checked",state);
        if(checkbox.prop("checked")) control.selectNum = $(e).parents("table").find("tr").length-1;
        else control.selectNum = 0;
    },
    // 加湿器
    humidifier : function (e) {
        if(control.checkSwitchOnline("继电器组")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log($("#switch_humidifier")[0].checked);
                console.log("控制加湿器开");
                control_2("继电器组", "on2");
            } else {
                console.log("加湿器关");
                control_2("继电器组", "off2");
            }
        }
    },
    // 电冰箱
    fridge : function (e) {
        if(control.checkSwitchOnline("继电器组")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log("控制电冰箱开");
                control_2("继电器组", "on3");
            } else {
                console.log("控制电冰箱关");
                control_2("继电器组", "off3");
            }
        }
    },
    // 洗衣机
    washingmachine : function (e) {
        if(control.checkSwitchOnline("继电器组")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log("控制洗衣机开");
                control_2("继电器组", "on4");
            } else {
                console.log("控制洗衣机关");
                control_2("继电器组", "off4");
            }
        }
    },
    //风扇控制开关
    fan : function (e) {
        if(control.checkSwitchOnline("风扇")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log("控制控制风扇开");
                control_2("风扇", "on");
            } else {
                console.log("控制控制风扇关");
                control_2("风扇", "off");
            }
        }
    },
    //窗帘控制开关
    curtain : function (e) {
        if(control.checkSwitchOnline("步进电机")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log("控制窗帘开");
                control_2("步进电机", "正转");
            } else {
                console.log("控制窗帘关");
                control_2("步进电机", "反转");
            }
        }
    },
    // 门锁
    lock : function (e) {
        if(control.checkSwitchOnline("电磁锁")) {
            var state = $(e).data("title");
            if (state == "off") {
                console.log("控制门锁开");
                control_2("电磁锁", "on");
            } else {
                console.log("控制门锁关");
                control_2("电磁锁", "off");
            }
        }
    },
    elec2txt : {
      '洗衣机' : 'washingmachine',
      '电视机' : 'tv',
      '电冰箱' : 'fridge',
      '微波炉' : 'microwave'
    },
    // 添加自定义电器
    elecAdd : function (data) {
        var  name = data['name'];
        console.log("添加的电器是："+JSON.stringify(data)+"---index="+modal.curIndex);
        local['control']['elec'] = data;
        page.storeLocalStorage();
        control.name2Img(name, modal.curIndex);
        $("#newModal").modal("hide").find("input").val("");
    },
    //开关自定义电器
    otherElec : function (e) {
        if(control.checkSwitchOnline()) {
            var state = $(e).data("title");
            var str = $(e).data("title", "on").siblings(".ring-img").attr("src");
            console.log("otherElec : ", state, str);
            $(e).data("title", ( state == "off" ? "on" : "off")).siblings(".ring-img").attr("src", ( state == "off" ? str.replace(/off/, "on") : str.replace(/on/, "off") ));
        }
    },
    //删除自定义电器
    elecDel : function () {
        $("#elecAdd").attr({
            "src" : "img/add.png",
            "data-target" : "#newModal"
        }).addClass("elec-add").next(".add-txt").text("添加更多电器……").siblings(".switchery").remove();
        if($("#otherElec").prop("checked")){
            $("#otherElec").prop("checked", false).data("title", "off");
        }
        local['control']['elec']['name'] = "";
        page.storeLocalStorage();
        $("#delModal").modal("hide");
    },
    //自定义电器名称转图片
    name2Img : function (nname, index) {
        if(nname!=""){
            $("#elecAdd").attr({
                "src" : "img/"+ (this.elec2txt[nname] ? this.elec2txt[nname] : "otherelec" )+ "_off.png",
                "data-target" : "#delModal"
            }).removeClass("elec-add").next(".add-txt").text(nname).next("input").removeClass("hidden");
            control.init_after_switch('#otherElec', index);
        }
    },
    cur_controller : '',
    cur_controller_mode : "遥控模式",
    toggle_controller_mode : function () {
        var cur_mode = $("#currentMode").text();
        console.log("control.cur_controller");
        $("#currentMode").text($("#other_controller_mode").text());
        $("#other_controller_mode").text(cur_mode);
        // 保存已修改的当前遥控器模式到全局变量
        control.cur_controller_mode = $("#currentMode").text();
        message_show("已切换到："+control.cur_controller_mode);
        control.curRGBmode = control.cur_controller_mode=="遥控模式" ? 0 : 1;
    },
    selecter : function (val) {
        $("#modeTxt").val(local['control']['controller'][control.cur_controller][val] ? local['control']['controller'][control.cur_controller][val] : "");
    }
}

var scene = {
    curScene : '', // 当前正在设置修改的场景详情
    curSetScene : '', // 当前正处于运营状态的场景
    curStage : '',
    curThreshold : '', // tem、humi、illum等名称
    curThresholdName : '', // 温度、湿度等名称
    curSetOpenArr: [],
    curSetThresholdArr: [],
    curSetTem : [],
    curSetHumi : [],
    curSetIllum : [],
    curSetPM : [],
    curRGB : '',
    sinName2title : {
      '默认' :  'sin-homein',
      '离家' :  'sin-homeout',
      '旅行' :  'sin-trip',
      'party' : 'sin-party',
      '聚会' :  'sin-party',
      '睡眠' :  'sin-sleep',
    },
    name2stage : {
      "出门" : "stage1",
      "在家" : "stage2",
      "睡眠" : "stage3"
    },
    name2txt : {
        "出门" : "time-out",
        "在家" : "time-in",
        "睡眠" : "time-sleep"
    },
    elec2sensor : {
      'fan' : 'tem',
      'humidifier' : 'humi',
      'purifier' : 'PM',
      'curtain' : 'illum',
      'photo' : 'photo'
    },
    sensor2name : {
        'tem' : '温度阈值',
        'humi' : '湿度阈值',
        'PM' : 'PM2.5阈值',
        'illum' : '光照度阈值',
        'photo' : '拍照频率'
    },
    add : function (data) {
        console.log("添加的场景："+JSON.stringify(data));
        var newSceneName = data['name'];
        var addSceneIndex;
        var num = $("#sins").find(".sins[data-toggle!=modal]").length;
        console.log("新增场景前，场景的个数："+num);
        if(this.checkName(newSceneName)){
            local['scene'][newSceneName] = {
                'index' : data['index'],
                'tem' : [10, 50],
                'humi' : [10, 50],
                'illum' : [500, 2000],
                'PM' : [0, 135]
            };
            page.storeLocalStorage();
            console.log('新的：'+newSceneName+'---local.scene='+JSON.stringify(local['scene']));
            scene.name2Img(data);
            if(modal.curIndex==5){
                $("#sinAdd").addClass("hidden");
            }
            $("#newModal").modal("hide").find("input").val("");
        }
    },
    arrs : [],
    checkName : function (name) {
        var name2 = name+"模式";
        if(name != "" && $.inArray(name2,scene.arrs)<0){
            return true;
        }else{
            $("#checkAdd").text("场景名不得为空，且不得与已有场景名一致！");
            return false;
        }
    },
    get_scene_arr : function () {
      $(".sin[data-toggle!=modal]").find("span").each(function () {
          if($.inArray($(this).text(), scene.arrs)<0){
              scene.arrs.push($(this).text());
          }
      })
    },
    del : function () {
        $("#sins").find(".sin:eq("+modal.curIndex+")").remove();
        for(var i in local['scene']){
            if(scene.curScene== i){
                if(scene.curScene == local['curScene']){
                    // 如果删除的是当前设置的场景
                    message_show("已默认进入默认模式");
                    local['curScene'] = "默认";
                    $(".state-bar").find(".bootstrap-switch-label").text(local['curScene']).addClass("lable_txt");
                }
                delete local['scene'][i];
                console.log("删除场景："+i+"成功");
            }
        }
        console.log("删除场景后，local="+JSON.stringify(local));
        page.storeLocalStorage();
        if($("#sinAdd").hasClass("hidden")){
            $("#sinAdd").removeClass("hidden");
        }
        $("#delModal").modal("hide");
        page.toPage('#sinInfo', '#sins');
    },
    name2Img : function (data) {
        var sceneName = data['name'],
            sceneIndex = data['index'];
        console.log("添加的模式："+JSON.stringify(data)+"----index="+sceneIndex);
        var title = scene.sinName2title[sceneName]  ? scene.sinName2title[sceneName] : "sin-other";
        console.log("title="+title);
        var newSin = '<div class="sin" data-title="'+title+'"><span>'+sceneName+'模式</span></div>';
        $(newSin).insertAfter("#sins .sin:eq("+(sceneIndex-1)+")");
    },
    //默认模式下，点击左侧时间段
    chartClick : function (name) {
        message_show("当前配置的时间段为："+name);
        inTimeSet = 1;
        inTimeSetTxt = name;
        scene.curStage = scene.name2stage[name];
        $(".time-txt").removeClass("stage-on");
        $("."+scene.name2txt[name]).addClass("stage-on");
        var testObj = local['scene']['默认'];
        var newArr = [];
        $(".sin-ci[data-toggle!=modal]").addClass("sin-c-off");
        for(var i in testObj){
            if(typeof testObj[i] == "object"){
                var newObj = testObj[i];
                for(var j in newObj){
                    var arrr = newObj[j];
                    if(typeof arrr == "string"){
                        var objName = arrr.substr(0,2);
                        if(j=="title" && objName==name){
                            newArr = newObj['open'];
                        }
                    }
                }
            }
        }
        console.log("newArr="+newArr);
        if(newArr.length>0){
            for(var i=0;i<newArr.length;i++){
                //console.log("i="+i+"----newArr[i]="+newArr[i]);
                $(".sin-ci:eq("+newArr[i]+")").removeClass("sin-c-off");
            }
        }
    },
    //模式详情-阈值设置模态框
    save_threshold : function () {
        if(local[scene.curThreshold]){
            var $left = scene.curThreshold=="PM" ? $("#leftLabelS2") : $("#leftLabelS");
            var $right = scene.curThreshold=="PM" ? $("#rightLabelS2") : $("#rightLabelS");
            if(scene.curScene == "默认"){
                local['scene'][scene.curScene][scene.curStage][scene.curThreshold][0] =  parseInt($left.text());
                local['scene'][scene.curScene][scene.curStage][scene.curThreshold][1] = parseInt($right.text());
                message_show("场景-阈值保存成功：最小值："+local['scene'][scene.curScene][scene.curStage][scene.curThreshold][0]+"，最大值："+local['scene'][scene.curScene][scene.curStage][scene.curThreshold][1]);
            }else{
                local['scene'][scene.curScene][scene.curThreshold][0] = parseInt($left.text());
                local['scene'][scene.curScene][scene.curThreshold][1] = parseInt($right.text());
                message_show("场景-阈值保存成功：最小值："+local['scene'][scene.curScene][scene.curThreshold][0]+"，最大值："+local['scene'][scene.curScene][scene.curThreshold][1]);
            }
            page.storeLocalStorage();
            console.log("local="+JSON.stringify(local));
        }
        scene.to_cur_val(scene.curScene);
        $("#sceneModal").modal("hide");
    },
    to_cur_val : function (curSence) {
        //console.log(curSence);
        if(curSence == "默认"){
            scene.curSetOpenArr = local['scene'][curSence][scene.curStage]['open'];
            scene.curSetTem = local['scene'][curSence][scene.curStage]['tem'];
            scene.curSetHumi = local['scene'][curSence][scene.curStage]['humi'];
            scene.curSetIllum = local['scene'][curSence][scene.curStage]['illum'];
            scene.curSetPM = local['scene'][curSence][scene.curStage]['PM'];
            scene.curRGB = local['scene'][curSence][scene.curStage]['rgb'];
        }else{
            scene.curSetOpenArr = local['scene'][curSence]['open'];
            scene.curSetTem = local['scene'][curSence]['tem'];
            scene.curSetHumi = local['scene'][curSence]['humi'];
            scene.curSetIllum = local['scene'][curSence]['illum'];
            scene.curSetPM = local['scene'][curSence]['PM'];
            scene.curRGB = local['scene'][curSence]['rgb'];
        }
    },
    get_scene_val : function () {
        console.log("当前运转的模式scene.curSetScene："+scene.curSetScene);
        var stageTxt;
        $("#sins").find(".sin").removeClass("sin-active");
        $("#sins").find(".sin").each(function () {
            if($(this).find("span").text()==scene.curSetScene+"模式"){
                $(this).addClass("sin-active");
            }
        })
        if(scene.curSetScene == "默认"){
            // 遍历默认模式内容，比较当前时间属于哪一个时间段，获取该时间段内设置
            var homeObj = local['scene']['默认'];
            var curTime = page.cur_time.split("-")[1];
            for(var i in homeObj){
                if(i!="index"){
                    if(compareTime(curTime, homeObj[i]['time'])){ // 为真时，表示当前时间在该时间段的后面，继续往下一个时间段比较
                        scene.curStage = i;
                        stageTxt = homeObj[i]["title"];
                    }else{                                                  // 否则，表示当前时间在该时间段的前面，回退到一个时间段，并退出循环
                        var num = parseInt(i.split("e")[1]);
                        scene.curStage = (num>1) ? ("stage"+(num - 1)) : "stage3";
                        stageTxt = homeObj[scene.curStage]["title"];
                        break;
                    }
                }
            }
            console.log("获取的当前时间段为："+scene.curStage+"-----时间段名称为："+stageTxt);
        }
        scene.to_cur_val(scene.curSetScene);
        console.log("当前正处于为自动模式下的"+scene.curSetScene+"--将进入以下配置设置：温度阈值：",scene.curSetTem[0], scene.curSetTem[1], "-----湿度阈值：",scene.curSetHumi[0], scene.curSetHumi[1]+"-----光照度阈值：",scene.curSetIllum[0], scene.curSetIllum[1]+"-----PM阈值：",scene.curSetPM[0], scene.curSetPM[1]+"---下列传感器开启："+scene.curSetOpenArr+"----RGB灯开启："+scene.curRGB);
    },
    get_info_mess : function (bool) {
        $("#scene_info_left").text(bool ? "开" : "关").next("#scene_info_right").text(bool ? "关" : "开");
    },
    setRGB : function (e) {
        var $dom = $(e.target);
        if($dom.hasClass("rgb-set-c")){
            $(".rgb-set-c").removeClass("rgb-c-active");
            $dom.addClass("rgb-c-active");
        }
    },
    saveRGB : function () {
        if(isCurRGB){
            //当前为实时控制rgb状态（而非模式详情内），根据选择的颜色或模式发送控制rgb指令
            return;
        }
        local['scene'][scene.curScene]['rgb'] = $(".rgb-c-active").attr("id").split("_")[2];
        page.storeLocalStorage();
        $("#rgbModal").modal("hide");
        message_show("RGB设置成功！");
    }
}

//比较第一个时间是否比第二个时间大：时间格式："15:00"
function compareTime (timeA, timeB){
    var val;
    if(timeA.indexOf(":")>-1){
        var hour1 = parseInt(timeA.split(":")[0]),
            hour2 = parseInt(timeB.split(":")[0]);
        if(hour1 < hour2){
            val = false;
        }else if(hour1 > hour2){
            val = true;
        }else if(hour1 == hour2) {
            val = compareTime(timeA.split(":")[1], timeB.split(":")[1]);
        }
    }
    else{
        val = parseInt(timeA) < parseInt(timeB) ? false : true;
    }
    return val;
}

var rfid_time = null;
var alarmLight_time = null;

var secure = {
    sex2txt : {
        'man' : '男',
        'woman' : '女'
    },
    curCamera : '',
    rfidAdd : function (data) {
        if(this.checkRFID(data)){
            console.log("add rfid data="+JSON.stringify(data));
            var tr = '<tr><td><input type="checkbox"/></td><td class="name">'+data['name']+'</td><td class="sex">'+data['sex']+'</td>><td class="rfid">'+data['rfid']+'</td>><td class="actionTd"><a class="edit-id" href="#"data-toggle="modal" data-target="#editModal"  data-type="rfid">编辑</a></td></tr>';
            $("#rfidTable").append(tr);
            var len = $("#rfidTable").find("tr").length;
            $("#rfidTable tr:eq("+(len-1)+")").find("td[class!='actionTd']").on("click", secure.getCheckbox);
            console.log("len="+len);
            local['secure']['rfid'][len-2] = data;
            page.storeLocalStorage();
            //console.log("读取localStorage：localStorage.FwsSmartCare="+JSON.stringify(localStorage.FwsSmartCare));
            $("#newModal").modal("hide");
            console.log("添加后的length="+$("#rfidTable").find("tr").length);
            if($("#rfidTable").find("tr").length>4){
                $("#rfidAdd").prop("disabled", true);
            }
        }
    },
    //合法id编辑处理
    rfidEdit : function (data) {
        if(this.checkRFID(data)){
            console.log("编辑id：data="+JSON.stringify(data));
            for(var i in data){
                $("#rfidTable tr:eq("+ (modal.curIndex+1 )+")").find("."+i).text(data[i]);
                //if(local['secure']['rfid'])
                for(var k in local['secure']['rfid']){
                    //console.log("k="+k+"----local['secure']['rfid']="+JSON.stringify(local['secure']['rfid'][k])+"----modal.curIndex="+modal.curIndex);
                    if(k == modal.curIndex){
                        local['secure']['rfid'][k] = data;
                    }
                }
            }
            page.storeLocalStorage();
            console.log("读取localStorage：localStorage.FwsSmartCare="+JSON.stringify(localStorage.FwsSmartCare));
            $("#editModal").modal("hide");
        }
    },
    checkRFID : function (data) {
        return true;
    },
    rfidDel : function () {
        console.log("del rfid = "+modal.rfidArr);
        for(var i=modal.rfidArr.length-1;i>-1;i--){
            console.log("arr="+modal.rfidArr);
            $("#rfidTable").find("tr:eq("+modal.rfidArr[i]+")").remove();
            console.log("modal.rfidArr[i]="+modal.rfidArr[i]);
            delete  local['secure']['rfid'][(parseInt(modal.rfidArr[i])-1)];
        }
        page.storeLocalStorage();
        console.log("读取localStorage：localStorage.FwsSmartCare="+JSON.stringify(localStorage.FwsSmartCare));
        if($("#rfidTable").find("tr").length<5){
            $("#rfidAdd").prop("disabled", false);
        }
        $('#delModal').modal('hide');
    },
    getCheckbox : function () {
        var checkbox = $(this).parents('tr[class!="selectall"]').find("input[type='checkbox']");
        checkbox.prop("checked", !checkbox.prop("checked"));
        if(checkbox.prop("checked"))
            control.selectNum++;
        else
            control.selectNum--;
        var max = $(this).parents("table").find("tr").length-1;
        //console.log("max="+max+"---control.selectNum="+control.selectNum);
        if(control.selectNum==max){
            $(this).parents("table").find(".selectall").prop("checked", true);
        }else{
            $(this).parents("table").find(".selectall").prop("checked", false);
        }
    },
    checkTableLength : function (table, addbtn) {
        if(table.find("tr").length>4)
            addbtn.prop("disabled", true);
    },
    'warn2txt' : {
      'gas' : {
          'name' : '燃气感应器',
          'txt' : '燃气泄露',
      },
      'fire' : {
          'name' : '火焰感应器',
          'txt' : '明火',
      },
      'body' : {
          'name' : '人体感应器',
          'txt' : '异常人体',
      },
      'window' : {
          'name' : '窗磁感应器',
          'txt' : '窗户开启异常',
      },
      'emergency' : {
          'name' : '紧急按钮',
          'txt' : '紧急按钮被按下'
      }
    },
    last_alarm_sensor : 'xx',
    last_alarm_minuter : 'xx',
    last_alarm : {
      'gas' : 'xx',
      'body' : 'xx',
      'fire' : 'xx',
      'window' : 'xx',
    },
    test_warning : function (e) {
        var cur_minute = page.cur_time.split("-")[1].split(":")[1];
        var alarm_time_d = parseInt(cur_minute) - parseInt(secure.last_alarm[e]);
        //console.log("报警传感器："+e+"已记录的传感器："+secure.last_alarm_sensor +"----报警分钟："+cur_minute+"----对应传感器时间差值："+alarm_time_d);
        if(secure.warn2txt[e] && (secure.last_alarm[e]=="xx" || alarm_time_d >5)){
            secure.last_alarm_sensor = e; // 避免重复报警
            secure.last_alarm[e] = cur_minute;
            //console.log("报警对象："+JSON.stringify(secure.last_alarm));
            var warnName = secure['warn2txt'][e]['name'];
            var warnTxt = secure.warn2txt[e]['txt'];
            // 时间获取自全局变量page.cur_time
            var tr = '<tr><td class="warn-name">'+warnName+'</td><td class="warn-state">检测到'+warnTxt+'</td>><td class="warn-time">'+page.cur_time+'</td>></tr>';
            $("#warnTable").append(tr);
            var newArr = [e, page.cur_time];
            local['secure']['warn'].push(newArr);
            page.storeLocalStorage();
            //console.log("读取localStorage：localStorage.FwsSmartCare="+JSON.stringify(localStorage.FwsSmartCare));
        }
    },
    test_rfid : function (data) {
        if(data && data!="0" && data!=0){
            if(rfid_time){
                clearTimeout(rfid_time);
            }
            rfid_time = setTimeout(function () {
                $("#rfidModal").modal("hide");
            }, 2000);
            $("#rfidModal").modal("show");
            // 根据不同卡号显示不同的信息，比如合法id和非法id
            var rfidObj = local['secure']['rfid'];
            var is_legal = false;
            var user_name = "非法用户";
            var user_sex = "未知";
            for(var i in rfidObj){
                if(data == rfidObj[i]['rfid']){
                    is_legal = true;
                    user_name = rfidObj[i]['name'];
                    user_sex = rfidObj[i]['sex'];
                }
            }
            if(is_legal){
                $("#rfid_message").text("欢迎您！"+user_name);
                rtc.sendMessage($("#type_802").val(), "{OD1=1,D1=?}");
            }
            else{
                $("#rfid_message").text("检测到非法id，卡号："+data);
                rtc.sendMessage($("#type_802").val(), "{CD1=1,D1=?}");
            }
            //url = 'http://a.zhiyun360.com:1001/tmpfs/auto.jpg?-usr=admin&-pwd=admin&14827187246080.591860486044651';
            //启用安防摄像头自动拍照，并 存储刷卡记录到刷卡历史
            if(camera.power2 !="on"){
                message_show("摄像头未开启，无法获取刷卡照片");
            }
            console.log(camera.power2);
            myipcamera2.capture(function(url){
                console.log("当前刷卡id号"+data+"时间"+page.cur_time+"拍照照片地址："+url);
                // 添加当前刷卡id及信息到历史刷卡列表
                secure.appendToRfidTable(data, page.cur_time, url, is_legal, user_name, user_sex);
                console.log("appendToTable记录的id为="+data);
                console.log("检测到刷卡操作，已自动拍照");
            })
        }
    },
    window : 0,
    body : 0,
    gas : 0,
    fire : 0,
    emergency : 0,
    num : 0,
    openAlarm : function (name) {
        console.log("开警报");
        $("#barState").addClass("text-danger").find("#alarmLight").addClass("alarm-light-on").end().next("marquee").addClass("text-danger");
        if(!state.alarmLight)
            control_2("声光报警", "on");
        if(!secure.num){
            $("#marquee_default").text("检测到");
            secure.num= 1;
        }
        $("marquee").find(".alarm_"+name).removeClass("hidden");
    },
    checkCloseAlarm : function (name) {
        //console.log("关警报");
        $("marquee").find(".alarm_"+name).addClass("hidden");
        //console.log(secure.window, secure.body, secure.gas, secure.fire, secure.emergency);
        if(!secure.window && !secure.body && !secure.gas && !secure.fire && !secure.emergency){
            $("#barState").removeClass("text-danger").find("#alarmLight").removeClass("alarm-light-on").end().next("marquee").removeClass("text-danger").find("#marquee_default").text("暂无异常");
            secure.num = 0;
            if(state.alarmLight)
                control_2("声光报警", "off");
        }
    },
    appendToRfidTable : function (id, time, url, is_legal, name, sex) {
        if(name == "非法用户"){
            var idStr = "<tr><td class='text-danger'>"+id+"<\/td><td class='text-danger'>"+name+"<\/td><td class='text-danger'>"+sex+"<\/td><td class='text-danger'>"+time+"<\/td><td class='text-danger'><a href='#' data-href='"+url+"' data-toggle='modal' data-target='#imgShowModal'>点击查看照片<\/a><\/td><\/tr>";
        }
        else{
            var idStr = "<tr><td>"+id+"<\/td><td>"+name+"<\/td><td>"+sex+"<\/td><td>"+time+"<\/td><td><a href='#' data-href='"+url+"' data-toggle='modal' data-target='#imgShowModal'>点击查看照片<\/a><\/td><\/tr>";
        }

        $("#historyIdTable").find("tbody").append(idStr);

        $("#historyIdTable a").on("click",showImg);

        secure.storeIdTable(id, time, url, is_legal, name, sex);
    },
    // 获取历史id信息列表
    getlocalIdHistoryIdTable : function (obj){
        $("#historyIdTable tbody").empty();
        //console.log("obj="+JSON.stringify(obj));
        for(var i in obj){
            var arrHtml = "";
            if(i=="length") continue;
            if(obj[i]['name']=="非法用户"){
                arrHtml += "<tr><td class='text-danger'>"+obj[i]['rfid']+"<\/td><td class='text-danger'>"+obj[i]['name']+"<\/td><td class='text-danger'>"+obj[i]['sex']+"<\/td><td class='text-danger'>"+obj[i]['time']+"<\/td><td class='text-danger'><a href='#' data-href="+obj[i]['photo_url']+" data-toggle='modal' data-target='#imgShowModal'>点击查看照片<\/a><\/td><\/tr>";
            }else{
                arrHtml += "<tr><td>"+obj[i]['rfid']+"<\/td><td>"+obj[i]['name']+"<\/td><td>"+obj[i]['sex']+"<\/td><td>"+obj[i]['time']+"<\/td><td><a href='#' data-href="+obj[i]['photo_url']+" data-toggle='modal' data-target='#imgShowModal'>点击查看照片<\/a><\/td><\/tr>"
            }
            $("#historyIdTable").append(arrHtml);
            $("#historyIdTable a").on("click",showImg);
        }
    },
    storeIdTable : function (id, time, url, is_legal, name, sex) {
        console.log("储存前local="+JSON.stringify(local));
        if(!local['secure']['rfid_his']){
            local['secure']['rfid_his'] = {};
            local['secure']['rfid_his']['length'] = 0;
        }
        var length  = local['secure']['rfid_his']['length'];
        console.log("存储之前，历史刷卡长度为："+length);
        local['secure']['rfid_his'][length+1] = {
            'rfid' : id,
            'name' : name,
            'sex' : sex,
            'time' : time,
            'photo_url' : url
        }
        local['secure']['rfid_his']['length'] += 1;
        page.storeLocalStorage();
        console.log("储存后local="+JSON.stringify(local));
    }
}

//$("#btn-rfid-hisroty").on("click", function () {
//
//})

$("#historyIdTable a").on("click",showImg);

function showImg(){
    $("#showImg").attr("src",$(this).data("href"));
}

var modal = {
    type2txt : {
        'scene' : '模式',
        'rfid' : 'rfid卡号',
        'elec' : '电器'
    },
    curType : '',
    curIndex : 0,
    curName : '',
    rfidArr : [],
    arr : [],
    curThreshold : '',
    getForm : function () {
        var dataSource = decodeURIComponent($(".form-horizontal :visible").serialize(),true);
        var dataArr = dataSource.split("&");
        var data = {};
        for(var i in dataArr){
            var dataTxt = dataArr[i].split("=");
            data[dataTxt[0]] = dataTxt[1];
        }
        return data;
    },
    add : function () {
        var data  = modal.getForm();
        data['index'] = modal.curIndex;
        if(this.curType=="scene")
            scene.add(data);
        else if(this.curType=="rfid")
            secure.rfidAdd(data);
        else if(this.curType == "elec")
            control.elecAdd(data)
    },
    edit : function (e) {
        var data  = modal.getForm();
        if(this.curType=="rfid")
            secure.rfidEdit(data);
    },
    del : function () {
        console.log("type="+this.curType);
        if(this.curType=="scene")
            scene.del();
        else if(this.curType=="rfid")
            secure.rfidDel();
        else if(this.curType == "elec")
            control.elecDel();
    },
    // 遥控器添加文字标题
    addMode : function () {
        var mode_key = $("#modeKey option:selected").val();
        var mode_txt = $("#modeTxt").val();
        console.log(mode_key, mode_txt, "#mode-"+mode_key);
        if(mode_txt.length>5){
            $("#checkMode").text("字符长度超限！");
            return false;
        }else{
            $("#mode-"+mode_key).find(".mode_txt").text(mode_txt);
            if(!local['control']['controller']){
                local['control']['controller'] = {};
            }
            local['control']['controller'][mode_key] = mode_txt;
            page.storeLocalStorage();
            console.log("保存localStorage="+localStorage.FwsSmartCare);
            $("#modeModal").modal("hide");
        }
    },
    saveIDKEY : function () {
        local['set']['ID'] = $("#id_address").val();
        local['set']['KEY'] = $("#key_address").val();
        local['set']['SERVER'] = $("#server_address").val();
        page.storeLocalStorage();
        //console.log("ID KEY设置成功："+localStorage.FwsSmartCare);
        //save_id_key();
        //$("#myModal").modal("hide");
    },
    saveCamera : function (e) {
        var $dom = $(e).parents(".camera-tabpane");
        var camera_id = $dom.attr("id");
        var obj = {
            'addr' : $dom.find(".camera_addr").val(),
            'type' : $dom.find(".camera_type").val(),
            'user' : $dom.find(".camera_user").val(),
            'pw' : $dom.find(".camera_pw").val(),
        }
        local['camera'][camera_id] = obj;
        page.storeLocalStorage();
        console.log("摄像头设置成功："+localStorage.FwsSmartCare);
        message_show("摄像头设置成功！");
    },
    clear : function (e) {
        var title = $(e).data("clear");
        var table_id, val;
        if(title=="rfid"){
            table_id = "#historyIdTable tbody";
            val = 'rfid_his';
            var for_obj = local['secure'][val];
            for(var i in for_obj){
                if(i!="length" && i!="1" && i!=1){
                    delete for_obj[i];
                    local['secure'][val]['length'] -=1;
                }
            }
        }else if(title=="alarm"){
            table_id = "#warnTable tbody";
            val = 'warn';
            local['secure'][val].splice(1, local['secure'][val].length);
        }
        //console.log(title, table_id, val);
        $(table_id).find("tr:gt(0)").remove();
        page.storeLocalStorage();
        console.log("读取localStorage：localStorage.FwsSmartCare="+JSON.stringify(localStorage.FwsSmartCare));
        $("#clearModal").modal("hide");
    },
    $cur_qr : {},
    share : function (e) {
        var txt="", title, input, obj;
        if(e.id=="download"){
            if(e.title =="hide"){
                $("#downloadDiv").removeClass("hidden");
                $(e).attr("title", "show").addClass("hin-set-show");
            }
            else{
                $("#downloadDiv").addClass("hidden");
                $(e).attr("title", "hide").removeClass("hin-set-show");
            }
        }else{
            if(e.id=="id_share"){
                obj = {
                    "id" : $("#id_address").val(),
                    "key" : $("#key_address").val(),
                    "server" : $("#server_address").val(),
                }
                title = "IDKey";
                modal.$cur_qr = $("#idShareSpan");
            }
            else{
                var camera_source = $(e).data("share");
                modal.$cur_qr = camera_source=="home_camera" ? $("#homeShareSpan") : $("#secureShareSpan");
                obj = {
                    "addr" : $("#"+camera_source+"_addr").val(),
                    "type" : $("#"+camera_source+"_type").val(),
                    "user" : $("#"+camera_source+"_user").val(),
                    "pw" : $("#"+camera_source+"_pw").val(),
                }
                title = "MAC设置";
            }
            var newHeight  = parseInt($("#myModal .modal-content").height()) - 2 * parseInt($(".modal-in-footer:visible").height()) - 15;
            qrcode = new QRCode(document.getElementById("qrDiv"), {
                width : 150,
                height : 150
            });
            txt = JSON.stringify(obj);
            qrcode.makeCode(txt);
            $("#qrDiv").css("height" , newHeight);
            var state = modal.$cur_qr.text() == "分享" ? "off" : "on" ;
            if(state=="off"){
                $("#qrDiv").removeClass("hidden");
                modal.$cur_qr.text("收起");
            }
            else{
                $("#qrDiv").addClass("hidden");
                modal.$cur_qr.text("分享");
            }
        }
    },
    cur_scan : '',
    scan : function (e) {
        modal.cur_scan = $(e).data("scan");
        if (window.droid) {
            window.droid.requestScanQR("scanQR");
        }else{
            message_show("扫码只在安卓系统下可用！");
        }
    }
}

// 扫描处理函数
function scanQR(scanData){
    //将原来的二维码编码格式转换为json。注：原来的编码格式如：ID:12345,KEY:12345,SERVER:12345
    var dataJson = {};
    if (scanData[0]!='{') {
        var data = scanData.split(',');
        for(var i=0;i<data.length;i++){
            var newdata = data[i].split(":");
            dataJson[newdata[0].toLocaleLowerCase()] = newdata[1];
        }
    }else{
        dataJson = JSON.parse(scanData);
    }
    if(modal.cur_scan == "id"){
        if(dataJson['id'])
            $("#id_address").val(dataJson['id']);
        if(dataJson['key'])
            $("#key_address").val(dataJson['key']);
        if(dataJson['server'])
            $("#server_address").val(dataJson['server']);
    }
    else if(modal.cur_scan.indexOf("camera")>-1){
        if(dataJson['addr'])
            $("#"+modal.cur_scan+"_addr").val(dataJson['addr'])
        if(dataJson['type'])
            $("#"+modal.cur_scan+"_type").val(dataJson['type'])
        if(dataJson['user'])
            $("#"+modal.cur_scan+"_user").val(dataJson['user'])
        if(dataJson['pw'])
            $("#"+modal.cur_scan+"_pw").val(dataJson['pw'])
    }
}

// 创建myipcamera对象：1是家居摄像头，2是安防摄像头
var myipcamera1 = new WSNCamera(local['set']['ID'], local['set']['KEY']);
var myipcamera2 = new WSNCamera(local['set']['ID'], local['set']['KEY']);

var camera = {
    connect1 : '',
    connect2 : '',
    state1 : '',
    state2 : '',
    div_id : '',
    $imgDiv : {},
    obj : {},
    power2 : 'off',
    switch: function (e, txt) {
        var $dom = $(e);
        var $parent = $(e).parents(".camera-info");
        var $parents = $(e).parents(".camera-div");
        var btn_time;
        //当前是否开启
        var camera_state = $dom.data("state");
        var  name = $dom.data("name");
        console.log("connectFlag=" + rtc._connect + ";;;camera.connect=" + camera.connect + "camera_state=" + camera_state);
        if (rtc._connect) {
            if (camera.connect) {
                console.log("camera_state-----",camera_state);
                if (!camera_state) {
                    //$dom.data("state", 1);
                    console.log("进入摄像头初始化");
                    //$(e).addClass("power_on").data("state", 1);
                    $parent.find(".direc_top").addClass("direc_top_on").end().find(".direc_bottom").addClass("direc_bottom_on");
                    $parent.find(".zoom").prop("disabled", false);
                    btn_time = setTimeout("$('#switch').attr('disabled',false).text('关')", 8000);
                    // 设置图像显示的位置
                    camera.div_id = $dom.data("name")== "homeCameraSet" ? "homeCameraImg" : "secureCameraImg";
                    camera.$imgDiv = $("#"+camera.div_id);
                    console.log("当前摄像头参数：", local['camera'][name]['addr'], local['camera'][name]['user'], local['camera'][name]['pw'], local['camera'][name]['type']);
                    $dom.data({
                        "state" : 1,
                        "switchCam" : 1,
                        "camState" : 1,
                    });
                    message_show("IP摄像头打开");
                    //console.log($parent.find('.cameraBlock1').attr("class"));
                    //$parent.find('.cameraBlock1').addClass('hidden');
                    eval("myipcamera"+txt+".setDiv(camera.div_id)");
                    eval("myipcamera"+txt+".initCamera(local['camera'][name]['addr'], local['camera'][name]['user'], local['camera'][name]['pw'], local['camera'][name]['type'])");
                    eval("myipcamera"+txt+".checkOnline(function (state) {"+
                        //"console.log('检查摄像头是否在线');"+
                        "clearTimeout(btn_time);"+
                        "if (state) {"+
                        //"console.log('摄像头在线，准备开启摄像头');"+
                        "camera.$imgDiv.show();"+
                        "$parents.find('.cameraBlock1').hide();"+
                        //$("#img3").show();
                        "camera.power2 = 'on';"+
                        "myipcamera"+txt+".openVideo();"+
                        //"$dom.data('camState',1);"+
                        //"$dom.data('state',1);"+
                    "}"+
                    "else {"+
                        "console.log('摄像头不在线');"+
                        "message_show('IP摄像头链接失败，请检查网络或设置');"+
                        "camera.$imgDiv.attr('src', 'img/camera.jpg');"+
                       "}"+
                "})");
                }
                else {
                    console.log("发送关闭指令");
                    $dom.removeClass("power_on").data({
                        "state" : 0,
                        "switchCam" : 0,
                        "camState" : 0,
                    }).parents(".camera-table").find(".direc_top").removeClass("direc_top_on").end().find(".direc_bottom").removeClass("direc_bottom_on");
                    $dom.parents(".camera-info").find(".zoom").prop("disabled", true);
                    message_show("IP摄像头关闭");
                    // 关闭视频监控
                    //eval("console.log(myipcamera"+txt+")");
                    eval("myipcamera"+txt+".closeVideo()");
                    //camera.$imgDiv.attr("src", "img/camera.jpg");
                    $parents.find(".cameraBlock1").show();
                }
            }
            else {
                message_show("请设置IP摄像头");
                camera.$imgDiv.attr("src", "img/camera.jpg");

            }
            console.log($("#power2").data("state"), $("#power2").data("switchCam"), $("#power2").data("camState"));
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    // 监视器控制器：上、下、左、右、水平巡航、垂直巡航、全局巡航
    up: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送向上移动命令：
                    if(txt==1 || txt =="1")
                        myipcamera1.control("UP");
                    else if(txt==2 || txt=="2")
                        myipcamera2.control("UP");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    down: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送向下移动命令
                    eval("myipcamera"+txt+".control('DOWN')")
                    eval("console.log(myipcamera"+txt+")");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    left: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送向左移动命令
                    //myipcamera.control("LEFT");
                    eval("myipcamera"+txt+".control('LEFT')");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    right: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送向右移动命令
                    //myipcamera.control("RIGHT");
                    eval("myipcamera"+txt+".control('RIGHT')");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    //水平巡航
    horizontal: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送水平巡航命令
                    //myipcamera.control("HPATROL");
                    eval("myipcamera"+txt+".control('HPATROL')");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    //垂直巡航
    vertical: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送垂直巡航命令
                    eval("myipcamera"+txt+".control('VPATROL')");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    // 360度巡航
    overall: function (txt) {
        if (rtc._connect) {
            var $camera_img = txt==1 ? $("#homeCameraImg") : $("#secureCameraImg");
            var $camera_switch = txt==1 ? $("#power") : $("#power2");
            var switch_cam = $camera_switch.data("switchCam");
            var camState = $camera_switch.data("camState");
            if (camera.connect) {
                if ((switch_cam == 1) && (camState == 1)) {
                    // 向摄像头发送360度巡航命令
                    eval("myipcamera"+txt+".control('360PATROL')");
                }
                else {
                    message_show("操作失败、检查网络或开关状态");
                }
            }
            else {
                message_show("请设置IP摄像头");
                $camera_img.attr("src", "img/camera.jpg");
            }
        }
        else {
            message_show("请正确输入ID、KEY和mac地址连接智云数据中心");
        }
    },
    photo: function (txt) {
        checkDownload(txt, 1);
    }
}

function checkDownload(txt, isclick){
    var $camera_switch = txt==1 ? $("#power") : $("#power2");
    var camState = $camera_switch.data("camState");
    if (camState == 1) {
        if (window.droid && isclick) {
            message_show("安卓暂不支持自动拍照下载");
            return;
        }
        var url = txt == 1 ? $("#homeCameraImg").attr("src") : $("#secureCameraImg").attr("src");
        download(url);
    }
}

//拍照下载
function download(src) {
    var $a = document.createElement('a');
    var  date = new Date();
    $a.setAttribute("href", src);
    $a.setAttribute("download", "自动拍照-"+date);
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    $a.dispatchEvent(evObj);
};


function getback(){
    $("#backModal").modal("show");
}

function confirm_back(){
    window.droid.confirmBack();
}

// 消息弹出框
var message_timer = null;
function message_show(t) {
    if (message_timer) {
        clearTimeout(message_timer);
    }
    message_timer = setTimeout(function () {
        $("#toast").hide();
    }, 3000);
    $("#toast_txt").text(t);
    console.log(t);
    $("#toast").show();
}

// 16进制颜色值转换为rgb值
var hexToRgba = function(hex,al) {
    var hexColor = /^#/.test(hex) ? hex.slice(1) : hex,
        alp = hex === 'transparent' ? 0 : Math.ceil(al),
        r,g,b;
    hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
    if (hexColor.length === 3) {
        hexColor = hexColor.replace(/(\w)(\w)(\w)/gi,'$1$1$2$2$3$3');
    }
    r = hexColor.slice(0,2);
    g = hexColor.slice(2,4);
    b = hexColor.slice(4,6);
    currentColor_r = parseInt(r,16);
    currentColor_g = parseInt(g,16);
    currentColor_b = parseInt(b,16);
};
// rgb值转16进制
var rgbToHex = function(rgb) {
    // rgb(x,y,z)
    var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
    var hex = "#";
    for (var i = 0; i < 3; i++) {
        // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
        // 'color[i]' 是数组，要转换成字符串.
        // 如果结果是一位数，就在前面补零。例如： A变成0A
        hex += ("0" + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
}


$(function(){

    page.init();

    // 监测滑动开关大小并调整
    check_switch();

    // 窗口改变时
    $(window).resize(function() {
        check_switch();
    });

    // 监测当前窗口大小并调整模式开关按钮大小
    function check_switch() {
        if($(window).width()<1000){
            $(".switch-size").attr("data-size","mini");
        }else if($(window).width()>1000){
            $(".switch-size").attr("data-size","normal");
        }

        //模式开关
        $("#mode_switch").bootstrapSwitch({
            onColor : "default",
            offColor : "danger",
            onText : "手动模式",
            offText : "自动模式"
        });
        // 滑动开关绑定点击事件
        $("#mode_switch").on('switchChange.bootstrapSwitch', function(event,status){
            if(status==true){
                local['mode'] = page.curMode = 'hand';
                local['curScene'] = '';
                $("#scene_switch").bootstrapSwitch('state', false, true);
                $(".state-bar").find(".bootstrap-switch-label").text("");
                $("#sins").find(".sin").removeClass("sin-active");
            }else{
                local['mode'] = page.curMode ='auto';
                if(local['curScene']!="默认"){
                    message_show("默认进入默认模式");
                    local['curScene'] = scene.curSetScene = "默认";
                    // 进入当前模式的配置
                    scene.get_scene_val();
                }
                // 注意区分 scene.curScene为当前页面进入的场景详情；local['curScene']为当前设置的场景
                if(scene.curScene == "默认"){
                    $("#scene_switch").bootstrapSwitch('state', true, true);
                }
                $(".state-bar").find(".bootstrap-switch-label").text("默认");
                $(".sin[data-title=sin-homein]").addClass("sin-active");
            }
            control.manage_switcher(local['mode']=="hand"? false : true);
            page.storeLocalStorage();
            console.log("切换成功：local['curScene']="+local['curScene']);
        });

        if(local['mode']){
            if(local['mode']=="hand");
            $("#mode_switch").bootstrapSwitch("state", true, true);
            if(local['mode']=="auto" && local['curScene']){
                var  cur_mode = local['curScene'];
                $(".state-bar").find(".bootstrap-switch-label").text(cur_mode);
                $("#mode_switch").bootstrapSwitch("state", false, true);
            }
        }
        else{
            local['mode']=="hand";
            $("#mode_switch").bootstrapSwitch("state", true, true);
            local['curScene'] = "";
            //$("#mode_switch").bootstrapSwitch("state", false, true);
        }
    }

    //场景开关
    $("#scene_switch").bootstrapSwitch({
        onColor : "danger",
        onText : "on",
        offText : "off",
        state : false,
        animate : false
    });
    // 场景开关绑定点击事件
    $("#scene_switch").on('switchChange.bootstrapSwitch', function(event,status){
        //模式开启
        if(status==true){
            var scene_fullname = $("#sceneName").text();
            local['curScene'] = scene.curSetScene = scene_fullname.substring(0,scene_fullname.length-2);
            var  cur_mode = local['curScene'];
            if(local['mode'] == "hand"){
                $("#mode_switch").bootstrapSwitch('state', false, true);
                local['mode'] = "auto";
            }
            $(".state-bar").find(".bootstrap-switch-label").text(cur_mode);
            message_show("已选择"+local['curScene']+"模式！");
            control.manage_switcher(true);
        }
        //模式关闭
        else{
            local['curScene'] = scene.curSetScene = "默认";
            $(".state-bar").find(".bootstrap-switch-label").text("默认");
            message_show(scene.curSetScene+"模式撤销，已自动切换为默认模式！");
        }
        page.storeLocalStorage();
        // 进入当前模式的配置
        scene.get_scene_val();
    });
    $("#scene .bootstrap-switch").hide();

    // 每一分钟获取一次时间
    setInterval(function () {
        page.getTime();
    }, 60000);

    //page.toPage('#sins', '#sinInfoBg');
    //page.toPage('#sins', '#sinInfo');

    // 新增模式模态框弹出
    $("#newModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        modal.curType = $dom.data("type");
        $(this).find("#newTitle").text(modal.type2txt[modal.curType]).end().find("#new-"+modal.curType+"-form").removeClass("hidden").siblings("form").addClass("hidden");
        if(modal.curType == "scene"){
            modal.curIndex = $dom.index();
        }else if(modal.curType == "rfid"){
            //获取编辑按钮对应行的数据填入模态框
            //$dom.parents("td").siblings("")
        }else if(modal.curType == "elec"){
            modal.curIndex = $dom.parents(".control-div").index() - 5;
            console.log("当前index="+modal.curIndex);
        }
    }).on("hidden.bs.modal", function (e) {
        $(this).find("input[type!=radio]").val("");
    });

    // 编辑模态框弹出
    $("#editModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        modal.curType = $dom.data("type");
        modal.curIndex = $dom.parents("tr").index();
        $(this).find("#editTitle").text(modal.type2txt[modal.curType]).end().find("#edit-"+modal.curType+"-form").removeClass("hidden").siblings("form").addClass("hidden");
        if(modal.curType == "rfid"){
            //获取编辑按钮对应行的数据填入模态框
            var obj = {};
            $dom.parents("tr").find("td").each(function (index,element) {
                obj[index] = $(this).text();
            })
            $("#editRfidName").val(obj[1]);
            $("#editRfidId").val(obj[3]);
            $(".rfidSex[value="+ obj[2] +"]").prop("checked", true);
        }
    });

    //删除模态框弹出
    $("#delModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        modal.curType = $dom.data("type");
        modal.arr = [];
        if(modal.curType == "scene"){
            $("#delInfo").text(modal.curName+"（序列号为："+(modal.curIndex+1)+"）");
        }
        else if(modal.curType == "rfid"){
            var    delTxt = "",
                delNum = 0,
                length = $("#rfidTable").find("tr").length;
            $("#rfidTable").find("input[class!=selectall]:checked").each(function () {
                delNum ++;
                modal.curIndex = $(this).parents("tr").index()+1;
                if($.inArray(modal.curIndex, modal.rfidArr)) modal.rfidArr.push(modal.curIndex);
                delTxt += "卡号"+ $(this).parents("tr").find("td:eq(3)").text()+"，";
            });
            if(delTxt ==""){
                $("#bigInfo").addClass("hidden").next("#bigInfoNull").removeClass("hidden");
            }else{
                $("#bigInfo").removeClass("hidden").next("#bigInfoNull").addClass("hidden");
            }
            if(delNum == length-1)
                delTxt = "全部rfid卡号，";
            delTxt = delTxt.substr(0, delTxt.length-1);
            $("#delInfo").text(delTxt);
        }
        else if(modal.curType == "elec"){
            modal.curIndex = $dom.parents(".control-div").index() - 5;
            modal.curName = $dom.siblings(".elec-title").text();
            $("#delInfo").text("电器 ："+modal.curName);
        }
    })

    $(".table-striped td[class!='actionTd']").on("click", secure.getCheckbox);

    //$(".controller-i:eq(0)").click();
    // 调试用，直接连接数据
    modal.saveIDKEY();

//遥控器点击事件-按钮
    $("#control_table").on("click","td",function(e){
        var $dom = $(e.target);
        if($dom[0].tagName!="SPAN"){
            console.log("letter="+$(this).find(".id-letter").text());
            ir_control($(this).find(".id-letter").text(), control.cur_controller_mode);
        }
    })

    // 遥控器模态框隐藏清空
    $("#modeModal").on("hidden.bs.modal", function () {
        $("#modeKey").val("1");
        $("#modeTxt").val("");
        $("#checkMode").text(" ");
    })
        .on("show.bs.modal", function (e) {
            var $dom = $(e.relatedTarget);
            var domName = $dom.get(0).tagName;
            var first = $dom.parents(".modalCol").find("table tr:eq(0)").find("td:eq(0)").find(".mode_txt").text();
            console.log(first);
            if(first!=""){
                $("#modeTxt").val(first);
            }
        })

    //在家模式下，点击右侧传感器开关
    $(".sin-home-uls").on("click" , function (e) {
        var $dom = $(e.target);
        //console.log("点击sin-home-uls："+JSON.stringify($dom));
        if($dom.data("toggle")!="modal"){
            if(inTimeSet!=0){
                if($dom.is("li")){
                    console.log("当前配置时间段："+inTimeSetTxt);
                    console.log("当前配置的传感器："+$dom.text());
                    var state = !$dom.hasClass("sin-c-off");
                    var index = $dom.index(".sin-ci");
                    console.log("stage="+scene.curStage);
                    var curArr = local['scene']['默认'][scene.curStage]['open'];
                    console.log("state="+state+"----index="+index+"----curArr="+curArr+"----current_scene_index="+current_scene_index);
                    if(state){ // 关
                        console.log("guan");
                        $dom.addClass("sin-c-off");
                        for(var i in curArr){
                            if(curArr[i]==index){
                                curArr.splice(i,1);
                            }
                        }
                    }else{ // 开
                        console.log("kai");
                        $dom.removeClass("sin-c-off");
                        if($.inArray(index, curArr)<0){
                            curArr.push(index);
                        }
                    }
                    console.log("是否在数组中：",$.inArray(index, curArr));
                    console.log("插入后，index="+index+"----arr="+curArr);
                    local['scene']['默认'][scene.curStage]['open'] = curArr;
                    page.storeLocalStorage();
                }
            }
            else{
                message_show("请先选择需要配置的时间段");
            }
        }
    })

    //点击模式进入模式详情
    $("#sins").on("click", ".sin", function (e) {
        var $dom = $(e.target);
        current_scene_index = $dom.index();
        var scene_fullname = $dom.find("span").text();
        scene.curScene = scene_fullname.substring(0,scene_fullname.length-2);
        console.log(scene.curScene);
        if($dom.data("title")!="sin-other"){
            $(".img-del-scene").addClass("hidden");
        }else{
            $(".img-del-scene").removeClass("hidden");
        }
        // 进入默认模式
        if(scene.curScene == "默认"){
            page.toPage('#sins', '#sinInfoBg');
            $("#sceneName").text($dom.find("span").text());
            // 恢复时间设置
            $("#onWork").text(local['scene']['默认']['stage1']['time']);
            $("#outWork").text(local['scene']['默认']['stage2']['time']);
            $("#sleep").text(local['scene']['默认']['stage3']['time']);
        }
        //进入其他模式
        else if(!$dom.hasClass("sin-more") && $dom.hasClass("sin")){
            page.toPage('#sins', '#sinInfo');
            $("#sceneName").text($dom.find("span").text());
            modal.curIndex = $dom.index();
            modal.curName = $dom.find("span").text();
            $("#scene .bootstrap-switch").show();
        }
        if(local['scene']){
            if(local['scene'][scene.curScene]){
                if(!local['scene'][scene.curScene]['open']){
                    local['scene'][scene.curScene]['open'] = [];
                }
                var arr = local['scene'][scene.curScene]['open'];
                $(".sin-cc[data-toggle!=modal]").addClass("sin-c-off");
                for(var i=0; i<arr.length;i++){
                    $(".sin-cc:eq("+arr[i]+")").removeClass("sin-c-off");
                }
            }
        }
        if(local['curScene']){
            $("#scene_switch").bootstrapSwitch('state', local['curScene']+"模式"==$("#sceneName").text(), true);
        }
    })

    //$("[data-title=sin-homeout]").click();

    //$(".sin-cc[data-title=fan]").click();

    // 模式详情下，点击传感器方框切换开关
    $(".sin-cc[data-toggle!=modal]").on("click", function () {
        var state = !$(this).hasClass("sin-c-off");
        var index = $(this).index(".sin-cc");
        //console.log("curscene="+scene.curScene);
        var name = $(this).text();
        var curArr = local['scene'][scene.curScene]['open'];
        if(state){ // 关
            $(this).addClass("sin-c-off");
            for(var i in curArr){
                if(curArr[i]==index){
                    curArr.splice(i,1);
                }
            }
            message_show(name+"关！");
        }else{ // 开
            $(this).removeClass("sin-c-off");
            if($.inArray(index, curArr)){
                curArr.push(index);
            }
            message_show(name+"开！");
        }
        local['scene'][scene.curScene]['open'] = curArr;
        console.log(scene.curScene, JSON.stringify(local['scene']));
        page.storeLocalStorage();
    })

    // 场景页面-控制器弹窗设置滑块
    $('#nstSliderS').nstSlider({
        "left_grip_selector": "#leftGripS",
        "right_grip_selector": "#rightGripS",
        "value_bar_selector": "#barS",
        "value_changed_callback": function(cause,leftValue,rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabelS').text(leftValue);
            $container.find('#rightLabelS').text(rightValue);
            $('#nstSliderS').nstSlider('highlight_range',leftValue,rightValue);
        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });

    $('#nstSliderS2').nstSlider({
        "left_grip_selector": "#leftGripS2",
        "value_bar_selector": "#barS2",
        "value_changed_callback": function(cause, leftValue, rightValue) {
            var $container = $(this).parent(),
                g = 255 - 127 + leftValue,
                r = 255 - g,
                b = 0;
            $container.find('#leftLabelS2').text(rightValue);
            $container.find('#rightLabelS2').text(leftValue);
            $(this).find('#barS2').css('background', 'rgb(' + [r, g, b].join(',') + ')');
        }
    });

    //场景页面-控制器弹窗拍照频率设置滑块
    $('#nstSliderC').nstSlider({
        "left_grip_selector": "#leftGripC",
        "value_changed_callback": function(cause, leftValue, rightValue) {
            $(this).parent().find('#leftLabelC').text(leftValue);
        }
    });

    //模式详情下，弹出阈值设置窗口
    $("#sceneModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        var title = $dom.data("title");
        var name = $dom.text();
        var bool = $.inArray(title, ['humidifier', 'curtain'])>-1 ? true : false;  // 在数组内的传感器，显示为：左开，右关，即值太低时开，太高时关
        scene.get_info_mess(bool);
        $("#sceneTitle").text(scene.curScene+"模式").next("#sceneElecTitle").text(name);
        scene.curThreshold =  scene.elec2sensor[title];
        scene.curThresholdName =  scene.sensor2name[scene.curThreshold];
        $("#scene_info_title").text(scene.curThresholdName);
        console.log(scene.curScene);
        console.log(title);
        console.log(scene.curThreshold);
        console.log("当前场景："+scene.curScene+"----当前传感器："+title+"当前设备对应的传感器阈值:"+scene.curThreshold+"----"+local['scene'][scene.curScene][scene.curThreshold]);
        var $nstSlider;
        var isPM = scene.curThresholdName=="PM2.5阈值"
        $nstSlider = isPM ? $("#nstSliderS2") : $("#nstSliderS");
        //$(".nstSlider").removeClass("hidden");
        $nstSlider.removeClass("hidden").siblings(".nstSlider").addClass("hidden");
        $nstSlider.nstSlider("set_range", local[scene.curThreshold][2], local[scene.curThreshold][3]);
        if(scene.curScene == "默认"){
            if(!inTimeSet){
                message_show("请先选择需要配置的时间段");
            }else{
                console.log("当前时间段："+scene.curStage);
                if(!local['scene']['默认'][scene.curStage][scene.curThreshold])
                    local['scene']['默认'][scene.curStage][scene.curThreshold] = [];
                console.log("obj="+JSON.stringify(local['scene']['默认'][scene.curStage])+"----scene.curThreshol="+scene.curThreshold);
                if(isPM)
                    $nstSlider.nstSlider("set_position", local['scene']['默认'][scene.curStage][scene.curThreshold][1]);
                else
                    $nstSlider.nstSlider("set_position", local['scene']['默认'][scene.curStage][scene.curThreshold][0], local['scene']['默认'][scene.curStage][scene.curThreshold][1]);
            }
        }else{
            if(!local['scene'][scene.curScene].hasOwnProperty(scene.curThreshold))
                local['scene'][scene.curScene][scene.curThreshold] = [];
            if(isPM)
                $nstSlider.nstSlider("set_position", local['scene'][scene.curScene][scene.curThreshold][1]);
            else
                $nstSlider.nstSlider("set_position", local['scene'][scene.curScene][scene.curThreshold][0], local['scene'][scene.curScene][scene.curThreshold][1]);
        }
    })
        .on("shown.bs.modal", function () {
            if(scene.curScene == "默认"&& !inTimeSet){
                $("#sceneModal").modal("hide");
                message_show("请先选择需要配置的时间段");
            }
        })
        .on("hidden.bs.modal", function () {
        })

    $("#rgbModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        isCurRGB = $dom.data("title")=="curRGB";
        if(isCurRGB){
            $("#rgbColorSet").on("click", control.changeLightColor);
            $(".rgb-mode-set").on("click", control.changeLightMode);
            $("#rgb_set_switch").hide();
            $("#RGB_save").hide();
        }else{
            console.log(scene.curScene);
            $("#rgbColorSet").unbind();
            $(".rgb-mode-set").unbind();
            $("#rgb_set_switch").unbind();
            $(".rgb-set-c").removeClass("rgb-c-active");
            console.log(scene.curScene, local['scene'][scene.curScene]['rgb']);
            $("#rgb_set_"+local['scene'][scene.curScene]['rgb']).addClass("rgb-c-active");
            $("#rgb_set_switch").show();
            $("#RGB_save").show();
        }
    })

    $("#clearModal").on("show.bs.modal", function (e) {
        var $dom = $(e.relatedTarget);
        var title = $dom.data("clear")== "alarm" ? "警报" : "刷卡";
        $("#clear_cur_span").text(title);
        $("#clearConfirm").data("clear", $dom.data("clear"));
    })
        .on("hidden.bs.modal", function () {
            $("#clear_cur_span").text("");
        })

    //模式详情-阈值设置模态框
    $("#scene_threshold_save").on("click touchend", function () {
        scene.save_threshold();
    })
});

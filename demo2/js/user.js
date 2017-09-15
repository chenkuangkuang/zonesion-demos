var connectFlag = 0;
var server;

/*
 * title2type:将不同的按钮转换成对应的指令，并根据type字段可以找到对应节点mac地址
 */
var title2type = {
    "RFID":{
        type:"802",
        cmd:{
            query:"{A0=?,A1=?}"
        }
    }
};
var mac2type = {};
var type2mac = {};
function process_tag(mac, tag, val) {
    //console.log(mac, tag, val);
    if (tag == "TYPE") {
        var t = val.substr(2,3);
        mac2type[mac] = t;
        type2mac[t] = mac;
        if (wsn_config[t]){
            wsn_config[t].online();
        }
        var id = "type_"+t;
        $("#"+id).val(mac);
    }
    var t = mac2type[mac];
    if (t && wsn_config[t]){
        wsn_config[t].pro(tag, val);
    }
}
var rtc = new WSNRTConnect();
rtc.onConnect = onConnect;
rtc.onConnectLost = onConnectLost;
rtc.onmessageArrive = onmessageArrive;
rtc._connect = false;
var wsn_config = {
    application: {
        aid: "",
        akey: "",
        server: ""
    },
    "002":{
        online:function(){   //环境温度
        },
        pro:function(tag,val){
        }
    },
    "001":{ //光照度
        online:function(){
        },
        pro:function(tag, val){

        }
    },
    "028":{//CO2
        online:function(){
        },
        pro:function(tag, val){

        }
    },
    "004":{
        online:function(){
            //var index = get_index("人体红外");
            //var $hexIn = $(".board:eq("+index+")");
            //$hexIn.removeClass("off-line");
        },
        pro:function(tag, val){
        }
    },
    "104":{
        online:function(){

        },
        pro:function(tag, val){
        }
    },
    "003":{ //rgb灯
        online:function(){
        },
        pro:function(tag, val){
        }
    },
    "008":{ //声光报警
        online:function(){
            //var index = get_index("声光报警");
            //var $hexIn = $(".board:eq("+index+")");
            //$hexIn.removeClass("off-line");
        },
        pro:function(tag, val){

        }
    },
    "007":{   //排风扇
        online:function(){
            $("#img04").attr("src","images/fna.png");
            $("#off4").css("background-color","rgba(153, 153, 153, 0.54902)");
        },
        pro:function(tag, val){

        }
    },
    "810":{ //4路继电器组
        online:function(){
            $("#img01").attr("src","images/dianreji.png");
            $("#off1").css("background-color","rgba(153, 153, 153, 0.54902)");
            $("#img02").attr("src","images/HumFan.png");
            $("#off2").css("background-color","rgba(153, 153, 153, 0.54902)");
            $("#img05").attr("src","images/diWorm.png");
            $("#off5").css("background-color","rgba(153, 153, 153, 0.54902)");
            $("#img08").attr("src","images/buguangdeng.png");
            $("#off8").css("background-color","rgba(153, 153, 153, 0.54902)");
        },
        pro:function(tag, val){

        }
    },
    "850":{ //电磁阀，接近开关，直流电机
        online:function(){
            $("#img07").attr("src","images/ganBing.png");
            $("#off7").css("background-color","rgba(153, 153, 153, 0.54902)");
            $("#img03").attr("src","images/penlin.png");
            $("#off3").css("background-color","rgba(153, 153, 153, 0.54902)");
        },
        pro:function(tag, val){

        }
    },
    "851":{       //步进电机，气泵，水泵
        online:function(){
            $("#img06").attr("src","images/diguang.png");
            $("#off6").css("background-color","rgba(153, 153, 153, 0.54902)");
            $("#img09").attr("src","images/zheyangp.png");
            $("#off9").css("background-color","rgba(153, 153, 153, 0.54902)");
        },
        pro:function(tag, val){
        }
    },
    "860":{    //风速
        online:function(){
        },
        pro:function(tag, val){
        }
    },
    "100":{  //红外遥控
        online:function(){

        },
        pro:function(tag, val){
        },
    },
    "862":{
        online:function(){

        },
        pro:function(tag, val){

        }
    },
    //RFID
    "802":{
        online:function(){
            //readcard(val);
        },
        pro:function(tag, val){
            if (tag == "A0" && val!=0 && val!="0"){ //rfid读卡处理
                console.log("获取到rfid信息："+val+"，将自动拍照");
                readcard(val);
            }
            if (tag == "D1") {// 电磁锁开关处理

            }
        }
    }
};

function onConnect(){
    connectFlag =1;
    message_show('连接成功');
    rtc._connect=true;
    connect.connect_btn = "断开"
}
function onConnectLost(){
    message_show('实时连接断开');
    rtc._connect = false;
    connect.connect_btn = "连接"
    setTimeout(rtc.connect, 3000);
}
function onmessageArrive(mac, dat) {
    //console.log(mac+" >>> "+dat);
    if (dat[0]=='{' && dat[dat.length-1]=='}') {
        dat = dat.substr(1, dat.length-2);
        var its = dat.split(',');
        for (var i=0; i<its.length; i++) {
            var it = its[i].split('=');
            if (it.length == 2) {
                var tag = it[0];
                var val = it[1];
                process_tag(mac, tag, val);
            }
        }
        if (!mac2type[mac]) { //如果没有获取到TYPE值，主动去查询
            rtc.sendMessage(mac, "{TYPE=?,A0=?,A1=?,A2=?,A3=?,A4=?,A5=?,A6=?,A7=?,D1=?}");
        }
    }
}

//载入页面后自动读取id key 并连接
function on_get_aid_akey() {
    connect.set_connect.id = connect.set_connect.id ? connect.set_connect.id : config['id'];
    connect.set_connect.key = connect.set_connect.key ? connect.set_connect.key : config['key'];
    connect.set_connect.server=  connect.set_connect.server ? connect.set_connect.server : config['server'];
    check_connect();
    connect.set_connect.camera_addr = connect.set_connect.camera_addr ? connect.set_connect.camera_addr : config['camera_addr'];
    connect.set_connect.camera_type = connect.set_connect.camera_type ? connect.set_connect.camera_type : config['camera_type'];
    connect.set_connect.camera_user = connect.set_connect.camera_user ? connect.set_connect.camera_user : config['camera_user'];
    connect.set_connect.camera_pw = connect.set_connect.camera_pw ? connect.set_connect.camera_pw : config['camera_pw'];
    //console.log(JSON.stringify(connect.set_connect));
}

var readCardIndex;
var modalTimer = null;
function readcard(rfid){
    home.shoot();
    if(modalTimer)
        clearTimeout(modalTimer);
    var name = rfid2name(rfid);
    console.log("name="+name);
    if(name){
        $("#message").text("刷卡成功："+name+"\n卡号："+rfid);
        console.log("刷卡成功："+name+"----卡号："+rfid);
        // 完成该生的签到
        console.log(readCardIndex);
        home.students[readCardIndex].call = true;
        $("#modal").modal("show");
        modalTimer = setTimeout(function () {
            $("#modal").modal("hide");
        }, 2000);
    }else{
        speakText("未知刷卡");
        message_show("未知刷卡！");
    }
}

function rfid2name(rfid){
    for(var i=0;i<home.students.length;i++){
        console.log(rfid, home.students[i].rfid);
        if(rfid==home.students[i].rfid){
            readCardIndex = i;
            return home.students[i].message;
        }
    }
}

function check_connect(){
    if (connect.set_connect.id && connect.set_connect.key && connect.set_connect.server) {
        rtc.setServerAddr(connect.set_connect.server+":28080");
        rtc.setIdKey(connect.set_connect.id,  connect.set_connect.key);
        rtc.connect();
    }else{
        message_show("请正确输入id key");
    }
}

function get_connect () {
    configure.storeStorage();
    if(!rtc._connect){
        check_connect();
    }else{
        rtc.disconnect();
    }
}

var camera_cfg = {};
var openCamera = null;
var cwTitle = null;
function on_get_gw_camera(s) {
    if (s) {
        camera_cfg = JSON.parse(s);
    }
}

function open_video2(){

    var ca = connect.set_connect.camera_addr;
    var type = connect.set_connect.camera_type;
    var user = connect.set_connect.camera_user;
    var pwd = connect.set_connect.camera_pw;

    var myipcamera = new WSNCamera();
    openCamera = myipcamera;

    myipcamera.setDiv("img2");//设置图像显示的位置
    console.log(ca,type,user,pwd);
    home.camera_btn = "正在连接……";
    myipcamera.setServerAddr("zhiyun360.com:8002");
    myipcamera.initCamera(ca, user, pwd,type); //摄像头初始化
    myipcamera.checkOnline(function(state){
        console.log('camera online',state);
        if(state == 1){
            if (openCamera) {
                openCamera.openVideo();//打开摄像头并显示
                //$("#switch2").text("关闭");
                home.camera_btn = "关闭";
                $("#switch2").addClass("openDivImg");
            }else{
                home.camera_btn = "开启";
                $("#switch2").removeClass("openDivImg");
                $("#switch2").removeAttr("disabled");
            }
        } else {
            message_show("摄像头["+ca+"]不在线！");
            home.camera_btn = "开启";
            $("#img2").attr("src", "images/camera.jpg").css("display", "block");
            $("#switch2").removeClass("openDivImg");
            openCamera = null;
        }
    });
    //保存摄像头信息
    cam  = {
        addr:ca,
        type:type,
        user:user,
        pwd:pwd
    };
    camera_cfg[cwTitle] = cam;
    if (window.droid){
        window.droid.setProperty("_gw_camera", JSON.stringify(camera_cfg));
    } else {
        localStorage._gw_camera = JSON.stringify(camera_cfg);
    }
}

function open_camera(){
    if (!openCamera) {
        open_video2();
        $(".openDiv").css('background-image','url"(../../images/on.png)"');
    } else { //关闭摄像头
        openCamera.closeVideo();
        openCamera = null;
            $("#img2").attr("src", "images/camera.jpg").css("display", "block");
    }
}

$(document).ready(function() {

    on_get_aid_akey();

    setInterval(function(){
        if (rtc._connect) {
            rtc.sendMessage("FF:FF:FF:FF:FF:FF:FF:FF", "{TPN=6/2}");
        }
    }, 15000);

    /* 函数名: on_scan_idkey
     * 功能: 扫描到id和key后调用
     */
    function on_scan_idkey(idkey) {
        var it = idkey.split(",");
        if (it.length == 2) {
            var aid = it[0].split(':')[1];
            var akey = it[1].split(':')[1];
            $("#id").val(aid);
            $("#key").val(akey);
        }
    }

    if (window.droid){
        window.droid.getProperty("_gw_camera", "on_get_gw_camera");
        //window.droid.getProperty("devices_macs", "on_get_device_macs");
    } else {
        //on_get_device_macs(localStorage.devices_macs);
        on_get_gw_camera(localStorage._gw_camera);
    }
    $(".openDiv").removeAttr('disabled');

    $("#ct_up").click(function(){
        if (openCamera)openCamera.control("UP");
    });
    $("#ct_left").click(function(){
        if (openCamera)openCamera.control("LEFT");
    });
    $("#ct_down").click(function(){
        if (openCamera)openCamera.control("DOWN");
    });
    $("#ct_right").click(function(){
        if (openCamera)openCamera.control("RIGHT");
    });
    $("#ct_v").click(function(){
        if (openCamera)openCamera.control("VPATROL");
    });
    $("#ct_h").click(function(){
        if (openCamera)openCamera.control("HPATROL");
    });
    $("#ct_c").click(function(){
        if (openCamera)openCamera.control("360PATROL");
    });

});

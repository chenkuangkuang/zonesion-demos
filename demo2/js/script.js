
//定义本地存储参数
var localData = {
    students : [],
    courses : [
        {week : '第一节', course : [
            {'num' : '周一', 'name' : '数学'},
            {'num' : '周二', 'name' : '体育'},
            {'num' : '周三', 'name' : '数学'},
            {'num' : '周四', 'name' : '英语'},
            {'num' : '周五', 'name' : '数学'},
        ]},
        {week : '第二节', course : [
            {'num' : '周一', 'name' : '历史'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '数学'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '政治'},
        ]},
        {week : '第三节', course : [
            {'num' : '周一', 'name' : '语文'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '数学'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '政治'},
        ]},
        {week : '第四节', course : [
            {'num' : '周一', 'name' : '语文'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '数学'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '政治'},
        ]},
        {week : '第五节', course : [
            {'num' : '周一', 'name' : '历史'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '英语'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '政治'},
        ]},
        {week : '第六节', course : [
            {'num' : '周一', 'name' : '政治'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '历史'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '生物'},
        ]},
        {week : '第七节', course : [
            {'num' : '周一', 'name' : '英语'},
            {'num' : '周二', 'name' : '音乐'},
            {'num' : '周三', 'name' : '数学'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '数学'},
        ]},
        {week : '第八节', course : [
            {'num' : '周一', 'name' : '数学'},
            {'num' : '周二', 'name' : '数学'},
            {'num' : '周三', 'name' : '体育'},
            {'num' : '周四', 'name' : '地理'},
            {'num' : '周五', 'name' : '政治'},
        ]},
    ],
    set_connect : {
        id : '',
        key : '',
        server : '',
        mac : '00:00:00:00:00:00:00:00',
        camera_addr : '',
        camera_type : '',
        camera_user : '',
        camera_pw : ''
    },
}

//
// 本演示使用的数据库名称
var dbName = 'sign6';
// 版本
var version = 1;
// 数据库数据结果
var db;

// 打开数据库
var DBOpenRequest = window.indexedDB.open(dbName, version);


//数据库的添加、编辑、删除等
var method = {
    add: function (newItem) {
        console.log("新增数据："+JSON.stringify(newItem));
        var transaction = db.transaction([dbName], "readwrite");
        // 打开已经存储的数据对象
        var objectStore = transaction.objectStore(dbName);
        // 添加到数据对象中
        var objectStoreRequest = objectStore.add(newItem);
        objectStoreRequest.onsuccess = function(event) {
            method.show();
            message_show("新增历史数据成功！");
        };
    },
    edit: function (id, data) {
        console.log("编辑数据：id="+id+"----data="+JSON.stringify(data));
        // 编辑数据
        var transaction = db.transaction([dbName], "readwrite");
        // 打开已经存储的数据对象
        var objectStore = transaction.objectStore(dbName);
        // 获取存储的对应键的存储对象
        var objectStoreRequest = objectStore.get(id);
        // 获取成功后替换当前数据
        objectStoreRequest.onsuccess = function(event) {
            // 当前数据
            var myRecord = objectStoreRequest.result;
            // 遍历替换
            for (var key in data) {
                if (typeof myRecord[key] != 'undefined') {
                    myRecord[key] = data[key];
                }
            }
            // 更新数据库存储数据
            objectStore.put(myRecord);
        };
    },
    del: function (id) {
        // 打开已经存储的数据对象
        var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);
        // 直接删除
        var objectStoreRequest = objectStore.delete(id);
        // 删除成功后
        objectStoreRequest.onsuccess = function() {
            method.show();
        };
    },
    show: function () {
        // 最终要展示的HTML数据
        var htmlProjectList = '';
        // 打开对象存储，获得游标列表
        var objectStore = db.transaction(dbName).objectStore(dbName);
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            // 如果游标没有遍历完，继续下面的逻辑
            if (cursor) {
                htmlProjectList = htmlProjectList + strTplList.temp(cursor.value)
                // 继续下一个游标项
                cursor.continue();
                // 如果全部遍历完毕
            } else {
                eleTbody.innerHTML = htmlProjectList;
                if (htmlProjectList == '') {
                    console.log('暂无数据');
                }
            }
        }
    },
    date2data : function () {
        //表格清零
        $("#histable tr").find("td:gt(0)").html('<a>-<\/a>');
        var $table = $("#histable");
        var jsonDate = $("#myday").val(); // 查询的开始时间
        var endDate = $table.find("th:eq(5)").data("date"); // 查询的结束时间
        var objectStore = db.transaction(dbName).objectStore(dbName);
        var index = objectStore.index("date");
        var request=index.openCursor(IDBKeyRange.bound(jsonDate, endDate,false,false));
        //objectStore.openCursor().onsuccess = function(event) {
        request.onsuccess=function(e){
            var cursor = event.target.result;
            // 如果游标没有遍历完，继续下面的逻辑
            if (cursor) {
                //cursor.value即单条数据对象
                // 三个参数分别为目标表单id，当前查看模式，选中的教室/教师 id号
                message_show("进入查询，请等待!!!");
                //for(var key in msg){
                for(var i=1;i<$table.find("th").length;i++){ // i为当前列数
                    var currentColDate = $table.find("th:eq("+i+")").data("date");
                    for(var j=1;j<$table.find("tr").length+2;j++){ // j为当前行数
                        //var currentRowTime = config.colTime[j];
                        if(cursor.value['date']==currentColDate && cursor.value['index']-j==0){
                            var object = {};
                            for(var k in cursor.value){
                                object[k] = cursor.value[k];
                            }
                            console.log("获取当前考勤：object="+JSON.stringify(object));
                            var tooltiptxt = "课程名称："+object["name"]+"<br />出勤率："+object["people"]+"<br />签到人："+object["sign"]+"<br />缺勤人："+object["absent"];
                            var classname = object["people"].split("/")[0]==object["people"].split("/")[1] ? "count" : "noall";
                            var htmlStr = object["name"]+'<span  class='+classname+'>'+object["people"]+'<\/span>';
                            //console.log("table=------i="+i+"--j="+j+"html="+htmlStr);
                            $table.find("tr:eq("+j+")").find("td:eq("+i+") a").addClass("add-class").html(htmlStr).data(object).attr({"toggle":"tooltip","title":tooltiptxt,"data-toggle":"modal","data-target":"#courseModal"}).data({"placement":"top","sign":object['sign'],"absent":object['absent']}).tooltip({html:true});
                        }
                    }
                }
                // 继续下一个游标项
                cursor.continue();
                // 如果全部遍历完毕
            } else {
                $('[data-toggle="tooltip"]').tooltip();
            }
        }
    }
};

//运营首页
var home = new Vue({
    el : '#home',
    data : {
        today : '',
        time : '',
        hour :'',
        minute : '',
        last_minute : '66',
        cal_text : '开始点名',
        period : [
            "08:20-09:05",
            "09:15-10:00",
            "10:20-11:05",
            "11:15-12:00",
            "14:00-14:45",
            "14:55-15:40",
            "16:00-16:45",
            "16:55-17:40",
        ],
        students : localData.students,
        courses : localData.courses,
        week : '',
        courseIndex : 0,
        showIndex : -1,
        todayCouses : [],
        calling : false,
        getCurCourseInt : true,
        curCouse : '',
        nextCourse : '今日已无课程',
        showCurCourse : true,
        addClassInt : false,
        courseTimeArr : [],
        courseTimeArrEven : [],
        courseTimeArrOdd : [],
        isEven : false,
        camera_btn : "开启",
        isNoStudents2 : false
        //txt2index : {
        //    "第一节" :
        //}
    },
    computed : {
        isNoStudents : function () {
            if(this.students){
                this.isNoStudents2 = this.students.length==0;
                return  this.calling || this.students.length==0;
            }
        }
    },
    methods : {
        getTime : function () {
            var curDate = new Date();
            this.week = "周"+getWeek(curDate);
            var year = curDate.getFullYear();
            var month = curDate.getMonth()+1>9 ? curDate.getMonth()+1 : '0'+(curDate.getMonth()+1);
            var day = curDate.getDate()>9 ? curDate.getDate() : '0'+curDate.getDate();
            var hour = this.hour = curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours();
            var minute = this.minute = curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes();
            var second = curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds();
            home.today = year + "-" + month + "-" + day;
            var timeTxt = year + '年' + month + '月' + day + '日' + '   ' + hour + ':' + minute + ':' + second;
            this.time = timeTxt;
            if(this.last_minute != minute) {
                if (this.checkInTimes(hour, minute)) {
                    this.getTodayCouse();
                }
                this.last_minute = minute;
            }
        },
        // 验证当前时间是否在课程时间数组中
        checkInTimes : function (h ,m) {
            if(this.courseTimeArr.length>0){
                var con = false;
                var text = h+":"+m;
                if($.inArray(text, this.courseTimeArr)>-1){
                    con = true;
                    //this.showIndex +=0.5;
                }
                // 检测到当前时间为每节课的结束时间
                this.isEven = $.inArray(text, this.courseTimeArrEven)>-1;
                this.isOdd = $.inArray(text, this.courseTimeArrOdd)>-1;
                this.islastOdd = text==this.courseTimeArrOdd[this.courseTimeArrOdd.length-1];
                if(this.isOdd)
                    this.getCurCourse2();
                return con;
            }
        },
        startCall : function () {
            this.cal_text = '正在点名……';
            var calling_text = "";
            for(var i=0;i<this.students.length;i++){
                calling_text += this.students[i].message+" ";
            }
            console.log("点名内容："+calling_text);
            speakText(calling_text);
            this.calling = true;
        },
        endCall : function () {
            console.log("点名完成");
            message_show("点名完成！");
            speakText("点名完成");
            setTimeout(function () {
                home.cal_text = '再次点名';
                home.calling = false;
            }, 1000);
        },
        recall : function (event) {
            var index = event.target.getAttribute("data-index");
            configure.items[index].call = home.students[index].call = true;
            configure.storeStorage();
            message_show(localData.students[index].message+"补签到完成！");
        },
        getTodayCouse : function () {
            this.todayCouses = [];
            for (var i = 0; i < localData.courses.length; i++) {
                var arr = localData.courses[i].course;
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j].num == this.week) {
                        var obj = {
                            name: arr[j].name,
                            index : localData.courses[i].week,
                            isCurCourse: false
                        }
                        this.todayCouses.push(obj);
                    }
                }
            }
            if (this.todayCouses.length>0) {
                this.getCurCourse(this.hour, this.minute);
                this.getCurCourseInt = false;
            }else{
                this.showCurCourse = false;
            }
        },
        getCurCourse : function (h, m) {
            this.curCouse="";
            for(var k=0;k<home.period.length;k++){
                if(compareTime(h, m, home.period[k], k)){
                    if(this.curCouse%1===0)
                        this.showCurCourse = true;
                    this.showIndex = k;
                    this.curCouse = this.todayCouses[k].name+"-"+home.period[k];
                    setTimeout(function () {
                        home.addClassLi();
                    }, 0)
                }
            }
            if(this.isOdd){
                setTimeout(function () {
                    home.removeClassLi();
                }, 0)
            }
            if(this.curCouse==""){
                this.showCurCourse = false;
            }
            var nextIndex = this.isOdd ? this.showIndex : this.showIndex+1;
            if(this.todayCouses[nextIndex] && !this.isOdd){ // 下一节课存在，且当前时间不在课程结束时间数组中
                if(this.todayCouses[nextIndex].name && home.period[nextIndex])
                    this.nextCourse = this.todayCouses[nextIndex].name+"-"+home.period[nextIndex];
            }else{
                if(this.islastOdd)
                    this.nextCourse = "今日已无课程"
            }
        },
        addClassLi : function () {
            if(!this.addClassInt){
                $("#ctodayCourse>li:eq("+this.showIndex+")").addClass("today-course-cur").siblings("li").removeClass("today-course-cur");
                this.addClassInt = true;
            }
        },
        removeClassLi : function () {
            $("#ctodayCourse>li").removeClass("today-course-cur");
        },
        getCurCourse2 : function () {
            if(home.students){
                var num = home.students.length;
                var signNum = 0;
                var sign = [];
                var absent = [];
                for(var i=0;i<num;i++){
                    if(localData.students[i]['call'] && $.inArray(home.students[i]['message'], sign)<0){
                        signNum++;
                        sign.push(home.students[i]['message']);
                    }else if(!home.students[i]['call'] && $.inArray(home.students[i]['message'], absent)<0){
                        absent.push(home.students[i]['message']);
                    }
                }
                var people = signNum + "/" + num;
                var obj = {
                    name : this.curCouse.split("-")[0],
                    date : this.today,
                    index : this.showIndex+1+"",
                    people : people,
                    sign : sign.join(" "),
                    absent : absent.join(" ")
                }
                console.log("课程结束，将清除当前课程打开记录，并自动保存当前上课考勤："+JSON.stringify(obj))
                // 清除当前课程打卡记录
                this.clearCall();
                // 延迟添加历史记录，避免当前时间（课程结束时间刷新页面时），添加历史数据的操作在初始化数据库之前执行导致的报错
                setTimeout(function () {
                    method.add(obj);
                }, 200)
            }
        },
        clearCall : function () {
            for(var i=0;i<configure.items.length;i++){
                configure.items[i].call =  false;
            }
            configure.storeStorage();

        },
        shoot : function () {
            console.log("自动拍照！");
            var url = $("#img2").attr("src");
            console.log("url="+url+"，openCamera="+openCamera);
            if(window.droid){message_show("安卓暂不支持自动拍照下载");return;}
            if(url.indexOf("http")<0 || !openCamera){
                message_show("摄像头未打开！");
                return;
            }
            download(url);
        }
    }
})

//时间比较函数
function compareTime(h, m, timeStr, k){
    var flag = false;
    var start = timeStr.split("-")[0];
    var start_h = start.split(":")[0];
    var start_m = start.split(":")[1];
    var end = timeStr.split("-")[1];
    var end_h = end.split(":")[0];
    var end_m = end.split(":")[1];
    //两种情形：a:b 在 8:20-9:05之间，8点，分针超过20，同时小于05
    // 14:50 不在 14:00 -- 14:45 之间 ： m分针要小于end的分针，并且h==end_h
    // 8:36 在 8:20 -- 9:05 之间： m分针大于end的分针，并且h<end_h
    var check1 = h-start_h==0 && m-start_m>=0 && ((m-end_m<0 && h-end_h==0) || (m-end_m>0 && h-end_h<0));
    //两种情形：a:b 在 8:20-9:05之间，9点，但小于9点05
    var check2 = h-end_h==0 && m-end_m<0;
    //是否在时间段后面：a:b 与 8:20-9:05比较，9点，但超过9点05，或超过9点，
    var check3 = (h-end_h==0 && m-end_m>=0) || (h-end_h>0);
    //if(!flag && (h-start.split(":")[0]==0 || (h-start.split(":")[0]==-1))){
    //    console.log("比较时间："+start+"----str="+timeStr+"---k="+k+"-courseIndex---course="+home.todayCouses[k]);
    //    home.nextCourse = home.todayCouses[k]+"-"+timeStr;
    //}
    if(check1 || check2 ){
        flag = true;
        home.courseIndex ++;
        home.showIndex +=1;
        //home.showIndex++;
    }else if(check3){
        home.courseIndex ++;
        home.showIndex +=1;
        //home.showIndex++;
    }
    return flag;
}

//获取课程时间数组
function getCourseTimeArr (){
    home.courseTimeArr = [];
    for(var i=0;i<home.period.length;i++){
        var arr = home.period[i].split("-");
        for(var j=0;j<arr.length;j++){
            if($.inArray(arr[j], home.courseTimeArr)<0){
                home.courseTimeArr.push(arr[j]);
            }
            if(j==0 && $.inArray(arr[j], home.courseTimeArrEven)<0){
                home.courseTimeArrEven.push(arr[j]);
            }
            if(j==1 && $.inArray(arr[j], home.courseTimeArrOdd)<0){
                home.courseTimeArrOdd.push(arr[j]);
            }
        }
    }
}

getCourseTimeArr();

//历史数据页面
var record = new Vue({
    el : '#record',
    data : {
        query_dates : [
            {'date' : '1月1日', 'week' : '周一'},
            {'date' : '1月2日', 'week' : '周二'},
            {'date' : '1月3日', 'week' : '周三'},
            {'date' : '1月4日', 'week' : '周四'},
            {'date' : '1月5日', 'week' : '周五'}
        ],
        querydate : '2017-01-01'
    },
    methods : {

    }
})

//新增历史数据模态框
var addHisModal = new Vue({
    el : '#addHisModal',
    data : {
        add_name : '测试课程',
        add_index : '2',
        add_date : '2017-05-05',
        add_people : '5/12',
        add_sign : '嬴政 荆轲',
        add_absent : '李师师 王莽',
    },
    methods : {
        addHisCourse : function () {
            var signArr = this.add_sign.split(" ");
            var absentArr = this.add_absent.split(" ");
            var obj = {
                'name' : this.add_name,
                'index' : this.add_index,
                'date' : this.add_date,
                'people' : this.add_people,
                'sign' : this.add_sign,
                'absent' : this.add_absent
            }
            console.log("新增object："+JSON.stringify(obj));
            method.add(obj);
            this.add_name = "";
            this.add_index = "";
            this.add_date = "";
            this.add_people = "";
            this.add_sign = "";
            this.add_absent = "";
        }
    }
})

//数据配置页面
var configure = new Vue({
    el : "#config",
    data : {
        courses :localData.courses,
        items : localData.students,
        addName : '',
        addRfid : '',
        studentsAll : true
    },
    methods : {
        storeStorage : function () {
            localData.students = home.students = configure.items;
            localData.courses = home.courses = configure.courses;
            localData.set_connect = connect.set_connect;
            localStorage.punch = JSON.stringify(localData);
            console.log("本地缓存保存成功："+localStorage.punch);
        },
        getLocalStorage : function () {
            if(localStorage.punch){
                localData = JSON.parse(localStorage.punch);
                console.log("读取缓存："+JSON.stringify(localData));
                home.courses = configure.courses = localData.courses;
                home.students = configure.items = localData.students;
                if(localData.set_connect)
                connect.set_connect = localData.set_connect;
            }else{
                console.log("暂无缓存");
            }
        },
        courseSave : function (event) {
            if(event.target.tagName=="A"){
                var index1 = event.target.parentNode.parentNode.getAttribute("data-index");
                var index2 = event.target.getAttribute("data-index");
                localData.courses[index1].course[index2].name = event.target.innerText;
                // 更新首页当天课程及当前课程
                home.getCurCourseInt = true;
                home.getTodayCouse();
                this.storeStorage();
            }
        },
        checkName : function(n){
            var bool = true;
            if(n==""){
                bool = false;
                message_show("姓名不得为空！");
            }
            return bool;
        },
        checkRFID : function (n) {
            var bool = true;
            if(n=="") {
                bool = false;
                message_show("卡号不得为空！");
            }else if(n.length>10){
                bool = false;
                message_show("卡号位数受限！");
            }
            return bool;
        },
        addNew : function () {
            if(this.checkName(this.addName)&& this.checkRFID(this.addRfid)){
                $("#addStuModal").modal("hide");
                var obj = {
                    message : this.addName,
                    rfid : this.addRfid,
                    call:false,
                    hiscall:false
                };
                if(!this.items)
                    this.items = [];
                this.items.push(obj);
                this.addName = '';
                this.addRfid = '';
                message_show("新增成功！");
                this.storeStorage();
                // 学生数超过14后不可继续添加新学生
                if(this.items.length>14){
                    this.studentsAll = false;
                }
            }
        },
        delNew : function (event) {
            if(event.target.tagName == "I"){
                this.items.splice(event.target.title, 1);
                message_show("删除成功！");
                this.storeStorage();
                if(this.items.length<15){
                    this.studentsAll = true;
                }
            }
        }
    }
})

//自动拍照下载函数
function download(src) {
    var $a = document.createElement('a');
    var  date = new Date();
    $a.setAttribute("href", src);
    $a.setAttribute("download", "自动拍照-"+date);
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    $a.dispatchEvent(evObj);
};

//连接设置页面
var connect = new Vue({
    el : '#set',
    data :{
        set_connect : {},   
        connect_btn : "连接"
    },
    methods : {
        get_connect : function () {

        },
        store_camera : function () {
            configure.storeStorage();
            message_show("保存成功！");
        }
    }
})

//历史数据模态框
var hiscourse = new Vue({
    el : '#courseModal',
    data : {
        students : [],
        his_mes : "",
        his_date : "",
        his_course : "",
        his_index : "",
        his_time : ""
    },
    methods : {

    }
})

function storeCamera(idd){
    var id = idd.split("_")[0];
    localData[id+'_camera_addr'] = $("#"+id+"_camera_addr").val();
    localData[id+'_camera_type'] = $("#"+id+"_camera_type").val();
    localData[id+'_camera_user'] = $("#"+id+"_camera_user").val();
    localData[id+'_camera_pw'] = $("#"+id+"_camera_pw").val();
    localStorage.punch = JSON.stringify(localData);
    message_show("摄像头配置成功！")
}

function get_localStorage(){
    if(localStorage.punch){
        localData = JSON.parse(localStorage.punch);
    }
}

var page = {
    loadFirstPage : function () {
        if(location.href.substr(location.href.length-4,4)=="html"){
            location.href +="#/home";
        }
    },
    clearLocalStorage : function () {
        localStorage.removeItem("punch");
        localStorage.punch = "";
        alert("localStorage已清除！");
        window.location.reload();
    }
}

function speakText(str){
    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
    var n = new Audio(url);
    n.src = url;
    n.play();
    n.onended = function() {
        if(home.calling)
            home.endCall();
    };
}

configure.getLocalStorage();

home.getTime();

home.getTodayCouse();

setInterval('home.getTime()', 1000);

// 元素
var eleForm = document.querySelector('#form');
var eleTbody = document.querySelector('#test tbody');
var eleStatus = document.getElementById('status');
// 模板字符内容
var strTplList = document.getElementById('tplList').innerHTML;

// 简易模板方法
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        return obj[matchs.replace(/\$/g, "")] || '';
    });
};

//打开数据库
function open_database(){
//如果数据库打开失败
    DBOpenRequest.onerror = function(event) {
        logError('数据库打开失败');
    };

    DBOpenRequest.onsuccess = function(event) {
        // 存储数据结果
        db = DBOpenRequest.result;
        // 显示数据
        console.log("读取数据库成功");
        method.show();
    };

// 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
    DBOpenRequest.onupgradeneeded = function(event) {

        var db = event.target.result;

        db.onerror = function(event) {
            logError('数据库打开失败');
        };

        // 创建一个数据库存储对象
        var objectStore = db.createObjectStore(dbName, {
            keyPath: 'id',
            autoIncrement: true
        });
        // 定义存储对象的数据项
        objectStore.createIndex('id', 'id', {
            unique: true
        });
        objectStore.createIndex('name', 'name');
        objectStore.createIndex('index', 'index');
        objectStore.createIndex('date', 'date');
        objectStore.createIndex('people', 'people');
        objectStore.createIndex('sign', 'sign');
        objectStore.createIndex('absent', 'absent');
    };
}

function getWeek (dateObject){
    return "日一二三四五六".charAt( (dateObject.getDay()) > 7 ? (dateObject.getDay())-8 : (dateObject.getDay()));
}

// 获取xx月xx日 的日期格式
function getDateString (dateObject,week){
    return (dateObject.getMonth()+1)+"月"+(dateObject.getDate())+"号 <br /> 星期"+week;
}

// 获取xxxx-xx-xx 的日期格式，注入表格第一行th的data属性备查
function getDateData (dateObject){
    return (dateObject.getFullYear()+"-"+((dateObject.getMonth()+1)>9 ? (dateObject.getMonth()+1) : "0"+(dateObject.getMonth()+1) )+"-"+((dateObject.getDate())>9 ? (dateObject.getDate()) : ("0"+(dateObject.getDate()))));
}

//日期 to table
function date2table(dateStr){
    var arr = dateStr.split("-");
    var nyear = arr[0],
        nmonth = parseInt(arr[1]),
        nday = parseInt(arr[2]);
    // 每次进入循环时，都需要重置myDate、curDate，以保证正常执行第四条语句：myDate.setDate(curDate + (i - 1))
    for(var i=1;i<8;i++){
        var myDate = new Date();
        myDate.setFullYear(nyear,nmonth-1,nday);
        myDate.setDate(myDate.getDate() + (i - 1));
        var dateString = getDateString(myDate,getWeek(myDate));
        var dateData = getDateData(myDate);
        $("#histable").find("th:eq("+i+")").html(dateString).data("date",dateData);
    }
    //getTableJson();
    method.date2data();
}


$(function() {
    open_database();

    // 编辑事件
    eleTbody.addEventListener('focusout', function (event) {
        var eleTd = event.target;
        // 获取id，也就是获得主键
        var id = eleTd && eleTd.getAttribute('data-id'); // &&1真2（第一个为真，则取第二个），||1假2（第一个为假，则取第二个）
        if (!id || !/TD/.test(eleTd.tagName)) { return; }
        id = parseInt(id); //添加时默认id为数值型，此时编辑的id应该也为数值型
        // 这是要替换的数据
        var data = {
            id: id
        };
        // 获得现在的数据
        [].slice.call(eleTd.parentElement.querySelectorAll('td[data-key]')).forEach(function (td) {
            var key = td.getAttribute('data-key');
            var value = td.innerText || td.textContent || '';
            if(key=="id") value = parseInt(value);
            data[key] = value;
        });

        // 更新本地数据库
        method.edit(id, data);
    });

    // 删除事件
    eleTbody.addEventListener('click', function (event) {
        var eleBtn = event.target, id = '';
        if (eleBtn && eleBtn.classList.contains('jsListDel') && (id = eleBtn.getAttribute('data-id'))) {
            method.del(id * 1);
            event.preventDefault();
        }
    });

    //路由相关
    function hom(){}

    function allroutes(){
        // 获取当前url字符串中#/符号后面字符串
        var pageId = window.location.hash.slice(2);
        var pageid1 = pageId, pageid2;
        if(pageId.indexOf("/")>-1){
            var arr = pageId.split("/");
            pageid1 = arr[0];
            pageid2 = arr[1];
            $(".page-tab").hide().filter("#"+pageid2).show();
            $("#"+pageid2+"Li").addClass("active").siblings("li").removeClass("active");
            $("#setLi a").attr("href", "#/"+pageId);
        }
        // 保存本地localStorage
        localStorage.SmartCupHref = pageId;
        // 隐藏所有右侧content，并显示当前content
        $(".panel").hide().filter("#"+pageid1).show();
        $("#"+pageid1+"Li").addClass("current").siblings("li").removeClass("current");
    }

    var routes = {
        '/home': hom,
        '/record': hom,
        '/config': hom,
        '/set': hom,
        '/set/idSet': hom,
        '/set/macSet': hom,
        '/set/cameraSet': hom,
        '/set/version': hom,
    };
    var router = Router(routes);
    router.configure({
            on: allroutes
    });
    router.init();

    page.loadFirstPage();

    //$("#myday").val("2017-07-07");    // 初始化日期插件：计划课程下
    record.querydate = '2017-01-01';
    $('#myday').datepicker({
        format: 'yyyy-mm-dd',
        //startDate: '-30d',
        //endDate: '+30d',
        autoclose: true
    }).on('changeDate',function(){
        date2table($("#myday").val());
    });

    // 获取本地存储
    get_localStorage();

    //考勤详情modal展开
    $("#courseModal").on("show.bs.modal", function (event) {
        var $dom = $(event.relatedTarget);
        var sign = $dom.data("sign");
        var absent = $dom.data("absent");
        hiscourse.his_date = $dom.data("date");
        hiscourse.his_index = $dom.data("index");
        hiscourse.his_time = home.period[parseInt($dom.data("index"))-1];
        hiscourse.his_course = $dom.data("name");
        var peopleArr = $dom.data("people").split("/");
        var signNum = peopleArr[0];
        var peopleNum = peopleArr[1];
        var absentNum = peopleArr[1]-peopleArr[0];
        hiscourse.his_mes = "已到"+signNum+"人，未到"+absentNum+"人，应到"+peopleNum+"人";
        // 生成临时的学生列表
        var allStudent = sign+" "+absent;
        var allArr = allStudent.split(" ");
        hiscourse.students = [];
        for(var i=0;i<allArr.length;i++){
            var obj;
            if(allArr[i]){
                obj = {
                    message : allArr[i],
                    hiscall : false
                }
                hiscourse.students.push(obj);
            }
        }
        if(sign.indexOf(" ")>0){
            var signArr = sign.split(" ");
            for(var i=0;i<hiscourse.students.length;i++){
                if($.inArray(hiscourse.students[i].message, signArr)>-1){
                    hiscourse.students[i].hiscall = true;
                }
            }
        }else{
            for(var i=0;i<hiscourse.students.length;i++){
                if(hiscourse.students[i].message==sign){
                    hiscourse.students[i].hiscall = true;
                }
            }
        }
    })

});

//消息弹出框
var message_timer = null;
function message_show(t) {
    if (message_timer) {
        clearTimeout(message_timer);
    }
    message_timer = setTimeout(function () {
        $("#toast").removeClass("toast_show")
    }, 1500);
    $("#toast_txt").text(t);
    $("#toast").addClass("toast_show");
}
// Android退出确认
function getback(){
    $("#backModal").modal("show");
}
function confirm_back(){
    window.droid.confirmBack();
}
function clearLocalStorage() {
    localStorage.removeItem("punch");
    localStorage.punch = "";
    alert("localStorage已清除！");
    window.location.reload();
}

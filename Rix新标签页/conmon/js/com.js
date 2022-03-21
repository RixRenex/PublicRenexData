var select_bool = false;
var focus_bool = false;
var content = null;
var serach_data = "https://cn.bing.com/search?q=";
var numScle = null;// 记录放大倍数
var BackgroundColor_data, Serach_engine;

$("#background_img")[0].onload = function () {
    
    // 获得放大倍数
    var strArr = $("#background_img").attr("style").split(";")
    for (var i = 0; i < strArr.length; i++) {
        if (strArr[i].search("scale") == 12) {
            var start = strArr[i].indexOf("(")
            var end = strArr[i].indexOf(")")
            numScle = strArr[i].slice((start + 1), end).split(", ")
        }
    }

    if ($("#background_img")[0].offsetWidth < 1542) {
        if (  ((parseFloat(numScle[0]) + 0.2) > 1.4) & ((parseFloat(numScle[1]) + 0.2) > 1.4)  ) {
            return
        }
        numScle[0] = (parseFloat(numScle[0]) + 0.2)
        numScle[1] = (parseFloat(numScle[1]) + 0.2)
        $("#background_img").css({
            "transform": "scale("+numScle[0] + ", " + numScle[1]+")",
        })
    }else{
        $("#background_img").css({
            "transform": "scale(" + numScle[0] + ", " + numScle[1] + ")",
        })
    }
}

// 确认html页面完全加载完成时，再进行初始化动画操作
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {

		try{
	
			// 读取在保存在cookie中保存的背景颜色和搜索引擎
			for (var i = 0; i < document.cookie.split(" ").length; i++) {
				var cookie_obj = new Object();
				cookie_obj.key = document.cookie.split(" ")[i].split("=")[0];
				var data;
				if (document.cookie.split(" ")[i].split("=")[1].split(";").length > 1) {
					data = document.cookie.split(" ")[i].split("=")[1].split(";")[0]
				} else {
					data = document.cookie.split(" ")[i].split("=")[1]
				}
				cookie_obj.value = data;
				if (cookie_obj.key.search("BackgroundColor_data") == 0) {
					BackgroundColor_data = cookie_obj.value
				} else if (cookie_obj.key.search("Serach_engine") == 0) {
					Serach_engine = cookie_obj.value
				}
			}
			
			// 判断背景颜色是否是图片
			 if (BackgroundColor_data.search("#") == 0) {
				 // 保存的为背景颜色
				 $(".img_div").css("background-color", BackgroundColor_data);
				 $(".img_div>img").attr("src", "");
			 } else if (BackgroundColor_data.search("/Imges/background/") == 0) {
				 // 保存的为背景图片
				 $("#background_img").attr("src", BackgroundColor_data);
			 }
		}catch{
			$(".img_div").css("background-color", "black");
			$(".img_div>img").attr("src", "");
		}
        

         

        setTimeout(() => {
            
            /* 初始化页面元素*/
            modity_engine(Serach_engine);
            $("#mainInput").val("")
            setTimeout(() => {
                $("#serachInput").css({
                    "width": "100%",
                    "opacity": 1,
                })
                $(document).scrollTop(-150);
                $(document).scrollLeft(-10);
            }, 150);
            setTimeout(() => {
                $("#serachInput").css({
                    "overflow": "visible",
                })
            }, 1150);
    
            setTimeout(() => {
                $("#black_ground").css({
                    "opacity": 0,
                    "visibility": "hidden",
                })
            }, 1200);
            $("#black_ground>div:nth-child(1)").css({
                "top":"-50vh"
            })
            $("#black_ground>div:nth-child(2)").css({
                "top": "100vh"
            })
            /* 初始化页面元素*/

        }, 0);
    }
}

/* 焦点聚焦 */
$("#serachInput").focusin(function () {
	
	
    if (focus_bool == false) {
        focus_bool = true
        $(".tilte_text").addClass("hide");
        $("#serachInput").css({
            "transform": "scale(1.05) translateY(180px)",
            "background-color": "rgba(255, 255, 255, 1)",
        })
        $("#mainInput").attr("placeholder", "");
		try{
			$("#background_img").css({
				"transform": "scale(" + (parseFloat(numScle[0]) + 0.2) + ", " + (parseFloat(numScle[1]) + 0.2) + ")",
				"filter": "blur(8px)",
			})
		}catch{
			console.log("没有值.")
		}
        $("#selectArea").css({
            "background-color": "rgb(78, 78, 78)",
        })
        $("#setting_icon").addClass("hide")
        $("#setting_View").css({
            "transform": "translate(500px, -500px)"
        })
    }
})
/*焦点移除*/
$(document).click(function (e) {
    if (focus_bool) {
        if ($(e.target).attr("id") == "background_img" || $(e.target).hasClass("img_div")) {
            focus_bool = false
            $(".tilte_text").removeClass("hide");
            $("#serachInput").css({
                "transform": "scale(1.0) translateY(-0px)",
                "background-color": "rgba(255, 255, 255, .3)",
            })
            $("#mainInput").attr("placeholder", "Serach........");

			try{
				$("#background_img").css({
					"transform": "scale(" + parseFloat(numScle[0]) + ", " + parseFloat(numScle[1]) + ")",
					"filter": "blur(0px)",
				})
			}catch{
				console.log("没有值.")
			}
			
            $("#selectArea").css({
                "background-color": "rgb(48, 48, 48)",
            })
            $("#setting_icon").removeClass("hide");
        }
    }
})

// 更换搜索引擎
$("#selectArea").hover(
    function () {
        move_in();
    },
    function () {
        select_bool = false
        setTimeout(() => {
            if (select_bool == false) {
                select_bool = true
                move_out()
            }
        }, 1000);
    }
)
$(".select_seach").hover(
    function () {
        move_in();
    },
    function () {
        move_out();
    }
)
$(".select_seach").click(function (e) {
    var key = $(e.target).attr("serachdata");
    modity_engine(key);
    $("#mainInput").focus();
})


// 更换引擎筛选封装函数
function modity_engine(key) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + 1);
    switch (key) {
        case "baidu":
            serach_data = "https://www.baidu.com/s?ie=utf-8&word=";
            $("#selectArea").css({
                "background": "rgb(78, 78, 78) url('/Imges/icon/BaiduSerach.png') center center no-repeat",
                "background-size": "16px 16px",
            })
            document.cookie = 'Serach_engine=baidu;expires=' + oDate;
            $("#selectArea").attr("target_icon", "baidu")
            break;
        case "csdn":
            serach_data = "https://so.csdn.net/so/search?q=";
            $("#selectArea").css({
                "background": "rgb(78, 78, 78) url('/Imges/icon/csdn.png') center center no-repeat",
                "background-size": "15px 20px",
            })
            document.cookie = 'Serach_engine=csdn;expires=' + oDate;
            $("#selectArea").attr("target_icon", "csdn")
            break;
        case "bilibili":
            serach_data = "https://search.bilibili.com/all?keyword=";
            $("#selectArea").css({
                "background": "rgb(78, 78, 78) url('/Imges/icon/bilibili.png') center center no-repeat",
                "background-size": "30px 18px",
            })
            document.cookie = 'Serach_engine=bilibili;expires=' + oDate;
            $("#selectArea").attr("target_icon", "bilibili");
            break;
        case "bing":
            serach_data = "https://cn.bing.com/search?q=";
            $("#selectArea").css({
                "background": "rgb(78, 78, 78) url('/Imges/icon/BingSerach.png') center center no-repeat",
                "background-size": "15px 20px",
            })
            document.cookie = 'Serach_engine=bing;expires=' + oDate;
            $("#selectArea").attr("target_icon", "bing")
            break;
        case "custom":

            break;
        default:
            break;
    }
}

function move_in() {
    if (select_bool == false) {
        select_bool = true
        $(".select_seach").css({
            "opacity": 1,
            "visibility": "visible",
        })
        setTimeout(() => {
            $(".select_seach").css({
                "padding": "6px",
                "width": "170px",
            })
            $(".select_seach>span").css({
                "opacity": 1,
            })
        }, 300);
    }
}

function move_out() {
    if (select_bool == true) {
        select_bool = false
        $(".select_seach").css({
            "width": "0px",
            "padding": 0,
        })
        $(".select_seach>span").css({
            "opacity": 0,
        })
        setTimeout(() => {
            $(".select_seach").css({
                "opacity": 0,
                "visibility": "hidden",
            })
        }, 300);
    }
}

function serach_com() {
    content = $("#mainInput").val();
    if (content != "") {
        content = SpecialCharacters(content)
        if ($("#selectArea").attr("target_icon") == "bilibili") {
            window.location.href = "https://search.bilibili.com/all?keyword=" + content + "&from_source=web_search";
            return;
        }
        window.location.href = serach_data + content;
    }
}

$("#div_button").click(function () {
    serach_com()
});

document.addEventListener("keyup", keyboard)

function keyboard(e) {
    if (e.key == "Enter") {
        serach_com();
    }
}
// 设置按钮点击
$("#setting_icon").click(function () {
    $("#setting_icon").addClass("hide")
    $("#setting_View").css({
        "transform": "translate(0px, 0px)"
    })
})
$("#setting_View input").click(function () {
    var ele = $("#setting_View #pure_color[type='radio']").is(':checked')
    if (ele) {
        // 选择了纯色背景
        $("#pure_color~.color_list").addClass("show");
    } else {
        // 选择了自定义背景
        $("#pure_color~.color_list").removeClass("show");
        $("#clickBack").click();


    }
})
// 关闭设置页面
$(".setting_view_close>span").click(function () {
    $("#setting_icon").removeClass("hide")
    $("#setting_View").css({
        "transform": "translate(500px, -500px)"
    })
})

// 自定义纯色背景
$("#setting_View #pure_color~.color_list").click(function (e) {
    var color = $(e.target).attr("style").split(":")[1];
    $(".img_div").css("background-color", color);
    $(".img_div>img").attr("src", "");

    // 将获取的颜色存入Cookie中
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + 30);
    document.cookie = 'BackgroundColor_data=' + color + ';expires=' + oDate;
})

$("#files_background").change(function () {
    // 获得文件地址
    var files = $("#files_background")[0].files[0]
    var path = "/Imges/background/" + files.name;
    // 设置img标签的src属性
    $("#background_img").attr("src", path); // 已知该路径是空值，如何捕捉其 “图片未找到” 异常
    $(".img_div").css("background-color", "black");
    // 将获取的颜色存入Cookie中
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + 30);
    document.cookie = 'BackgroundColor_data=' + path + ';expires=' + oDate;
    $("#files_background").val("")
})
//筛查字符串特殊字符
function SpecialCharacters(data) {
    var reg = /[` ~!#$%^&*()_\-+=<>?:\"{}|,.\/;'\\[\]]/ig;
    if (reg.test(data)) {
        for (var i = 0; i < data.match(reg).length; i++) {
            var arr = data.match(reg)
            data = data.replace(data.match(reg)[i], stringToHex(arr[i]));
        }
        return data;
    } else {
        return data;
    }
}

function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {

        if (val == "")
            val = "%" + str.charCodeAt(i).toString(16);
        else
            val += "%" + str.charCodeAt(i).toString(16);
    }
    return val;
}
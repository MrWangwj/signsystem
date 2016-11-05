<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:80:"D:\MyDrivers\htdocs\SignSystem2\public/../application/home\view\index\index.html";i:1478351031;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>三月软件小组签到系统</title>
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>index-index.css">
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.css">
    <!--<link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>base.css">-->
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>jquery-3.0.0.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>bootstrap.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
</head>
<body>
    <div class="background">
        <div class="bg-top">
            <div class="login-shadow">
                <div class="login">
                    <div class="title">
                        <label>三月软件小组签到系统</label>
                    </div>
                    <div class="login-input">
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-2 control-label">用户名：</label>
                            <div class="col-sm-10">
                                <input type="number" class="form-control" id="userID" placeholder="请输入学号">
                            </div>
                        </div>
                        <span id="info_span">提示信息</span>
                    </div>
                    <div class="login-bottom ">
                        <div class="login-but clearfix">
                             <button type="button" class="btn btn-danger" id="up_btn">确定登录</button>
                            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal" id="into_btn">加入我们</button>
                        </div>
                    </div>               
                </div>
                <img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>shadow.png" class="shadow">     
            </div>
                   
        </div>
        <div class="bg-bottom">
            <div class="bg-div">
                
            </div>
            <div class="footer">
                <p>
                    版权所有：<span class="marchsoft">三月软件工作室</span>
                </p>
            </div>
        </div>

    </div>





   <!--  <div class="background">
        <div style="width: 100%;height: 400px;">
            <div class="title">
                <span>三月软件小组签到系统</span>
            </div>
            <div id="login_div">
                <form>
                    <div>
                        <span>用户登陆</span>
                    </div>
                    <div id="input_div">
                        <span id="input_span">请输入学号：</span>
                        <input type="number" class="form-control" id="userID" placeholder="Enter ID">
                        <span id="info_span">提示信息</span>
                        <button type="button" class="btn btn-default" id="up_btn">确定登录</button>
                        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal" id="into_btn">申请加入</button>
                    </div>
                </form>
            </div>
            <div class="footer">
                <span>版权所有：三月软件小组</span>
            </div>
        </div>
    </div>
 -->
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">申请加入签到</h4>
                </div>
                <div class="modal-body" id="body1">
                    <form class="form-horizontal" role="form">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">学号：</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputID" placeholder="Enter ID">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">姓名：</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputName" placeholder="Enter Name">
                            </div>
                        </div>
                        <div class="form-group">
                           <label class="col-sm-2 control-label">性别：</label>
                            <div class="col-sm-9" style="margin-top:3px;">
                                <input name="user_sex" type="radio" id="sex-1"  value="0">
                                <label for="sex-1">男</label>
                                <input name="user_sex" type="radio" id="sex-2"  value="1">
                                <label for="sex-2">女</label></br>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">班级：</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputArea" placeholder="Enter class">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">电话：</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="phone" placeholder="Enter phone">
                            </div>
                        </div>
                        <div class="form-group">
                            <span id="info_span2">提示信息</span>
                        </div>  

                    </form>
                </div>  
                <div class="modal-body" id="body2">
                    <form class="form-horizontal" role="form">
                        <div class="form-group">
                            <span class="label label-success" style="margin-left: 50px">Success</span>
                            <span style="color: red">申请成功，请等待管理员审核~~</span>
                        </div>
                    </form>
                </div>  

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="input_btn">提交</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<script>
    $('.marchsoft').on('click',function(){
        // window.location.href = "//www.marchsoft.cn";
        window.open("//www.marchsoft.cn");    
    });
    $(document).keydown(function (event) {
        if(event.keyCode==13) login();
    });
    //签到登录
    $("#up_btn").click(function () {
        login();
    })

    function login(){
        var userId = $("#userID").val();
        $.post("<?php echo url('index/docheck'); ?>",{'userid':userId},function (data) {
            if(data.code==-1){
                $("#info_span").css("visibility","visible").html(data.msg);
            }else if(data.code==1){
                layer.msg('玩命卖萌中',{
                    time:1000
                }, function(){
                    $("#info_span").css("visibility","hidden");
                    window.location.href="<?php echo url('homepage/index'); ?>";
                });

            }
        })       
    }
    //申请加入
    $("#info_span2").hide();
    $("#body2").hide();
    $("#input_btn").show();
    $("#into_btn").click(function () {
        $("#body1").show();
        $("#body2").hide();
        $("#input_btn").show();
        $("#inputID").val("");
        $("#inputName").val("");
        $("#inputArea").val("");
        $("#phone").val();
    })
    $("#input_btn").click(function () {
        var userid  =  $("#inputID").val();
        var username = $("#inputName").val();
        var note = $("#inputArea").val();
        var phone = $("#phone").val();
        var user_sex = $("input[name ='user_sex']:checked").val();
        var myReg = /^[\u4e00-\u9fa5]+$/;
        if(!(myReg.test($("#inputName").val()) && ($("#inputName").val().length<=4))){

                layer.msg('请使用真实姓名');
                    return;
                }
        if(!($('#inputID').val().length==11 || $('#inputID').val().length==10)) {
                layer.msg('请输入正确的学号');    
                    return;
                }
        if (!($('#phone').val().length==11)) {
                layer.msg('请输入正确的手机号');
                    return;
                }    
        $.post("<?php echo url('index/doLogin'); ?>",{'userid':userid, 'username':username, 'note':note,'phone':phone ,'user_sex':user_sex},function (data) {
            if(data.code==-1){
                    $("#info_span2").show().html(data.msg);
            }else if(data.code==1){
                $("#body1").hide();
                $("#body2").show();
                $("#input_btn").hide();
            }
        })
    })
</script>

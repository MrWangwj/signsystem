<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:74:"/var/www/html/SignSystem2/public/../application/home/view/index/index.html";i:1475914777;s:73:"/var/www/html/SignSystem2/public/../application/home/view/index/base.html";i:1475914777;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>三月签到系统</title>
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.css">
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>base.css">
    
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>index.css">

</head>
<body>
    <header style="background: url('<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>header.gif')">
        <div id="title">
            <div id="logo_div">
                <img src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>Logo.png"  class="img-circle">
            </div>
            <div id="sign_div">
                三月签到系统
            </div>
        </div>
    </header>
    <!--<center>-->
    <div id="inner">
        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">三月</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="<?php echo url('homepage/index'); ?>">首页</a></li>
                        <li><a href="#">课表</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">统计 <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="<?php echo url('Attendance/index'); ?>">个人考勤</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                                <li class="divider"></li>
                                <li><a href="#">One more separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search">
                        </div>
                        <button type="submit" class="btn btn-default">Submit</button>
                    </form>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">Link</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>
    <!--</center>-->
    <div id="content">
        
<div style="width: 100%;height: 400px;">
    <div id="login_div">
        <form method="post" action="index.html">
            <div id="input_div">
                <span id="input_span">请输入学号：</span>
                <input type="email" class="form-control" id="userID" placeholder="Enter ID">
                <span id="info_span">提示信息</span>
                <button type="button" class="btn btn-default" id="up_btn">确定签到</button>
                <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal" id="into_btn">申请加入</button>
            </div>
        </form>
    </div>
</div>

<!--&lt;!&ndash; Button trigger modal &ndash;&gt;-->
<!--<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">-->
    <!--Launch demo modal-->
<!--</button>-->

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
                        <label class="col-sm-2 control-label">备注：</label>
                        <div class="col-sm-10">
                            <textarea  class="form-control" placeholder="Enter Note" id="inputArea"></textarea>
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


    </div>
    <footer style="background: url('<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>header.gif')">
        <div>三月签到系统页脚</div>
    </footer>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>jquery-3.0.0.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>bootstrap.min.js"></script>
    <script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
    
<script>
    //签到登录
    $("#up_btn").click(function () {
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
    })
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
    })
    $("#input_btn").click(function () {
        var userid  =  $("#inputID").val();
        var username = $("#inputName").val();
        var note = $("#inputArea").val();
        $.post("<?php echo url('index/doLogin'); ?>",{'userid':userid, 'username':username, 'note':note},function (data) {
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

</body>
</html>
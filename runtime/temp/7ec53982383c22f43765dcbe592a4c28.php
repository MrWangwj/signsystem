<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:68:"/var/www/html/SignSystem/public/../application/admin/view/index.html";i:1501053469;}*/ ?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp"/>
<title>三月签到后台管理系统</title>
<meta name="keywords" content="">
<meta name="description" content="">

<!--[if lt IE 9]>
<meta http-equiv="refresh" content="0;ie.html"/>
<![endif]-->

<link rel="shortcut icon" href="favicon.ico">
<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.min.css?v=3.3.6" rel="stylesheet">
<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>font-awesome.min.css?v=4.4.0" rel="stylesheet">
<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>animate.min.css" rel="stylesheet">
<link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
</head>

<body class="fixed-sidebar full-height-layout gray-bg" style="overflow:hidden">
<div id="wrapper">
    <!--左侧导航开始-->
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="nav-close"><i class="fa fa-times-circle"></i>
        </div>
        <div class="sidebar-collapse">
            <ul class="nav" id="side-menu">
                <li class="nav-header">
                    <div class="dropdown profile-element">
                        <span style="color:#fff;font-size:20px;"><img alt="image" class="img-circle" src="<?php echo \think\Config::get('parse_str.__IMAGE__'); ?>profile_small.jpg"/><?php echo $admin['name']; ?></span>
                        <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                            <span class="clear">
                                <span class="block m-t-xs"><strong class="font-bold"></strong></span>
                                <span class="text-muted text-xs block"><b class="caret"></b></span>
                            </span>
                        </a>
                        <ul class="dropdown-menu animated fadeInRight m-t-xs">
                            <li>
                                <a href="<?php echo url('admin/login/loginOut'); ?>">安全退出</a>
                            </li>
                        </ul>
                    </div>
                </li>
               <!--  <li class="menu">
                    <a href="<?php echo url('admin/index/index'); ?>">
                        <i class=""></i>
                        <span class="nav-label">后台首页</span>
                        <span class="fa arrow"></span>
                    </a>
                </li> -->

                <li class="menu">
                    <a href="">
                        <i class=""></i>
                        <span class="nav-label">签到管理</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/sign/log'); ?>">签到日志管理</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/statistics/index'); ?>">本周考勤排行榜</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/sign/index'); ?>">补签审批</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/sign/online'); ?>">在线情况</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/sign/count'); ?>">考勤情况</a>
                        </li>
                    </ul>
                </li>

                <li class="menu">
                    <a href="">
                        <i class=""></i>
                        <span class="nav-label">课程管理</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('Schedule/clear'); ?>">清除冗余课程 </a>
                        </li>
                    </ul>
                </li>

                <li class="menu">
                    <a href="">
                        <i class=""></i>
                        <span class="nav-label">人员管理</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/user/useradd'); ?>">审批信息</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/user/member'); ?>">人员信息</a>
                        </li>
                    </ul>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/Group/group'); ?>">分组信息</a>
                        </li>
                    </ul>
                     <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" href="<?php echo url('admin/Manager/notice'); ?>">发布公告</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
    <!--左侧导航结束-->
    <!--右侧部分开始-->
    <div id="page-wrapper" class="gray-bg dashbard-1">
        <div class="row border-bottom">
            <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i
                        class="fa fa-bars"></i> </a>
                </div>
                <ul class="nav navbar-top-links navbar-right">
                    <li class="dropdown hidden-xs">
                        <a class="right-sidebar-toggle" aria-expanded="false">
                            <i class="fa fa-tasks"></i> 主题
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="row content-tabs">
            <button class="roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <a href="javascript:;" class="active J_menuTab" data-id="index_v1.html">首页</a>
                </div>
            </nav>
            <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
            </button>
            <div class="btn-group roll-nav roll-right">
                <button class="dropdown J_tabClose" data-toggle="dropdown">常用操作<span class="caret"></span>

                </button>
                <ul role="menu" class="dropdown-menu dropdown-menu-right">
                    <li class="J_tabGo"><a>前进</a>
                    </li>
                    <li class="J_tabBack"><a>后退</a>
                    </li>
                    <li class="J_tabFresh"><a>刷新</a>
                    </li>
                    <li class="divider"></li>
                    <li class="J_tabShowActive"><a>定位当前选项卡</a>
                    </li>
                    <li class="divider"></li>
                    <li class="J_tabCloseAll"><a>关闭全部选项卡</a>
                    </li>
                    <li class="J_tabCloseOther"><a>关闭其他选项卡</a>
                    </li>
                </ul>
            </div>
            <a href="<?php echo url('admin/login/loginOut'); ?>" class="roll-nav roll-right J_tabExit"><i class="fa fa fa-sign-out"></i>
                退出</a>
        </div>
        <div class="row J_mainContent" id="content-main">
            <iframe class="J_iframe" name="iframe0" width="100%" height="100%"
                    src="<?php echo url('Index/indexPage'); ?>" frameborder="0"
                    data-id="index_v1.html" seamless></iframe>
        </div>
        <div class="footer">
            <div class="pull-right">&copy; 2016-2017
            </div>
        </div>
    </div>
    <!--右侧部分结束-->
    <!--右侧边栏开始-->
    <div id="right-sidebar">
        <div class="sidebar-container">
            <ul class="nav nav-tabs navs-3">
                <li class="active">
                    <a data-toggle="tab" href="#tab-1">
                        <i class="fa fa-gear"></i> 主题
                    </a>
                </li>
            </ul>
            <div class="tab-content">
                <div id="tab-1" class="tab-pane active">
                    <div class="sidebar-title">
                        <h3> <i class="fa fa-comments-o"></i> 主题设置</h3>
                        <small><i class="fa fa-tim"></i> 你可以从这里选择和预览主题的布局和样式，这些设置会被保存在本地，下次打开的时候会直接应用这些设置。</small>
                    </div>
                    <div class="skin-setttings">
                        <div class="title">主题设置</div>
                        <div class="setings-item">
                            <span>收起左侧菜单</span>
                            <div class="switch">
                                <div class="onoffswitch">
                                    <input type="checkbox" name="collapsemenu" class="onoffswitch-checkbox" id="collapsemenu">
                                    <label class="onoffswitch-label" for="collapsemenu">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="setings-item">
                            <span>固定顶部</span>

                            <div class="switch">
                                <div class="onoffswitch">
                                    <input type="checkbox" name="fixednavbar" class="onoffswitch-checkbox" id="fixednavbar">
                                    <label class="onoffswitch-label" for="fixednavbar">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="setings-item">
                                <span>
                        固定宽度
                    </span>

                            <div class="switch">
                                <div class="onoffswitch">
                                    <input type="checkbox" name="boxedlayout" class="onoffswitch-checkbox" id="boxedlayout">
                                    <label class="onoffswitch-label" for="boxedlayout">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="title">皮肤选择</div>
                        <div class="setings-item default-skin nb">
                                <span class="skin-name ">
                         <a href="#" class="s-skin-0">
                             默认皮肤
                         </a>
                    </span>
                        </div>
                        <div class="setings-item blue-skin nb">
                                <span class="skin-name ">
                        <a href="#" class="s-skin-1">
                            蓝色主题
                        </a>
                    </span>
                        </div>
                        <div class="setings-item yellow-skin nb">
                                <span class="skin-name ">
                        <a href="#" class="s-skin-3">
                            黄色/紫色主题
                        </a>
                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--右侧边栏结束-->
    <!--mini聊天窗口开始-->
</div>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>jquery.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>bootstrap.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/slimscroll/jquery.slimscroll.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/layer/layer.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>hplus.min.js"></script>
<!--<script type="text/javascript" src="__JS__/contabs.min.js"></script>-->
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>contabs.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/pace/pace.min.js"></script>
</body>

</html>

<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:74:"/var/www/html/SignSystem2/public/../application/admin/view/sign/index.html";i:1476347676;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>角色列表</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>font-awesome.min.css?v=4.4.0" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>animate.min.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>plugins/sweetalert/sweetalert.css" rel="stylesheet">
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <!-- Panel Other -->
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>补签审批</h5>
        </div>
        <div class="ibox-content">
            <!--&lt;!&ndash;搜索框开始&ndash;&gt;-->
            <!--<form id='commentForm' role="form" method="post" class="form-inline">-->
                <!--<div class="content clearfix m-b">-->
                    <!--<div class="form-group">-->
                        <!--<input type="text" class="form-control" id="rolename" name="rolename">-->
                    <!--</div>-->
                    <!--<div class="form-group">-->
                        <!--<button class="btn btn-primary" type="button" style="margin-top:5px" id="search"><strong>搜 索</strong>-->
                        <!--</button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</form>-->
            <!--&lt;!&ndash;搜索框结束&ndash;&gt;-->
            <div class="hr-line-dashed"></div>

            <div class="example-wrap">
                <div class="example">
                    <table id="table">
                    </table>
                </div>
            </div>

            <!-- End Example Pagination -->
        </div>
    </div>
</div>
<!-- End Panel Other -->
</div>

<script type="text/javascript">
    zNodes = '';
</script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>jquery.min.js?v=2.1.4"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>bootstrap.min.js?v=3.3.6"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>content.min.js?v=1.0.0"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/bootstrap-table/bootstrap-table-mobile.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/suggest/bootstrap-suggest.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/layer/laydate/laydate.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/sweetalert/sweetalert.min.js"></script>
<script src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/layer/layer.min.js"></script>
<link rel="stylesheet" href="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/zTree/zTreeStyle.css" type="text/css">
<script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/zTree/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/zTree/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript" src="<?php echo \think\Config::get('parse_str.__JS__'); ?>plugins/zTree/jquery.ztree.exedit-3.5.js"></script>
<script>
    var table = $('#table');

    function initTable() {
        //先销毁表格
        table.bootstrapTable('destroy');
        table.bootstrapTable({
            search:"true",
            showtoggle:'true',
            showRefresh:"true",
            toolbar:"true",
            method: "post",  //使用get请求到服务器获取数据
            url: "<?php echo url('admin/sign/attendance_check'); ?>", //获取数据的地址
            striped: true,  //表格显示条纹
            pagination: true, //启动分页
            pageSize: 10,  //每页显示的记录数
            pageNumber:1, //当前第几页
            pageList: [5, 10, 15, 20, 25],  //记录数可选列表

            onLoadSuccess: function(){  //加载成功时执行
//                layer.msg("加载成功", {time : 1000});
                $(".up").click(function () {
                    var id =  $(this).parents().find('td').eq(0).html();
                    var userid = $(this).parents().find('td').eq(2).html();
                    var starTime = $(this).parents().find('td').eq(3).html();
                    var overTime = $(this).parents().find('td').eq(4).html();
                    $.post("<?php echo url('admin/sign/check_sign'); ?>",{"id":id,"userid":userid,"starTime":starTime,"overTime":overTime},function (data) {

                        if(data.code==1){
                            initTable();
                            layer.msg(data.msg, {time : 1500});
                        }

                    })
                })
                $(".reject").click(function () {
                    var id =  $(this).parents().find('td').eq(0).html();
                    $.post("<?php echo url('admin/sign/reject_sign'); ?>",{"id":id},function (data) {
                        if(data.code==1){
                            initTable();
                            layer.msg(data.msg, {time : 1500});
                        }
                    })
                })
            },
            onLoadError: function(){  //加载失败时执行
                layer.msg("加载数据失败");
            },columns: [{
                field: 'id',
                title: '用户id'
            },{
                field: 'name',
                title: '用户名称'
            }, {
                field: 'user_id',
                title: '学号'
            }, {
                field: 'star',
                title: '补签开始时间'
            }, {
                field: 'over',
                title: '补签结束时间'
            }, {
                field: 'now',
                title: '申请补签时间'
            }, {
                field: 'style',
                title: '操作'
            }],
        });
    }

    $(function () {
        initTable();
    })


</script>
</body>
</html>

<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:79:"/var/www/html/SignSystem/public/../application/admin/view/statistics/index.html";i:1501053470;}*/ ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在线情况</title>
    <link rel="shortcut icon" href="favicon.ico">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>bootstrap.min.css?v=3.3.6" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>font-awesome.min.css?v=4.4.0" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>animate.min.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>style.min.css?v=4.1.0" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>sign-online.css" rel="stylesheet">
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>考勤排行榜</h5>
        </div>
        <div class="ibox-content">
            <table class="table table-striped" id="table">
               <tr>
                   <th>排名</th>
                   <th>组别</th>
                   <th>成员</th>
                   <th>学号</th>
                   <th>在线时长(分钟)</th>
               </tr>
            </table>
        </div>
    </div>
</div>

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

    $(function () {
        $.post("<?php echo url('admin/statistics/getAllTime'); ?>",function (data) {
            var table = $("#table");
            for(var i =0;i<data.length;i++) {
                table.append(
                        "<tr> " +
                        "<td>" + (i+1) +"</td> " +
                        "<td>" + data[i]['group_name'] + "</td> " +
                        "<td>" + data[i]['name'] + "</td>" +
                        "<td>" + data[i]['user_id'] + "</td>" +
                        "<td>" + Math.round(data[i]['times']/60) + "</td>" +
                        "</tr>")
            }

            $.post("<?php echo url('admin/statistics/getNo'); ?>",function (data) {
                var table = $("#table");
                if(data.length==0) return;
                for(var j =0;j<data.count;j++) {
                    table.append(
                            "<tr> " +
                            "<td>" + "--" +"</td> " +
                            "<td>" + data.list[j]['group_name'] + "</td> " +
                            "<td>" + data.list[j]['name'] + "</td>" +
                            "<td>" + data.list[j]['user_id'] + "</td>" +
                            "<td>" + data.list[j]['time'] + "</td>" +
                            "</tr>")
                }
            })
        })

    })

</script>
</body>
</html>
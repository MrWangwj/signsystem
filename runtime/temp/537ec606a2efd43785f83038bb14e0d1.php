<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:75:"/var/www/html/SignSystem2/public/../application/admin/view/sign/online.html";i:1476528217;}*/ ?>
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
            <h5>在线情况<?php echo $count; ?></h5>
        </div>
        <div class="ibox-content">
            <div class="main">
                <div class='title'>
                    <form class="form-inline" action="<?php echo url('Sign/online'); ?>" method="get" id="date-form">
                        <label>时间：</label>
                        <input type="date" class="form-control" name="date" id="date">
                        <select class="form-control" id="hour" name="hour">
                           
                        </select>
                        <label>时</label>
                        <select class="form-control" id="minute" name="minute">
                
                        </select>
                        <label>分</label>
                        <select class="form-control" id="second" name="second">
                            
                        </select>
                        <label>秒</label>
                        <label>当前在线人数：8 缺勤人数：4</label>
                    </form>
                </div>
                <div class="sign-table">
                    <table class="table table-bordered table-condensed">
                        <tr>
                            <th>组别</th>
                            <th>在线</th>
                            <th>缺勤</th>
                        </tr>
                        <tr>
                            <td>开发一组</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>开发一组</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>开发一组</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    </table>
                </div>
            </div>
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
    $('#hour').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#minute').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#second').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#date').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#hour').html(getdateoption(0, 23));
    $('#minute').html(getdateoption(0, 59));
    $('#second').html(getdateoption(0, 59));
    $('#date').val('2018-01-01');

    function getdateoption(start, end){
        var text = "";
        for (var i = start; i <= end; i++) {
            text += "<option value='"+i+"'>"+i+"</option>";
        }
        return text;
    }


</script>
</body>
</html>

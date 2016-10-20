<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:78:"/var/www/html/SignSystem2/public/../application/admin/view/schedule/clear.html";i:1476682638;}*/ ?>
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
    <!-- <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>schedule-clear.css" rel="stylesheet"> -->
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>清除冗余课程</h5>
        </div>
        <div class="ibox-content">
            <div class="main">
                <table class="table table-bordered table-condensed">
                    <tr>
                        <th><input type="checkbox" value='0' id="all">全选</th>
                        <th>课程名</th>
                        <th>老师</th>
                        <th>教师</th>
                        <th>周数</th>
                        <th>节数</th>
                        <th>上课时间</th>
                    </tr> 
                    <form action="<?php echo url('Schedule/delete'); ?>" method="post" id="curriculums">
                        <?php if(is_array($noncurriculum) || $noncurriculum instanceof \think\Collection): $i = 0; $__LIST__ = $noncurriculum;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                            <tr>
                                <th><input class="curriculum" type="checkbox" name="curriculum[]" value="<?php echo $vo['id']; ?>"></th>
                                <th><?php echo $vo['name']; ?></th>
                                <th><?php echo $vo['teacher']; ?></th>
                                <th><?php echo $vo['classroom']; ?></th>
                                <th><?php echo $vo['week']; ?></th>
                                <th><?php echo $vo['section']; ?></th>
                                <th><?php echo $vo['weeks_number']; ?></th>
                            </tr>  
                        <?php endforeach; endif; else: echo "" ;endif; ?>
                    </form>
                </table>
                <button type="button" class="btn btn-warning" id="del">删除</button>
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
<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/layer/layer.js"></script>
<script>
$('#del').on('click', function(event) {
    var curriculums = new Array;
    $('input:checked').each(function(index, el) {
         curriculums[index] = $(this).val();
    });
    if(curriculums.length >0){
        $.post(
            '<?php echo url("Schedule/delete"); ?>', 
            {
                curriculums: curriculums,
            }, 
            function(data, textStatus, xhr) {
                var icon = 2;
                if(data.code){
                    icon = 1;
                }
                layer.msg(data.msg, {icon: icon}, function(){
                    window.location.reload();
                });                     
            }
        );
    }else{
        alert('未选中数据');
    }
}); 

$('#all').on('change', function(event) {
    if($(this).is(':checked')){
        $('.curriculum').each(function(index, el) {
            $(this).prop("checked",true);
            
        });
    }else{
     
        $('.curriculum').each(function(index, el) {
            $(this).prop("checked",false);
        });
    }
});


</script>
</body>
</html>

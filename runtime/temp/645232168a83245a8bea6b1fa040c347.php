<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:73:"/var/www/html/SignSystem/public/../application/admin/view/sign/count.html";i:1501053470;}*/ ?>
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
    <link href="<?php echo \think\Config::get('parse_str.__CSS__'); ?>sign-count.css" rel="stylesheet">
    <style type="text/css">
        .extend{
            display: block !important;
        }
    </style>
</head>
<body class="gray-bg">
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="ibox float-e-margins">
        <div class="ibox-title">
            <h5>考勤情况</h5>
        </div>
        <div class="ibox-content">
            <div class="main">
                <div class="title" style="overflow: auto;">
                    <form class="form-inline" action="<?php echo url('Sign/count'); ?>" method="get" id="date-form">
                        <label>组别：</label>
                        <select class="form-control" id="group" name="group">
                            <option value="0">全部</option>
                            <?php if(is_array($groups) || $groups instanceof \think\Collection): $i = 0; $__LIST__ = $groups;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                                <option value="<?php echo $vo['group_id']; ?>"><?php echo $vo['group_name']; ?></option>
                            <?php endforeach; endif; else: echo "" ;endif; ?>
                        </select>
                        <label>人员</label>
                        <select class="form-control" id="personnel" name="user">
                            <option value="0">全部</option>
                            <?php if(is_array($users) || $users instanceof \think\Collection): $i = 0; $__LIST__ = $users;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                                <option value="<?php echo $vo['user_id']; ?>"><?php echo $vo['name']; ?></option>
                            <?php endforeach; endif; else: echo "" ;endif; ?>
                        </select>
                        <label>周数</label>
                        <select class="form-control" id="weeks" name="week">
                            <option value='0'>本周</option>
                            <option value='1'>第1周</option>
                            <option value='2'>第2周</option>
                            <option value='3'>第3周</option>
                            <option value='4'>第4周</option>
                            <option value='5'>第5周</option>
                            <option value='6'>第6周</option>
                            <option value='7'>第7周</option>
                            <option value='8'>第8周</option>
                            <option value='9'>第9周</option>
                            <option value='10'>第10周</option>
                            <option value='11'>第11周</option>
                            <option value='12'>第12周</option>
                            <option value='13'>第13周</option>
                            <option value='14'>第14周</option>
                            <option value='15'>第15周</option>
                            <option value='16'>第16周</option>
                            <option value='17'>第17周</option>
                            <option value='18'>第18周</option>
                            <option value='19'>第19周</option>
                            <option value='20'>第20周</option>                           
                        </select> 
                    </form>
                    
                    <div>
                        <?php if(is_array($count) || $count instanceof \think\Collection): $i = 0; $__LIST__ = $count;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                            <div>
                                <div>
                                    <h2><?php echo $vo['user']['name']; ?> 在线<span class="havesigns"><?php echo second2time($vo['user']['signtime']); ?></span> 缺勤<span class="nosigns"><?php echo second2time($vo['user']['nosigntime']); ?></span></h2>
                                </div>
                                <table class="table table-bordered table-condensed">
                                    <tr>
                                        <?php if(is_array($date) || $date instanceof \think\Collection): $i = 0; $__LIST__ = $date;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$datevo): $mod = ($i % 2 );++$i;?>
                                            <th><?php echo $datevo; ?></th>
                                        <?php endforeach; endif; else: echo "" ;endif; ?>
                                    </tr>
                                    <tr class="data2">
                                        <?php if(is_array($vo['data']) || $vo['data'] instanceof \think\Collection): $i = 0; $__LIST__ = $vo['data'];if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$dates): $mod = ($i % 2 );++$i;?>
                                            <td style="">
                                                <p>在线:<span class="havesigndate">0</span>分钟</p>
                                                <p style="color: red">缺勤:<span class="nosigndate">0</span>分钟</p>
                                                <p style="cursor: pointer;" class="detailed">查看详细信息</p>                                            
                                                <div style="display: none;border-top: 1px solid black;">
                                                    <?php if(is_array($dates['online']) || $dates['online'] instanceof \think\Collection): $i = 0; $__LIST__ = $dates['online'];if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$time): $mod = ($i % 2 );++$i;?>
                                                        <p class="havesigntime" data-start="<?php echo $time[0]; ?>" data-end="<?php echo $time[1]; ?>"><?php if($time[0] == 0): ?>0<?php else: ?><?php echo date('H:i:s',$time[0]); ?>~<?php echo date('H:i:s',$time[1]); endif; ?> </p>
                                                    <?php endforeach; endif; else: echo "" ;endif; if(is_array($dates['noSign']) || $dates['noSign'] instanceof \think\Collection): $i = 0; $__LIST__ = $dates['noSign'];if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$time): $mod = ($i % 2 );++$i;?>
                                                        <p class="nosigntime" style="color: red" data-start="<?php echo $time[0]; ?>" data-end="<?php echo $time[1]; ?>">
                                                        <?php if($time[0] == 0): ?>0<?php else: ?><?php echo date('H:i:s',$time[0]); ?> ~<?php echo date('H:i:s',$time[1]); endif; ?></p>
                                                    <?php endforeach; endif; else: echo "" ;endif; ?>
                                                </div>
                                            </td>
                                        <?php endforeach; endif; else: echo "" ;endif; ?>
                                    </tr>
                                </table>                           
                            </div>
                        <?php endforeach; endif; else: echo "" ;endif; ?>
                    </div>
                </div>
                <div>

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
<script src="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>js/bootstrap.min.js"></script>
<script>
    $('#group').find("option[value=<?php echo (isset($_GET['group']) && ($_GET['group'] !== '')?$_GET['group']:0); ?>]").attr("selected",true);
    $('#personnel').find("option[value=<?php echo (isset($_GET['user']) && ($_GET['user'] !== '')?$_GET['user']:0); ?>]").attr("selected",true);
    $('#weeks').find("option[value=<?php echo (isset($_GET['week']) && ($_GET['week'] !== '')?$_GET['week']:0); ?>]").attr("selected",true);

    $('#group').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#personnel').on('change', function(event) {
        $('#date-form').submit();
    });
    $('#weeks').on('change', function(event) {
        $('#date-form').submit();
    });

    $('.detailed').on('click', function(){
        var $tr = $(this).parent();
        if ($tr.find('div').hasClass('extend')) {
            $tr.find('div').removeClass('extend');
        }else{
            $tr.find('div').addClass('extend');
        }
        
    });

    $('.havesigndate').each(function(index, el) {
        $(this).text(gettime($(this).parent().parent().find('.havesigntime')));
    });
    $('.nosigndate').each(function(index, el) {
        $(this).text(gettime($(this).parent().parent().find('.nosigntime')));
    });

    function gettime($signp){
        var $times = 0;
        console.log($signp);
        $signp.each(function(index, el) {
            $times += ($(this).data('end')-$(this).data('start'));
        });
        return Math.floor($times/60);
    }

</script>
</body>
</html>

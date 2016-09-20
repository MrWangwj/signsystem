<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:69:"D:\Apache24\htdocs\SignSystem2/application/home\view\index\index.html";i:1474271671;}*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <!--<link rel="stylesheet" type="text/css" href="/SignSystem2/public/home/css/bootstrap.css" />-->
    <link rel="stylesheet" type="text/css" href="<?php echo \think\Config::get('parse_str.__PUBLIC__'); ?>home/css/bootstrap.css">
    <!--<link rel="stylesheet" type="text/css" href="/__CSS__/bootstrap.min.css">-->
</head>
<body>
    <!--<div>这个是第一个页面</div>-->
    <form role="form">
        <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="form-group">
            <label for="exampleInputFile">File input</label>
            <input type="file" id="exampleInputFile">
            <p class="help-block">Example block-level help text here.</p>
        </div>
        <div class="checkbox">
            <label>
                <input type="checkbox"> Check me out
            </label>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
    </form>
</body>
</html>
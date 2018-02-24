<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel1</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/extend/jquery-weui/dist/lib/weui.min.css">
    <link rel="stylesheet" href="/extend/jquery-weui/dist/css/jquery-weui.min.css">
    <!-- Styles -->
    <style>
        .demos-header{
            padding: 35px 0;
        }

        .demo-title{
            text-align: center;
            font-size: 34px;
            color: #3cc51f;
            font-weight: 400;
            margin: 0 15%;
        }

    </style>
</head>
<body>
<div>
    <header class="demos-header">
        <div class="demo-title">
            <label>用户绑定</label>
        </div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd">
                    <label for="" class="weui-label">人员</label>
                </div>
                <div class="weui-cell__bd">
                    <select class="weui-select" name="type">
                        <option value="0">学生</option>
                        <option value="1">教师</option>
                    </select>
                </div>
            </div>

            <div class="weui-cell weui-cell_vcode">
                <div class="weui-cell__hd">
                    <label class="weui-label">手机号</label>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="tel" placeholder="请输入手机号">
                </div>
                <div class="weui-cell__ft">
                    <button class="weui-vcode-btn">获取验证码</button>
                </div>
            </div>

            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">验证码</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="number" pattern="[0-9]{6}" placeholder="请输入六位验证码">
                </div>
            </div>
        </div>

        <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">绑定</a>
        </div>
    </header>
</div>

<script src="/extend/jquery-3.3.1.min.js"></script>
<script src="/extend/jquery-weui/dist/js/jquery-weui.min.js"></script>
</body>
</html>

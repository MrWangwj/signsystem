@extends('wechat.layout.main')

@section('title', '导入课表')

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">导入课表</h1>
    </header>
    <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">学号</label></div>
            <div class="weui-cell__bd">
                <p id="user_id">{{ $userId }}</p>
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入密码"  id="password">
            </div>
        </div>

        <div class="weui-cell weui-cell_vcode">
            <div class="weui-cell__hd"><label class="weui-label">验证码</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input" placeholder="请输入验证码" id="validate">
            </div>
            <div class="weui-cell__ft">
                <img class="weui-vcode-img" src="/wechat/course/input/validate" onclick="changeValidateCode()" id="validateImg">
            </div>
        </div>
    </div>
    <div class="weui-cells__tips">请输入学校在教务系统的账号密码</div>

    <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary" href="javascript:" id="" onclick="input()">登录</a>
    </div>
@endsection

@section('js')
    <script src="/js/md5.js"></script>
    <script>
        function changeValidateCode(){
            var Obj = $('#validateImg');
            var dt = new Date();
            var src = "/wechat/course/input/validate/"+dt.getMilliseconds();
            Obj.attr('src', src);
        }
        
        function input() {
            $.showLoading();
            let $user_id = $('#user_id').text(),
                $password = $('#password').val(),
                $validate = $('#validate').val();

            if(!check({id: $user_id, password: $password, validate: $validate}, 3)) {
                $.hideLoading();
                return ;
            }

            if($user_id.length === 11){
                $password = chkpwd($password);
                $validate = chkyzm($validate);

            }

            $.post(
                '/wechat/course/input',
                {
                    password: $password,
                    validate: $validate
                },
                function (data) {
                    $.hideLoading();
                    if(parseInt(data.code) === 0){
                        $.toptip(data.msg);
                    }else{
                        $.toast(data.msg, function () {
                            window.location = '/wechat/course/input/show';
                        });
                    }
                }
            )
            
        }

        function check(data, type) {
            if(!data.id.trim()){
                $.toptip('请输入学号');
                return false;
            }else if(!/^\d{10,11}$/.test(data.id)){
                $.toptip('请输入正确的学号');
                return false;
            }
            if(type === 1) return true;

            if(!data.password.trim()){
                $.toptip('请输入密码');
                return false;
            }
            if(type == 2) return true;

            if(!data.validate.trim()){
                $.toptip('请输入验证码');
                return false;
            }else if(!/^\w{4}$/.test(data.validate)){
                $.toptip('请输入正确的验证码');
                return false;
            }
            if(type == 3) return true;

        }

        function chkpwd(pwd) {
           return md5($('#user_id').text()+md5(pwd).substring(0,30).toUpperCase()+'10467').substring(0,30).toUpperCase();
        }

        function chkyzm(validate) {
            return md5(md5(validate.toUpperCase()).substring(0,30).toUpperCase()+'10467').substring(0,30).toUpperCase();
        }
    </script>
@endsection
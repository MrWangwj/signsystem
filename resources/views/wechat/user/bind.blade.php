@extends('wechat.layout.main')

@section('title', '用户认证')

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">用户认证</h1>
    </header>

    <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">学号</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入学号" maxlength="11" id="id">
            </div>
        </div>
        <div class="weui-cell weui-cell_vcode">
            <div class="weui-cell__hd">
                <label class="weui-label">验证码</label>
            </div>
            <div class="weui-cell__bd">
                <input class="weui-input" type="" placeholder="请输入验证码" maxlength="6" id="validate">
            </div>
            <div class="weui-cell__ft">
                <button class="weui-vcode-btn" id="validateBut">获取验证码</button>
            </div>
        </div>
    </div>
    {{--<div class="weui-cells__tips">底部说明文字底部说明文字</div>--}}

    <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">确定</a>
    </div>
@endsection

@section('js')
    <script>
        $('#validateBut').click(function () {
            var id = $('#id').val();
            if(!check({id: id}, 1)) return;
            $(this).attr("disabled", true);
            $.ajax({
                url: "{{ url('/wechat/user/bindValidate') }}",
                type: "POST",
                data: {
                    id: id
                },
                success: function (data) {
                    if(data.code === 0){
                        $('#validateBut').removeAttr("disabled");
                        $.toptip(data.msg);
                    }else{
                        interval();
                    }
                }
            });
        });




        $("#showTooltips").click(function() {
            var id = $('#id').val(),
                validate = $('#validate').val();
            if(!check({id: id, validate: validate}, 2)) return;

            $.ajax({
                url: "{{ url('/wechat/user/bind') }}",
                type: "POST",
                data: {
                    id: id,
                    validate: validate
                },
                success: function (data) {
                    if(data.code === 0){
                        $.toptip(data.msg);
                    }else{
                        $.toast("操作成功");
                    }
                }
            });
        });


        function check(data, type){
            if(!data.id.trim()){
                $.toptip('请输入学号');
                return false;
            }else if(!/^\d{10,11}$/.test(data.id)){
                $.toptip('请输入正确的学号');
                return false;
            }
            if(type === 1) return true;
            if(!data.validate.trim()){
                $.toptip('请输入验证码');
                return false;
            }else if(!/^\w{6}$/.test(data.validate)){
                $.toptip('请输入正确的验证码');
                return false;
            }
            if(type === 2) return true;
        }
        function interval () {
            time = 60;
            timeInterval = self.setInterval(function() {
                time--;
                if(time < 0){
                    $('#validateBut').removeAttr("disabled");
                    window.clearInterval(timeInterval);
                    $('#validateBut').text('获取验证码');
                }else{
                    $('#validateBut').text(time+'s');
                }
            }, 1000);
        }
    </script>
@endsection
@extends('wechat.layout.main')

@section('title', '考勤补签')

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">考勤补签</h1>
    </header>

    <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">开始时间</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input"  id="sign-start" name="sign_start">
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">结束时间</label></div>
            <div class="weui-cell__bd">
                <input class="weui-input"  id="sign-end" name="sign_end">
            </div>
        </div>
    </div>
    <div class="weui-cells__tips">只能补签本周的考勤</div>

    <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary" href="javascript:" id="submitBut">提交</a>
    </div>
@endsection

@section('js')
    <script>
        $("#sign-start").datetimePicker({
            title: '开始时间',
            min: "{{ date('Y-m-d H:i', strtotime('last Monday')) }}",
            max: "{{ date('Y-m-d H:i', strtotime('now')) }}",
            value: "{{ date('Y-m-d H:i', strtotime('now')) }}",
            onChange: function (picker, values, displayValues) {
                console.log(values);
            }
        });

        $("#sign-end").datetimePicker({
            title: '结束时间',
            min: "{{ date('Y-m-d H:i', strtotime('last Monday')) }}",
            max: "{{ date('Y-m-d H:i', strtotime('now')) }}",
            value: "{{ date('Y-m-d H:i', strtotime('now')) }}",
            onChange: function (picker, values, displayValues) {
                console.log(values);
            }
        });

        $('#submitBut').click(function () {
            var signStart = $('#sign-start').val(),
                signEnd = $('#sign-end').val();
            if(new Date($('#sign-start').val()) >= new Date($('#sign-end').val())){
                $.toptip('开始时间大于结束时间', 'error');
                return;
            }
            
            $.post(
                "/wechat/sign/patch",
                {
                    sign_start: signStart,
                    sign_end: signEnd
                },
                function (data) {
                    if(data.code == 1){
                        $.toptip(data.msg, 'success', function () {
                            window.location = '/wechat/sign/patchrecode';
                        });

                    }else{
                        $.toptip(data.msg, 'error');
                    }
                }
            );
        });
    </script>
@endsection
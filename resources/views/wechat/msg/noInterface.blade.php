@extends('wechat.layout.main')

@section('title', '没有权限')

@section('content')
    <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-warn weui-icon_msg"></i></div>
        <div class="weui-msg__text-area">
            <h2 class="weui-msg__title">接口关闭</h2>
            <p class="weui-msg__desc">接口已经被关闭，如需操作请联系管理员 -<a href="http://marchsoft.cn/">三月考勤</a></p>
        </div>
        <div class="weui-msg__opr-area">
            <p class="weui-btn-area">
                <a href="javascript:self.opener=null;
self.close();" class="weui-btn weui-btn_primary">关闭窗口</a>
            </p>
        </div>
        <div class="weui-msg__extra-area">
            <div class="weui-footer">
                <p class="weui-footer__links">
                    <a href="http://marchsoft.cn/" class="weui-footer__link">三月小组</a>
                </p>
                <p class="weui-footer__text">Copyright © 2006-2017</p>
            </div>
        </div>
    </div>
@endsection

@section('js')
    <script>
        $('.weui-footer__text').text('Copyright © 2006-'+ new Date().getFullYear());
    </script>
@endsection

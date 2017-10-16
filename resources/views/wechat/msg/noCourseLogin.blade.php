@extends('wechat.layout.main')

@section('title', '无效操作')

@section('content')
    <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-warn weui-icon_msg"></i></div>
        <div class="weui-msg__text-area">
            <h2 class="weui-msg__title">无效操作</h2>
            <p class="weui-msg__desc">您可以先进行登录教务管理在进行操作 -<a href="http://marchsoft.cn/">三月小组</a></p>
        </div>
        <div class="weui-msg__opr-area">
            <p class="weui-btn-area">
                <a href="/wechat/course/input" class="weui-btn weui-btn_primary">前去登录</a>
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

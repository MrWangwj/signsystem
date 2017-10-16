@extends('wechat.layout.main')

@section('title', '用户信息')

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">用户信息</h1>
    </header>

    <div class="weui-cells">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>学号</p>
            </div>
            <div class="weui-cell__ft">{{ $user->id }}</div>
        </div>

        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>姓名</p>
            </div>
            <div class="weui-cell__ft">{{ $user->name }}</div>
        </div>

        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>性别</p>
            </div>
            <div class="weui-cell__ft">
                @if($user->sex == 0)
                    男
                @else
                    女
                @endif
            </div>
        </div>


        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>组别</p>
            </div>
            <div class="weui-cell__ft">{{ $user->grouping_id }}</div>
        </div>


        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>职务</p>
            </div>
            <div class="weui-cell__ft">待写</div>
        </div>


        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>电话</p>
            </div>
            <div class="weui-cell__ft">{{ $user->tel }}</div>
        </div>

        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>邮箱</p>
            </div>
            <div class="weui-cell__ft">{{ $user->email }}</div>
        </div>
    </div>
    <div class="weui-cells__tips">修改个人信息请联系管理员</div>
@endsection

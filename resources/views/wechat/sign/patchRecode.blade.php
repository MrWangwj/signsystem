@extends('wechat.layout.main')

@section('title', '补签记录')

@section('css')
    <style>
        .green{
            color: #0bb20c;
        }
        .gray{
            color: grey;
        }
        .red{
            color: red;
        }
        .orange{
            color: orange;
        }
    </style>
@endsection

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">补签记录</h1>
    </header>
    <div class="weui-cells__title">只可以取消待审批</div>
    <div class="weui-cells">

        @forelse($approvals as $approval)
            {{--2.待审批/3.同意/4.拒绝/5.取消--}}
            @if($approval->type == 2)
                <a class="weui-cell weui-cell_access orange" href="javascript:;">
                    <div class="weui-cell__bd ">
                        <p>
                            待审批
                        </p>
                    </div>
                    <div class="weui-cell__ft" data-id="{{ $approval->id }}">{{ date('Y-m-d ', $approval->sign_start) }} {{ date('H:i:s', $approval->sign_start) }}~{{ date('H:i:s', $approval->sign_end) }}</div>
                </a>
            @elseif($approval->type == 3)

                <a class="weui-cell weui-cell_access green" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p>
                            同意
                        </p>
                    </div>
                    <div class="weui-cell__ft">{{ date('Y-m-d ', $approval->sign_start) }} {{ date('H:i:s', $approval->sign_start) }}~{{ date('H:i:s', $approval->sign_end) }}</div>
                </a>
            @elseif($approval->type == 4)
                拒绝
                <a class="weui-cell weui-cell_access red" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p>
                            拒绝
                        </p>
                    </div>
                    <div class="weui-cell__ft">{{ date('Y-m-d ', $approval->sign_start) }} {{ date('H:i:s', $approval->sign_start) }}~{{ date('H:i:s', $approval->sign_end) }}</div>
                </a>
            @elseif($approval->type == 5)
                <a class="weui-cell weui-cell_access gray" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p>
                            取消
                        </p>
                    </div>
                    <div class="weui-cell__ft">{{ date('Y-m-d ', $approval->sign_start) }} {{ date('H:i:s', $approval->sign_start) }}~{{ date('H:i:s', $approval->sign_end) }}</div>
                </a>
            @else
                ...
            @endif
        @empty
            <p>本周没有补签记录</p>
        @endforelse


    </div>

@endsection

@section('js')
    <script>
        'use strict';
        $('.orange').on('click', function () {
            var item = $(this);
            var id = item.find('.weui-cell__ft').data('id');
            $.actions({
                actions: [
                    {
                        text: "取消申请",
                        className: "color-danger",
                        onClick: function() {
                            $.confirm("确认要取消吗？", function() {
                                $.showLoading();
                                $.post(
                                    '/wechat/sign/cancelpatch',
                                    {
                                        id: id
                                    },
                                    function (data) {
                                        $.hideLoading();
                                        if(parseInt(data.code) === 1){
                                            item.removeClass('orange');
                                            item.addClass('gray');
                                        }else{
                                            $.toptip(data.msg, 'error');
                                        }
                                    }
                                );
                            }, function() {
                                //点击取消后的回调函数
                            });
                        }
                    }
                ],
                title: "操作"
            });
        })
    </script>
@endsection
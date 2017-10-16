@extends('wechat.layout.main')

@section('title', '本周考勤')

@section('css')
    <style>
        .inline{
            color: #0bb20c !important;
        }
        .nosign{
            color: red !important;
        }
        .warning{
            color: #FFCC00;
        }
    </style>
@endsection

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">本周考勤</h1>
    </header>

    <div class="weui-cells">
        @for($i = count($restule)-1; $i >= 0; $i--)
            @if(!$restule[$i]->isEmpty())
                <div class="weui-cell__title">{{ date('m月d日', $restule[$i]->get(0)['start']) }}</div>
            @endif

            @foreach($restule[$i] as $k => $value)
                @if($value['type'] == 1)
                    @if($value['start'] == $value['end'])
                        <div class="weui-cell ">
                            <div class="weui-cell__bd warning">
                                <p>
                                    @if($k-1 == count($restule[$i]) && $i == count($restule)-1)
                                        待签退
                                    @else
                                        待补签
                                    @endif
                                </p>
                            </div>
                            <div class="weui-cell__ft">
                                {{ date('H:i:s', $value['start']) }} ~ 	&hellip;&hellip;&emsp;&emsp;&emsp;
                            </div>
                        </div>
                    @else
                        <div class="weui-cell ">
                            <div class="weui-cell__bd inline">
                                <p> 在线 </p>
                            </div>
                            <div class="weui-cell__ft">
                                {{ date('H:i:s', $value['start']) }} ~ {{ date('H:i:s', $value['end']) }}
                            </div>
                        </div>
                    @endif
                @else
                    <div class="weui-cell ">
                        <div class="weui-cell__bd nosign">
                            <p> 缺勤 </p>
                        </div>
                        <div class="weui-cell__ft">
                            {{ date('H:i:s', $value['start']) }} ~ {{ date('H:i:s', $value['end']) }}
                        </div>
                    </div>
                @endif
            @endforeach
        @endfor
    </div>

@endsection

@section('js')

@endsection
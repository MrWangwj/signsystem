@extends('wechat.layout.main')

@section('title', '导入课表')

@section('content')
    <header class='demos-header'>
        <h1 class="demos-title">导入课表信息</h1>
    </header>

    @foreach($courses as $course)
        <div class="weui-form-preview">
            <div class="weui-form-preview__hd">
                <label class="weui-form-preview__label">课程名称</label>
                <em class="weui-form-preview__value">{{ $course['course_name'] }}</em>
            </div>
            <div class="weui-form-preview__bd">
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">任课教师</label>
                    <span class="weui-form-preview__value">{{ $course['teacher'] }}</span>
                </div>
                <div class="weui-form-preview__item">
                    <label class="weui-form-preview__label">上课时间/地点</label>
                    <span class="weui-form-preview__value">
                        @foreach($course['info'] as $info)
                            {{ $info }} <br/>
                        @endforeach
                    </span>
                </div>
            </div>
        </div>
    @endforeach
    <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary" href="javascript:" id="" onclick="input()">导入</a>
    </div>
@endsection

@section('js')
    <script>
        function input(){
            $.confirm({
                title: '确认导入',
                text: '导入会清除之前的所有课表!',
                onOK: function () {
                    $.showLoading('数据导入中');
                    $.post(
                        '/wechat/course/input/input',
                        {},
                        function (data) {
                            $.hideLoading();

                            if(parseInt(data.code) === 0){
                                $.toast(data.msg);
                            }else{
                                $.toast(data.msg, function () {
                                    window.location = '/wechat/course/show';
                                });
                            }
                        }
                    );
                },
                onCancel: function () {
                }
            });
        }
    </script>
@endsection
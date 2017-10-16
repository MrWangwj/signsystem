<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="/jquery-weui/dist/lib/weui.min.css">
    <link rel="stylesheet" href="/jquery-weui/dist/css/jquery-weui.min.css">
    <link rel="stylesheet" href="/jquery-weui/dist/demos/css/demos.css">
    @yield('css')
</head>

<body ontouchstart>


    @yield('content')

    <script src="/jquery-weui/dist/lib/jquery-3.2.1.min.js"></script>
    {{--<script src="/jquery-weui/dist/lib/fastclick.js"></script>--}}
    {{--<script>--}}
        {{--$(function() {--}}
            {{--FastClick.attach(document.body);--}}
        {{--});--}}
    {{--</script>--}}
    <script src="/jquery-weui/dist/js/jquery-weui.min.js"></script>

    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    @yield('js')

</body>
</html>

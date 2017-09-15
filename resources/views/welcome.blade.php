<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
<<<<<<< HEAD
         <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>

    </head>
    <style>

    </style>
    <body>
    <div id="app">
       <app></app>
    </div>
    
    </body>
    <script src = "{{mix('js/app.js')}}"></script>
=======

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

    </head>
    <body>
        <div id="app">

        </div>
    </body>
    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
>>>>>>> 2ea40ac03372867e33afbf1040dfe1118495e6be
</html>

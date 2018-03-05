<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>系统登录</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">


    <link rel="stylesheet" href="/extend/bootstrap.min.css">
    {{--<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">--}}
    <!-- Styles -->
    <style>
        html{
            background-color: #000;
        }
        .chajian{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
        .main{
            width: 100%;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            min-width: 350px;
            min-height: 350px;
            display: flex;
            justify-content:center;
            align-items:center;
        }
        .login{
            color: white;
            width: 420px;
            /*margin: 0 auto;*/
            background-color: rgba(15,15,15,0.5);
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;
            padding: 35px 35px 35px 35px;
            border-radius: 10px;



        }
        .login-title{
            text-align: center;
            height: 50px;
        }
        .validate-img{
            display: block;
            width: 100%;
            height: 40px;
        }
        #msg{
            margin: -15px 0 10px 0;
            color: red !important;
            display: block;
            height: 20px;
        }

        #login-but {
            width: 100%;
            background-color: black;
            color: white;
            border-radius: 4px;
            border-color: #FFF;
        }


        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }

    </style>

</head>
<body>
    <div class="main">
        <div class="login">
            <div class="login-title">
                <h4>系统登录</h4>
            </div>
            <form>
                <div class="form-group">
                    <input type="number" class="form-control" id="account"  placeholder="学号" required>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="password" placeholder="密码" required>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <input type="text" class="form-control" id="validate" placeholder="验证码" required>
                    </div>
                    <div class="form-group col-md-6">
                        <img class="validate-img" src="{{ captcha_src() }}}" alt="" onclick="this.src='{{captcha_src()}}'+Math.random()">
                    </div>
                </div>
                <div>
                    <small id="msg" class="form-text text-muted"></small>
                </div>
                <button type="button" class="btn btn-primary" id="login-but" onclick="login()">登录</button>
            </form>
        </div>
    </div>

    <script src="/extend/three.min.js"></script>
    <script>
        var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

        var container;
        var camera, scene, renderer;

        var particles, particle, count = 0;

        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight /1.5;

        init();
        animate();

        function init() {

            container = document.createElement( 'div' );
            container.setAttribute("class", "chajian");
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.z = 1000;

            scene = new THREE.Scene();

            particles = new Array();

            var PI2 = Math.PI * 2;
            var material = new THREE.ParticleCanvasMaterial( {

                color: 0xffffff,
                program: function ( context ) {

                    context.beginPath();
                    context.arc( 0, 0, 1, 0, PI2, true );
                    context.fill();

                }

            } );

            var i = 0;

            for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                    particle = particles[ i ++ ] = new THREE.Particle( material );
                    particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                    particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                    scene.add( particle );

                }

            }

            renderer = new THREE.CanvasRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            document.addEventListener( 'touchstart', onDocumentTouchStart, false );
            document.addEventListener( 'touchmove', onDocumentTouchMove, false );

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        //

        function onDocumentMouseMove( event ) {

            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;

        }

        function onDocumentTouchStart( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }

        }

        function onDocumentTouchMove( event ) {

            if ( event.touches.length === 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }

        }

        //

        function animate() {

            requestAnimationFrame( animate );

            render();


        }

        function render() {

            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;
            camera.lookAt( scene.position );

            var i = 0;

            for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                    particle = particles[ i++ ];
                    particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                    particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

                }

            }

            renderer.render( scene, camera );

            count += 0.1;

        }

    </script>

    <script src="/extend/jquery-3.3.1.min.js"></script>

    <script>

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        function login(){
            let account = $('#account').val(),
                password = $('#password').val(),
                validate = $('#validate').val();
            if(!/^\d{10,11}$/.test(account)){
                $('#msg').text('请输入正确的学号');
                return;
            }
            if(!/^[A-Za-z0-9]{6,16}$/.test(password)){
                $('#msg').text('请输入正确的密码');
                return;
            }
            if (!/^[A-Za-z0-9]{5}$/.test(validate)){
                $('#msg').text('请输入正确的验证码');
                return;
            }

            let post = $.post('/admin/login', {
                account: account,
                password: password,
                validate: validate
            }, function (data, status) {
                console.log(status);
                if(data.code === 1){
                    window.location = '/admin';
                }else{
                    $('#msg').text(data.msg);
                }
            }).fail(function() {
                console.log(1111);
                $('#msg').text("验证码错误");
            });
        }

    </script>
</body>

</html>

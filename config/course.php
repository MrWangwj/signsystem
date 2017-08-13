<?php
return [
    'base_uri' => [
        'xinke' => '',
        'hist' => 'http://jwgl.hist.edu.cn'
    ],

    'timeout' => 2.0,

    'uri' => [
        'hist' => [
            'validate' => '/jwweb/sys/ValidateCode.aspx',
            'login' => '/jwweb/_data/index_LOGIN.aspx',
            'course' => '/jwweb/wsxk/stu_zxjg_rpt.aspx',
        ],
    ],

    'method' => [
        'hist' => [
            'validate' => 'GET',
            'login' => 'POST',
            'course' => 'GET',
        ],
    ],

    'header' => [
        'hist' => [
            'validate' => [
                'Accept:' => 'mage/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding' => 'gzip, deflate',
                'Accept-Language' => 'zh-CN,zh;q=0.8',
                'Cache-Control' => 'no-cache',
                'Connection' => 'keep-alive',
                'Host' => 'jwgl.hist.edu.cn',
                'Pragma' => 'no-cache',
                'Referer' => 'http://jwgl.hist.edu.cn/jwweb/_data/login.aspx',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
            ],
            'login' => [
                "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Encoding" => "gzip, deflate",
                "Accept-Language" => "zh-CN,zh;q=0.8",
                "Cache-Control" => "max-age=0",
                "Content-Length" => "603",
                "Content-Type" => "application/x-www-form-urlencoded",
                "Host" => "jwgl.hist.edu.cn",
                "Origin" => "http://jwgl.hist.edu.cn",
                "Proxy-Connection" => "keep-alive",
                "Referer" => "http://jwgl.hist.edu.cn/jwweb/_data/index_LOGIN.aspx",
                "Upgrade-Insecure-Requests" => "1",
                "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3080.5 Safari/537.36",
            ],
            'course' => [

            ],
        ],
    ],

    'formdata' => [
        'hist' => [
            'validate' => [

            ],
            'login' => [
                '__VIEWSTATE' => 'dDw4ODEwMTkyNTY7Oz6uXw9RQf0bw8SrGIjZutgOtpxLCw==',
                '__VIEWSTATEGENERATOR' =>'4B596BA9',
                'pcInfo' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3080.5 Safari/537.36undefined5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3080.5 Safari/537.36 SN:NULL',
                'typeName' => '(unable to decode value)',
                'dsdsdsdsdxcxdfgfg' => '',
                'fgfggfdgtyuuyyuuckjg' => '',
                'Sel_Type' => 'STU',
                'txt_asmcdefsddsd' => '',
                'txt_pewerwedsdfsdff'=> '',
                'txt_sdertfgsadscxcadsads' => '',
                'sbtState' => '',
            ],
            'course' => [

            ],
        ],
    ],



];
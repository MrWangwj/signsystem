<?php
/**
 * Created by PhpStorm.
 * User: Mr.Wang
 * Date: 2017/8/9
 * Time: 22:12
 */

namespace App\Wechat\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\DomCrawler\Crawler;

class CourseController extends Controller
{
    //我的课表
    public function course(){
        return view('wechat.course.course');
    }

    //课表统计
    public function  count(){
        return view('wechat.course.count');
    }

    //导入课表渲染
    public function input(){
        return view('wechat.course.input');
    }

    //导入课表
    public function setInput(){
        $this->validate(request(), [
            'user_id' => 'required|numeric',
            'password' => 'required',
            'validate' =>'required',
        ]);

        $data = config('course');

        $school     = 'hist';
        $base_url   = $data['base_uri']['hist'];
        $timeout    = $data['timeout'];
        $header     = $data['header'][$school]['login'];
        $method     = $data['method'][$school]['login'];
        $uri        = $data['uri'][$school]['login'];
        $postData   = $data['formdata'][$school]['login'];

        $postData['dsdsdsdsdxcxdfgfg']   = request('password','');
        $postData['fgfggfdgtyuuyyuuckjg']   = request('validate','');
        $postData['txt_asmcdefsddsd']  = request('user_id','');
        

        $set = [
            'base_uri' => $$base_url,
            'timeout'  => $timeout,
        ];
        $client = new Client($set);
        $jar    = session('user_cookie');
        $r      = $client->request($method, $uri, [
            'headers' => $header,
            'cookies' => $jar,
            'form_params' => $postData,
        ]);

        $crawler = new Crawler();
        $crawler->addHtmlContent($r->getBody()->getContents(), 'gb2312');
        $text = $crawler->filter('#divLogNote>font')->text();

        if($text != '正在加载权限数据...')
            return ['code' => '0', 'msg' => $text];
        else{

            $method     = $data['method'][$school]['course'];
            $uri        = $data['uri'][$school]['course'];

            $course = $client->request($method, $uri, [
                'cookies' => $jar,
            ]);

            $crawler = new Crawler();
            $crawler->addHtmlContent($course->getBody()->getContents(), 'gb2312');

            $text = $crawler->filter('.T')->parents()->html();
            Storage::put('course/'.session('wechat_user')['id'].'.html', $text, 'private');

            return ['code' => '1', 'msg' => '登录成功'];
        }

    }

    //登录验证码
    public function getValidate($t = 0){
        $data = config('course');
        $school = 'hist';
        $set = [
            'base_uri' => $data['base_uri'][$school],
            'timeout' => $data['timeout'],
        ];
        $client = new Client($set);

        $header = $data['header'][$school]['validate'];

        $jar = new CookieJar();
        $r = $client->request($data['method'][$school]['validate'], $data['uri'][$school]['validate'].'?t='.$t, [
            'headers' => $header,
            'cookies' => $jar,
        ]);

        session(['user_cookie' => $jar]);
        return $r->getBody();
    }

}
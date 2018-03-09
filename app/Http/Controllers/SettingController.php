<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    //
    function nodes(){
        $nodes = DB::table('nodes')->get();
        return $nodes;
    }
}

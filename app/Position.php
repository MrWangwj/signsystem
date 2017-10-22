<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    //职务的权限
    public function powers(){
        return $this->belongsToMany('\App\Power', 'position_powers', 'position_id','power_id');
    }


}

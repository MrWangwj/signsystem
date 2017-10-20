<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Punish extends Model
{
    //
    protected $table = 'punishs';

    protected $fillable = ['user_id', 'content'];
}

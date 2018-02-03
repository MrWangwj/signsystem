<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id')->comment('学号');
            $table->string('name', 20)->comment('姓名');
            $table->string('name_py', 30)->comment('姓名拼音');
            $table->enum('sex', ['男', '女'])->comment('性别');
            $table->string('email', 50)->comment('邮箱');
            $table->char('tel', 11)->comment('手机号');
            $table->char('openid', 50)->comment('微信openID');
            $table->char('password', 60)->comment('密码');
            $table->integer('grouping_id')->comment('分组id');
            $table->integer('location_id')->comment('地点id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

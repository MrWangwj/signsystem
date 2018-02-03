<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('teachers', function (Blueprint $table) {
            $table->increments('id')->comment('教师编号');
            $table->string('name', 20)->comment('名称');
            $table->char('tel', 11)->comment('电话');
            $table->string('email', 50)->comment('邮箱');
            $table->char('password', 50)->comment('密码');
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
        //
        Schema::dropIfExists('teachers');
    }
}

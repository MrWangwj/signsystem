<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->increments('id')->comment('课程编号');
            $table->string('name', 20)->comment('课程名称');
            $table->string('teacher', 20)->comment('教师');
            $table->string('location', 20)->comment('地点');
            $table->tinyInteger('week_start')->comment('开始周');
            $table->tinyInteger('week_end')->comment('结束周');
            $table->tinyInteger('week_type')->comment('类型');
            $table->tinyInteger('section_start')->comment('开始节');
            $table->tinyInteger('section_end')->comment('结束节');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('courses');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nodes', function (Blueprint $table) {
            $table->increments('id')->comment('id');
            $table->string('name', 20)->comment('名称');
            $table->string('code', 6)->comment('编码');
            $table->integer('pid')->comment('父节点id');
            $table->tinyInteger('depth')->comment('层级');
            $table->string('path', 30)->comment('路径');
            $table->tinyInteger('type')->comment('类型：0 菜单，1，按钮， 1 api');
            $table->integer('sort_factor')->comment('排序规则');
            $table->tinyInteger('status')->comment('状态');
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
        Schema::dropIfExists('nodes');
    }
}

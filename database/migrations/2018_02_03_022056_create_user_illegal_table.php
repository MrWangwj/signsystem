<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserIllegalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_illegal', function (Blueprint $table) {
            $table->increments('id')->comment('id');
            $table->integer('user_id')->comment('用户id');
            $table->integer('illegal_id')->comment('错误类型');
            $table->string('course', 50)->comment('详细原因');
            $table->integer('punish_id')->comment('惩罚id');
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
        Schema::dropIfExists('user_illegal');
    }
}

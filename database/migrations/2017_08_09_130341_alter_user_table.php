<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('users', function (Blueprint $table) {
            $table->string('openid', 30)->unique();
            $table->tinyInteger('sex')->default(0);
            $table->integer('grouping_id')->default(0);
            $table->integer('position_id')->default(0);
            $table->bigInteger('tel')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('openid');
            $table->dropColumn('sex');
            $table->dropColumn('grouping_id');
            $table->dropColumn('position_id');
            $table->dropColumn('tel');
        });
    }
}

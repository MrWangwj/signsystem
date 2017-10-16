<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->tinyInteger('start_week')->default(0);
            $table->tinyInteger('end_week')->default(0);
            $table->tinyInteger('start_section')->default(0);
            $table->tinyInteger('end_section')->default(0);
            $table->tinyInteger('week_day')->default(0);
            $table->dropColumn('start');
            $table->dropColumn('end');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('start_week');
            $table->dropColumn('end_week');
            $table->dropColumn('start_section');
            $table->dropColumn('end_section');
            $table->dropColumn('week_day');
            $table->tinyInteger('start')->default(0);
            $table->tinyInteger('end')->default(0);
        });
    }
}

<?php

namespace App\Providers;

use App\Approval;
use App\Course;
use App\Policies\ApprovalPolicy;
use App\Policies\PunishPolicy;
use App\Policies\UserCoursePolicy;
use App\Policies\UserIllegalPolicy;
use App\Policies\UserPolicy;
use App\Punish;
use App\User;
use App\UserIllegal;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Approval::class => ApprovalPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}

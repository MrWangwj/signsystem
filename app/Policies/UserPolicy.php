<?php

namespace App\Policies;

use App\Power;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    //操作用户
    public function addUser(User $user){
        return $user->isPower('add-user');
    }

    public function deleteUser(User $user, User $deleteUser){
        return $user->isPower('delete-user');
    }


    //TODO::  BUG：组长修改组成员信息为事务管理，那么能操作用户。注释的为组长修改本组人员的信息，开启需要移除用户职务的修改，并另写修改职务功能
    public function editUser(User $user, User $editUser){
        if(!$user->isPower('edit-user')){
//            if($user->grouping_id == $editUser->grouping_id){
//                return $user->isPower('edit-group-user');
//            }
            return false;
        }
        return true;
    }



    //操作违规
    public function addUserIllegal(User $user){
        return $user->isPower('add-user-illegal');
    }

    public function deleteUserIllegal(User $user){
        return $user->isPower('delete-user-illegal');
    }

    public function addUserPunish(User $user){
        return $user->isPower('add-punish');
    }




    //操作课表
    public function addUserCourse(User $user, User $addCourseUser){
        if(!$user->isPower('add-user-course')){
            if($user->grouping_id == $addCourseUser->grouping_id){
                return $user->isPower('add-group-user-course');
            }
            return false;
        }
        return true;
    }

    public function deleteUserCourse(User $user, User $deleteCourseUser){
        if(!$user->isPower('delete-user-course')){
            if($user->grouping_id == $deleteCourseUser->grouping_id){
                return $user->isPower('delete-group-user-course');
            }
            return false;
        }
        return true;
    }

    public function editUserCourse(User $user, User $editCourseUser){
        if(!$user->isPower('edit-user-course')){
            if($user->grouping_id == $editCourseUser->grouping_id){
                return $user->isPower('edit-group-user-course');
            }
            return false;
        }
        return true;
    }





}

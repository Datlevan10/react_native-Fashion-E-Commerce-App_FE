<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';

    protected $primaryKey = 'adminId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'userName',
        'fullName',
        'gender',
        'dateOfBirth',
        'image',
        'email',
        'phoneNumber',
        'passWord',
        'address',
        'role',
        'permissions',
        'isActive',
        'lasLogin',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($admin) {
            $lastAdmin = Admin::orderBy('adminId', 'desc')->first();
            $nextId = 1;

            if ($lastAdmin) {
                $lastId = intval(str_replace('admin', '', $lastAdmin->adminId));
                $nextId = $lastId + 1;
            }

            $admin->adminId = 'admin' . $nextId;
        });
    }
    public function updateLastLogin()
    {
        $this->lasLogin = now();
        $this->save();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';

    protected $primaryKey = 'admin_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_name',
        'full_name',
        'gender',
        'date_of_birth',
        'image',
        'email',
        'phone_number',
        'password',
        'address',
        'role',
        'permissions',
        'is_active',
        'last_login',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($admin) {
            $last_admin = Admin::orderBy('admin_id', 'desc')->first();
            $nextId = 1;

            if ($last_admin) {
                $lastId = intval(str_replace('admin', '', $last_admin->admin_id));
                $nextId = $lastId + 1;
            }

            $admin->admin_id = 'admin' . $nextId;
        });
    }
    public function updateLastLogin()
    {
        $this->lasLogin = now();
        $this->save();
    }
}

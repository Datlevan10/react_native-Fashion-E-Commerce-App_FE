<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staffs';

    protected $primaryKey = 'staff_id';
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
        'hire_date',
        'salary',
        'department',
        'role',
        'is_active',
        'last_login',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($staff) {
            $last_staff = Staff::orderBy('staff_id', 'desc')->first();
            $nextId = 1;

            if ($last_staff) {
                $lastId = intval(str_replace('staff', '', $last_staff->staff_id));
                $nextId = $lastId + 1;
            }

            $staff->staff_id = 'staff' . $nextId;
        });
    }
    public function updateLastLogin()
    {
        $this->lasLogin = now();
        $this->save();
    }
}

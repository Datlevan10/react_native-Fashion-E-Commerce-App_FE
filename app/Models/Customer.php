<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Customer extends Model
{
    use HasApiTokens, Notifiable;
    use HasFactory;

    protected $table = 'customers';

    protected $primaryKey = 'customer_id';
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
        'is_active',
        'last_login',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            $customer->customer_id = Str::random(8);
        });
    }

    public function updateLastLogin()
    {
        $this->last_login = now();
        $this->save();
    }
}

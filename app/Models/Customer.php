<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';

    protected $primaryKey = 'customerId';
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
        'isActive',
        'lasLogin',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            $lastCustomer = Customer::orderBy('customerId', 'desc')->first();
            $nextId = 1;

            if ($lastCustomer) {
                $lastId = intval(str_replace('customer', '', $lastCustomer->customerId));
                $nextId = $lastId + 1;
            }

            $customer->customerId = 'customer' . $nextId;
        });
    }
    public function updateLastLogin()
    {
        $this->lasLogin = now();
        $this->save();
    }
}

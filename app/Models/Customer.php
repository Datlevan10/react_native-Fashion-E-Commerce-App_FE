<?php

namespace App\Models;

use App\Models\Customer;
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
        'customerName',
        'gender',
        'dateOfBirth',
        'image',
        'email',
        'phoneNumber',
        'passWord',
        'address',
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
}

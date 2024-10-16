<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $primaryKey = 'category_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'category_name',
        'image_category',
        'description',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $last_category = Category::orderBy('category_id', 'desc')->first();
            $nextId = 1;

            if ($last_category) {
                $lastId = intval(str_replace('category', '', $last_category->category_id));
                $nextId = $lastId + 1;
            }

            $category->category_id = 'category' . $nextId;
        });
    }
}

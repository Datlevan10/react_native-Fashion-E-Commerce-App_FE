<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $primaryKey = 'categoryId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'categoryName',
        'imageCategory',
        'description',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $lastCategory = Category::orderBy('categoryId', 'desc')->first();
            $nextId = 1;

            if ($lastCategory) {
                $lastId = intval(str_replace('category', '', $lastCategory->categoryId));
                $nextId = $lastId + 1;
            }

            $category->categoryId = 'category' . $nextId;
        });
    }
}

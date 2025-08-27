# Laravel Storage 403 Fix Instructions

Run these commands on your Laravel backend:

## 1. Create storage symbolic link
```bash
cd /path/to/your/laravel/project
php artisan storage:link
```

## 2. Check if public/storage link exists
```bash
ls -la public/
# You should see: storage -> ../storage/app/public
```

## 3. Fix permissions
```bash
chmod -R 755 storage
chmod -R 755 public/storage
```

## 4. If using built-in PHP server
Instead of:
```bash
php artisan serve
```

Use:
```bash
php -S 192.168.1.58:8080 -t public
```

## 5. Alternative: Add route to serve images
In routes/web.php, add:
```php
use Illuminate\Support\Facades\File;

Route::get('/storage/{filename}', function ($filename) {
    $path = storage_path('app/public/' . $filename);
    
    if (!File::exists($path)) {
        abort(404);
    }
    
    $file = File::get($path);
    $type = File::mimeType($path);
    
    return response($file, 200)->header("Content-Type", $type);
})->where('filename', '.*');
```

## 6. Check .htaccess (if using Apache)
Make sure public/.htaccess allows access to storage directory.
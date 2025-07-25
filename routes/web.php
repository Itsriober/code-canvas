<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*');

require __DIR__.'/auth.php';

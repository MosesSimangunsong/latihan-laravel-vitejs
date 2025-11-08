<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TodoController; // <--- TAMBAHKAN INI
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {
    // Auth Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');
        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');
        Route::delete('/todo/{id}', [TodoController::class, 'destroy'])->name('todo.destroy');
    });

    Route::get('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Protected Routes
    Route::group(['middleware' => 'check.auth'], function () {
        // GANTI baris ini:
        // Route::get('/', [HomeController::class, 'home'])->name('home');

        // DENGAN baris ini:
        Route::get('/', [TodoController::class, 'index'])->name('home');

        // TAMBAHKAN baris ini untuk menyimpan data:
        Route::post('/todo/store', [TodoController::class, 'store'])->name('todo.store');
    });
});
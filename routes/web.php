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
        Route::patch('/todo/{id}/status', [TodoController::class, 'updateStatus'])->name('todo.updateStatus');
        Route::patch('/todo/{id}', [TodoController::class, 'update'])->name('todo.update');
        Route::post('/todo/{id}', [TodoController::class, 'update'])->name('todo.update');
        Route::get('/todo/{id}', [TodoController::class, 'show'])->name('todo.show');
    });

    Route::get('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Protected Routes
    Route::get('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Protected Routes (Aplikasi Utama)
    Route::group(['middleware' => 'check.auth'], function () {
        
        // Read (List)
        Route::get('/', [TodoController::class, 'index'])->name('home');
        
        // Read (Detail)
        Route::get('/todo/{id}', [TodoController::class, 'show'])->name('todo.show');

        // Create
        Route::post('/todo/store', [TodoController::class, 'store'])->name('todo.store');

        // Update (HARUS POST, bukan PATCH, untuk file upload)
        Route::post('/todo/{id}', [TodoController::class, 'update'])->name('todo.update');

        // Delete
        Route::delete('/todo/{id}', [TodoController::class, 'destroy'])->name('todo.destroy');
        
        // Update Status (Ini boleh PATCH)
        Route::patch('/todo/{id}/status', [TodoController::class, 'updateStatus'])->name('todo.updateStatus');
    });
});
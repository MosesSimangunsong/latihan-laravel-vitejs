<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // PASTIKAN ANDA MEMILIKI BLOK DI BAWAH INI:
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover',
        'is_finished',
    ];
}
<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Menampilkan halaman utama dan data todos
     */
    public function index()
    {
        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Ambil semua data todos milik user tersebut
        $todos = Todo::where('user_id', $userId)->get();

        // AmBIL DATA AUTH USER
        $auth = Auth::user(); // <--- TAMBAHKAN INI

        // Kirim data ke view
        return Inertia::render('app/HomePage', [
            'todos' => $todos,
            'auth' => $auth, // <--- TAMBAHKAN INI
        ]);
    }

    /**
     * Menyimpan data todo baru
     */
    public function store(Request $request)
    {
        // Validasi request
        $request->validate([
            'title' => 'required|string|max:100',
        ]);

        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Buat todo baru
        Todo::create([
            'user_id' => $userId,
            'title' => $request->title,
        ]);

        // Redirect kembali ke halaman utama
        return redirect()->route('home');
    }
}
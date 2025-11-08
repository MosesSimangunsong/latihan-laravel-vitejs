<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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

        // Ambil data auth user
        $auth = Auth::user();

        // --- TAMBAHKAN LOGIKA INI ---
        // Buat URL lengkap untuk setiap cover
        $todos->transform(function ($todo) {
            if ($todo->cover) {
                // 'cover_url' adalah properti baru yang kita buat 'on-the-fly'
                $todo->cover_url = Storage::disk('public')->url($todo->cover);
            }
            return $todo;
        });
        // --- BATAS LOGIKA TAMBAHAN ---

        // Kirim data ke view
        return Inertia::render('app/HomePage', [
            'todos' => $todos,
            'auth' => $auth,
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

    public function destroy(string $id)
    {
        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Cari todo berdasarkan ID dan user_id
        $todo = Todo::where('id', $id)->where('user_id', $userId)->first();

        // Jika tidak ditemukan, kembalikan ke home
        if (!$todo) {
            return redirect()->route('home');
        }

        // Hapus todo
        $todo->delete();

        // Redirect kembali ke halaman utama
        return redirect()->route('home');
    }

    public function updateStatus(string $id)
    {
        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Cari todo berdasarkan ID dan user_id
        $todo = Todo::where('id', $id)->where('user_id', $userId)->first();

        // Jika tidak ditemukan, kembalikan ke home
        if (!$todo) {
            return redirect()->route('home');
        }

        // Ubah status (toggle: jika true jadi false, jika false jadi true)
        $todo->is_finished = !$todo->is_finished;
        $todo->save();

        // Redirect kembali
        return redirect()->route('home');
    }

    public function update(Request $request, string $id)
    {
        // Validasi request
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Cari todo berdasarkan ID dan user_id
        $todo = Todo::where('id', $id)->where('user_id', $userId)->first();

        // Jika tidak ditemukan, kembalikan ke home
        if (!$todo) {
            return redirect()->route('home');
        }

        // Update data todo
        $todo->title = $request->title;
        $todo->description = $request->description;
        $todo->save();

        // Redirect kembali
        return redirect()->route('home');
    }

    
}
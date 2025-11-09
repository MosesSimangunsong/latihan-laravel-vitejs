<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // Penting untuk file
use Inertia\Inertia;
use Carbon\Carbon; // Penting untuk format tanggal

class TodoController extends Controller
{
    /**
     * Menampilkan list semua todos
     */
    public function index()
    {
        $userId = Auth::id();
        
        // Ambil todos
        $todos = Todo::where('user_id', $userId)
            ->select('id', 'title', 'description', 'cover', 'is_finished') // Hanya ambil data yg perlu
            ->get();

        // Buat URL publik untuk gambar
        $todos->transform(function ($todo) {
            if ($todo->cover) {
                // Ini akan menghasilkan /storage/todos/namafile.jpg
                $todo->cover_url = Storage::url($todo->cover); 
            }
            return $todo;
        });

        return Inertia::render('app/HomePage', [
            'auth' => Auth::user(),
            'todos' => $todos,
        ]);
    }

    /**
     * Menampilkan halaman detail
     */
    public function show(string $id)
    {
        $userId = Auth::id();
        $todo = Todo::where('id', $id)->where('user_id', $userId)->firstOrFail();

        // Buat URL Gambar
        if ($todo->cover) {
            $todo->cover_url = Storage::url($todo->cover);
        }

        // Format data
        $todo->status_text = $todo->is_finished ? 'Selesai' : 'Belum Selesai';
        $todo->created_at_formatted = Carbon::parse($todo->created_at)->translatedFormat('d F Y, H:i');
        $todo->updated_at_formatted = Carbon::parse($todo->updated_at)->translatedFormat('d F Y, H:i');
        
        return Inertia::render('app/TodoDetailPage', [
            'auth' => Auth::user(),
            'todo' => $todo,
        ]);
    }

    /**
     * Menyimpan Todo baru
     */
    public function store(Request $request)
    {
        $userId = Auth::id();

        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi 'cover'
        ]);

        $coverPath = null;
        if ($request->hasFile('cover')) {
            // Simpan file ke storage/app/public/todos
            $coverPath = $request->file('cover')->store('todos', 'public');
        }

        Todo::create([
            'user_id' => $userId,
            'title' => $request->title,
            'description' => $request->description,
            'cover' => $coverPath, // Simpan path
            'is_finished' => false,
        ]);

        return redirect()->route('home');
    }

    /**
     * Update Todo yang ada
     */
    public function update(Request $request, string $id)
    {
        $userId = Auth::id();
        $todo = Todo::where('id', $id)->where('user_id', $userId)->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi 'cover'
        ]);

        $coverPath = $todo->cover; // Ambil path lama

        if ($request->hasFile('cover')) {
            // 1. Hapus file lama jika ada
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }

            // 2. Simpan file baru
            $coverPath = $request->file('cover')->store('todos', 'public');
        }

        // Update data di database
        $todo->update([
            'title' => $request->title,
            'description' => $request->description,
            'cover' => $coverPath, // Simpan path baru (atau lama jika tidak diubah)
        ]);

        return redirect()->route('home');
    }

    /**
     * Hapus Todo
     */
    public function destroy(string $id)
    {
        $userId = Auth::id();
        $todo = Todo::where('id', $id)->where('user_id', $userId)->firstOrFail();

        // Hapus file gambar dari storage jika ada
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        // Hapus data dari database
        $todo->delete();

        return redirect()->route('home');
    }

    /**
     * Update status selesai/belum
     */
    public function updateStatus(string $id)
    {
        $userId = Auth::id();
        $todo = Todo::where('id', $id)->where('user_id', $userId)->firstOrFail();

        $todo->is_finished = !$todo->is_finished;
        $todo->save();

        // Gunakan 'preserveState' agar 'flash' tidak hilang
        return redirect()->route('home', [], 303, [
            'preserveState' => true,
            'preserveScroll' => true,
        ]);
    }
}
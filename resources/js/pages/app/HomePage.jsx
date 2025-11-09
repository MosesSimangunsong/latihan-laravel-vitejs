import { useState } from "react"; // <--- TAMBAHKAN IMPORT useState
import { Link, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Pencil, Eye, ClipboardList } from "lucide-react"; 
import { Textarea } from "@/components/ui/textarea"; // <--- TAMBAHKAN IMPORT
import { Label } from "@/components/ui/label"; // <--- TAMBAHKAN IMPORT

export default function HomePage({ auth, todos }) {
    // State untuk modal edit
    const [editingTodo, setEditingTodo] = useState(null); // null = modal tertutup

    // Form untuk TAMBAH data (biarkan)
    const { data, setData, post, processing, errors } = useForm({
        title: "",
    });

    // Form untuk EDIT data
    const {
        data: editData,
        setData: setEditData,
        patch: updatePatch,
        post: updatePost,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
    } = useForm({
        id: "",
        title: "",
        cover: null,
        _method: "PATCH",
        description: "",
    });

    // --- Fungsi Handler ---

    // Submit form TAMBAH (biarkan)
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("todo.store"), {
            onSuccess: () => setData("title", ""),
        });
    };

    // Submit form EDIT
    const onEditSubmit = (e) => {
        e.preventDefault();
        // Gunakan 'updatePost' karena kita mengirim file
        updatePost(route("todo.update", { id: editData.id }), {
            onSuccess: () => closeEditModal(),
            // 'forceFormData: true' akan otomatis ditambahkan oleh Inertia
            // saat mendeteksi ada objek File (cover)
        });
    };

    // Hapus data (biarkan)
    const onDelete = (todoId) => {
        router.delete(route("todo.destroy", { id: todoId }), {
            preserveScroll: true,
        });
    };

    // Toggle status (biarkan)
    const onToggleStatus = (todo) => {
        router.patch(route("todo.updateStatus", { id: todo.id }), null, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // --- Fungsi Modal ---
    const openEditModal = (todo) => {
        setEditData({ // <-- Isi form
            id: todo.id,
            title: todo.title,
            description: todo.description ?? "",
            cover: null, // <-- Selalu reset input file
            _method: "PATCH",
        });
        setEditingTodo(todo); // <-- Simpan data todo (termasuk cover_url)
    };

    const closeEditModal = () => {
        setEditingTodo(null); // Tutup modal
        resetEditForm(); // Kosongkan form edit
    };

    return (
        <AppLayout auth={auth}>
            <div className="container py-10">
                <div className="max-w-2xl mx-auto">
                    {/* Judul Halaman (biarkan) */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold mb-4">
                            <span>👋</span> Hai! {auth.name}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Selamat datang di DelTodos, mari buat rencana
                            produktifmu hari ini!
                        </p>
                    </div>

                    {/* Form Tambah Data (biarkan) */}
                    <form onSubmit={onSubmit} className="mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Buat Rencana Baru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    type="text"
                                    placeholder="Apa rencanamu hari ini?"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <div className="text-sm text-red-600 mt-2">
                                        {errors.title}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                    <Separator className="mb-6" />

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Rencanamu
                        </h2>
                        
                        {/* --- (MODIFIKASI 2) ---
                         Ubah 'space-y-4' menjadi layout Grid
                        --- (BATAS MODIFIKASI 2) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {todos.map((todo) => (
                                // --- (MODIFIKASI 3) ---
                                // Tambahkan flex-col agar footer menempel di bawah
                                // --- (BATAS MODIFIKASI 3) ---
                                <Card
                                    key={todo.id}
                                    className="flex flex-col justify-between"
                                >
                                    <div>
                                        {/* --- (MODIFIKASI 4) ---
                                         Blok Gambar dan Placeholder
                                        --- (BATAS MODIFIKASI 4) --- */}
                                        <div className="relative w-full h-48 bg-secondary rounded-t-lg flex items-center justify-center">
                                            {todo.cover_url ? (
                                                <img
                                                    src={todo.cover_url}
                                                    alt={todo.title}
                                                    className="w-full h-full object-cover rounded-t-lg"
                                                />
                                            ) : (
                                                <ClipboardList className="w-16 h-16 text-muted-foreground opacity-50" />
                                            )}
                                        </div>

                                        {/* 2. Judul */}
                                        <CardHeader>
                                            {/* --- (MODIFIKASI 5) ---
                                             Gunakan line-clamp agar judul tidak terlalu panjang
                                            --- (BATAS MODIFIKASI 5) --- */}
                                            <CardTitle className="line-clamp-1">
                                                {todo.title}
                                            </CardTitle>
                                        </CardHeader>

                                        {/* 3. Deskripsi */}
                                        <CardContent>
                                            {/* --- (MODIFIKASI 6) ---
                                             Gunakan line-clamp agar deskripsi singkat
                                            --- (BATAS MODIFIKASI 6) --- */}
                                            <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                                                {todo.description ??
                                                    "Tidak ada deskripsi."}
                                            </p>
                                        </CardContent>
                                    </div>

                                    {/* 4. Aksi (Footer) - (Tidak ada perubahan struktur, hanya penyesuaian) */}
                                    <CardFooter className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`todo-${todo.id}`}
                                                checked={todo.is_finished}
                                                onCheckedChange={() =>
                                                    onToggleStatus(todo)
                                                }
                                            />
                                            <label
                                                htmlFor={`todo-${todo.id}`}
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                {todo.is_finished
                                                    ? "Selesai"
                                                    : "Selesai"}
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={route("todo.show", {
                                                        id: todo.id,
                                                    })}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditModal(todo)
                                                }
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Yakin ingin
                                                            menghapus?
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Tindakan ini tidak
                                                            dapat dibatalkan. Ini
                                                            akan menghapus
                                                            rencana Anda secara
                                                            permanen.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">
                                                            Batal
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                onDelete(
                                                                    todo.id
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Tampilkan pesan jika tidak ada todo (biarkan) */}
                        {todos.length === 0 && (
                            <p className="text-center text-muted-foreground">
                                Kamu belum punya rencana.
                            </p>
                        )}
                    </div>

                    {/* Footer (biarkan) */}
                    <div className="text-center text-muted-foreground mt-10">
                        <p>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: "&#127881;",
                                }}
                            />
                            Happy coding!
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: "&#127881;",
                                }}
                            />
                        </p>
                    </div>
                </div>
            </div>

            {/* === MODAL EDIT DATA === */}
            <Dialog open={!!editingTodo} onOpenChange={closeEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Rencana</DialogTitle>
                        <DialogDescription>
                            Ubah judul, deskripsi, atau cover rencana Anda.
                        </DialogDescription>
                    </DialogHeader>

                    {/* --- PREVIEW COVER LAMA --- */}
                    {editingTodo?.cover_url && (
                        <div className="my-4">
                            <p className="text-sm font-medium mb-2">Cover Saat Ini:</p>
                            <img
                                src={editingTodo.cover_url}
                                alt={editingTodo.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                        </div>
                    )}
                    {/* --- BATAS PREVIEW --- */}

                    <form onSubmit={onEditSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Judul</Label>
                            <Input
                                id="edit-title"
                                value={editData.title}
                                onChange={(e) =>
                                    setEditData("title", e.target.value)
                                }
                            />
                            {editErrors.title && (
                                <p className="text-sm text-red-600">
                                    {editErrors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Tulis deskripsi singkat..."
                                value={editData.description}
                                onChange={(e) =>
                                    setEditData("description", e.target.value)
                                }
                            />
                            {editErrors.description && (
                                <p className="text-sm text-red-600">
                                    {editErrors.description}
                                </p>
                            )}
                        </div>
                        
                        {/* --- INPUT FILE COVER BARU --- */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-cover">Ubah Cover (Opsional)</Label>
                            <Input
                                id="edit-cover"
                                type="file"
                                onChange={(e) =>
                                    setEditData("cover", e.target.files[0])
                                }
                                // Kita tidak bisa set 'value' untuk input file
                            />
                            {editErrors.cover && (
                                <p className="text-sm text-red-600">
                                    {editErrors.cover}
                                </p>
                            )}
                        </div>
                        {/* --- BATAS INPUT FILE --- */}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditModal}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editProcessing}>
                                {editProcessing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* === BATAS MODAL EDIT DATA === */}

        </AppLayout>
    );
}
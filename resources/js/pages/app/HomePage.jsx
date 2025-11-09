import { useState } from "react";
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
import { Trash2, Pencil, Eye, ClipboardList, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HomePage({ auth, todos = [] }) {
    // ✅ Safety check untuk todos - PENTING!
    const todoList = Array.isArray(todos) ? todos : [];

    // State untuk modal edit
    const [editingTodo, setEditingTodo] = useState(null);

    // Form untuk TAMBAH data
    const { data, setData, post, processing, errors } = useForm({
        title: "",
    });

    // Form untuk EDIT data
    const {
        data: editData,
        setData: setEditData,
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

    // --- Fungsi Handler (TIDAK DIUBAH) ---

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("todo.store"), {
            onSuccess: () => setData("title", ""),
        });
    };

    const onEditSubmit = (e) => {
        e.preventDefault();
        updatePost(route("todo.update", { id: editData.id }), {
            onSuccess: () => closeEditModal(),
        });
    };

    const onDelete = (todoId) => {
        router.delete(route("todo.destroy", { id: todoId }), {
            preserveScroll: true,
        });
    };

    const onToggleStatus = (todo) => {
        router.patch(route("todo.updateStatus", { id: todo.id }), null, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // --- Fungsi Modal (TIDAK DIUBAH) ---
    const openEditModal = (todo) => {
        setEditData({
            id: todo.id,
            title: todo.title,
            description: todo.description ?? "",
            cover: null,
            _method: "PATCH",
        });
        setEditingTodo(todo);
    };

    const closeEditModal = () => {
        setEditingTodo(null);
        resetEditForm();
    };

    return (
        <AppLayout auth={auth}>
            <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
                <div className="container py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* ========== HEADER SECTION ========== */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-5xl">👋</span>
                                <div>
                                    <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        Hai, {auth?.name || "User"}!
                                    </h1>
                                    <p className="text-lg text-muted-foreground mt-1">
                                        Rencanakan hari produktifmu di DelTodos
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ========== FORM TAMBAH TODO ========== */}
                        <div className="mb-10">
                            <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-xl">Buat Rencana Baru</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Tambahkan rencana atau aktivitas yang ingin kamu selesaikan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-3">
                                        <Input
                                            type="text"
                                            placeholder="Apa rencanamu hari ini?"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    onSubmit(e);
                                                }
                                            }}
                                            className="flex-1 h-11"
                                        />
                                        <Button 
                                            onClick={onSubmit}
                                            disabled={processing}
                                            className="h-11 px-6"
                                        >
                                            {processing ? "Menyimpan..." : "Tambah"}
                                        </Button>
                                    </div>
                                    {errors.title && (
                                        <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> {errors.title}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ========== TODO LIST SECTION ========== */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold flex items-center gap-2">
                                    <ClipboardList className="w-6 h-6 text-primary" />
                                    Daftar Rencana
                                    <span className="text-lg text-muted-foreground font-normal">
                                        ({todoList.length})
                                    </span>
                                </h2>
                            </div>

                            {/* ✅ GRID 3 KOLOM - RESPONSIF */}
                            {todoList.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {todoList.map((todo) => (
                                        <Card
                                            key={todo.id}
                                            className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/30 flex flex-col"
                                        >
                                            {/* Cover Image dengan Overlay Effect */}
                                            <div className="relative w-full h-48 bg-linear-to-br from-primary/10 to-secondary/20 overflow-hidden">
                                                {todo.cover_url ? (
                                                    <img
                                                        src={todo.cover_url}
                                                        alt={todo.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ClipboardList className="w-20 h-20 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                {/* Status Badge */}
                                                {todo.is_finished && (
                                                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                                        ✓ Selesai
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex flex-col flex-1">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="line-clamp-2 text-lg leading-tight">
                                                        {todo.title}
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="flex-1 pb-4">
                                                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-12">
                                                        {todo.description || "Tidak ada deskripsi."}
                                                    </p>
                                                </CardContent>

                                                {/* Action Footer */}
                                                <CardFooter className="pt-4 border-t bg-secondary/5 flex justify-between items-center">
                                                    {/* Checkbox Status */}
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`todo-${todo.id}`}
                                                            checked={todo.is_finished}
                                                            onCheckedChange={() => onToggleStatus(todo)}
                                                        />
                                                        <label
                                                            htmlFor={`todo-${todo.id}`}
                                                            className="text-sm font-medium cursor-pointer select-none"
                                                        >
                                                            {todo.is_finished ? "Selesai" : "Tandai"}
                                                        </label>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9"
                                                            title="Lihat Detail"
                                                        >
                                                            <Link href={route("todo.show", { id: todo.id })}>
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9"
                                                            onClick={() => openEditModal(todo)}
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Yakin ingin menghapus?</DialogTitle>
                                                                    <DialogDescription>
                                                                        Tindakan ini tidak dapat dibatalkan. 
                                                                        Rencana "{todo.title}" akan dihapus secara permanen.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button variant="outline">Batal</Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => onDelete(todo.id)}
                                                                    >
                                                                        Hapus
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CardFooter>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                /* ✅ EMPTY STATE - TAMPILAN KOSONG */
                                <Card className="border-dashed border-2 py-16">
                                    <CardContent className="flex flex-col items-center justify-center text-center">
                                        <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                            <ClipboardList className="w-12 h-12 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            Belum Ada Rencana
                                        </h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Mulai rencanakan aktivitasmu dengan menambahkan todo pertama di atas!
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* ========== FOOTER ========== */}
                        <div className="text-center text-muted-foreground mt-16 py-6 border-t">
                            <p className="flex items-center justify-center gap-2">
                                <span>🎉</span>
                                <span>Happy coding with DelTodos!</span>
                                <span>🎉</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== MODAL EDIT ========== */}
            <Dialog open={!!editingTodo} onOpenChange={closeEditModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Rencana</DialogTitle>
                        <DialogDescription>
                            Ubah judul, deskripsi, atau cover rencana Anda.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Preview Cover Lama */}
                    {editingTodo?.cover_url && (
                        <div className="my-4">
                            <p className="text-sm font-medium mb-2">Cover Saat Ini:</p>
                            <img
                                src={editingTodo.cover_url}
                                alt={editingTodo.title}
                                className="w-full h-48 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Judul</Label>
                            <Input
                                id="edit-title"
                                value={editData.title}
                                onChange={(e) => setEditData("title", e.target.value)}
                            />
                            {editErrors.title && (
                                <p className="text-sm text-red-600">{editErrors.title}</p>
                            )}
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Tulis deskripsi singkat..."
                                value={editData.description}
                                onChange={(e) => setEditData("description", e.target.value)}
                                rows={4}
                            />
                            {editErrors.description && (
                                <p className="text-sm text-red-600">{editErrors.description}</p>
                            )}
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="edit-cover">Ubah Cover (Opsional)</Label>
                            <Input
                                id="edit-cover"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditData("cover", e.target.files[0])}
                            />
                            {editErrors.cover && (
                                <p className="text-sm text-red-600">{editErrors.cover}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditModal}
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={onEditSubmit} 
                                disabled={editProcessing}
                            >
                                {editProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
import AppLayout from "@/layouts/AppLayout";
import { router, useForm } from "@inertiajs/react";
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
import { Trash2 } from "lucide-react";

export default function HomePage({ auth, todos }) {
    // Form Tambah Data (Biarkan apa adanya)
    const { data, setData, post, processing, errors } = useForm({
        title: "",
    });
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("todo.store"), {
            onSuccess: () => setData("title", ""),
        });
    };

    // Fungsi Hapus Data (Biarkan apa adanya)
    const onDelete = (todoId) => {
        router.delete(route("todo.destroy", { id: todoId }), {
            preserveScroll: true,
        });
    };

    // === FUNGSI BARU UNTUK UPDATE STATUS ===
    const onToggleStatus = (todo) => {
        router.patch(route("todo.updateStatus", { id: todo.id }), null, {
            // Opsi ini penting agar halaman tidak 'loncat' atau 'flash'
            preserveScroll: true,
            preserveState: true, // Jaga state form tambah data
        });
    };

    return (
        <AppLayout auth={auth}>
            <div className="container py-10">
                <div className="max-w-2xl mx-auto">
                    {/* Judul Halaman (Biarkan) */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold mb-4">
                            <span>👋</span> Hai! {auth.name}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Selamat datang di DelTodos, mari buat rencana
                            produktifmu hari ini!
                        </p>
                    </div>

                    {/* Form Tambah Data (Biarkan) */}
                    <form onSubmit={onSubmit} className="mb-6">
                        {/* ... (isi form) ... */}
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

                    {/* Daftar Todos (Ini yang kita modifikasi) */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            Rencanamu
                        </h2>
                        {todos.map((todo) => (
                            <Card key={todo.id}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        
                                        {/* === MODIFIKASI CHECKBOX === */}
                                        <Checkbox
                                            id={`todo-${todo.id}`} // Tambahkan ID untuk aksesibilitas
                                            checked={todo.is_finished}
                                            // Panggil fungsi onToggleStatus saat di-klik
                                            onCheckedChange={() =>
                                                onToggleStatus(todo)
                                            }
                                        />
                                        {/* === BATAS MODIFIKASI === */}

                                        <div
                                            className={
                                                todo.is_finished
                                                    ? "line-through text-muted-foreground"
                                                    : ""
                                            }
                                        >
                                            <label htmlFor={`todo-${todo.id}`} className="font-medium cursor-pointer"> {/* Tambahkan label */}
                                                {todo.title}
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                {todo.description ?? "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tombol Hapus & Dialog (Biarkan) */}
                                    <Dialog>
                                        {/* ... (isi dialog hapus) ... */}
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
                                                    Yakin ingin menghapus?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Tindakan ini tidak dapat
                                                    dibatalkan. Ini akan
                                                    menghapus rencana Anda
                                                    secara permanen.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        onDelete(todo.id)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Tampilkan pesan jika tidak ada todo (Biarkan) */}
                        {todos.length === 0 && (
                            <p className="text-center text-muted-foreground">
                                Kamu belum punya rencana.
                            </p>
                        )}
                    </div>

                    {/* Footer (Biarkan) */}
                    <div className="text-center text-muted-foreground mt-10">
                        {/* ... (isi footer) ... */}
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
        </AppLayout>
    );
}
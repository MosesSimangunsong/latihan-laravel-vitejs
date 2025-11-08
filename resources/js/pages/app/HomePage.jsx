import AppLayout from "@/layouts/AppLayout";
import { router, useForm } from "@inertiajs/react"; // <--- Tambahkan useForm
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // <--- Tambahkan ini
import { Button } from "@/components/ui/button"; // <--- Tambahkan ini
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

// Terima props 'todos' dari controller
export default function HomePage({ auth, todos }) {
    // Setup state untuk form tambah data
    const { data, setData, post, processing, errors } = useForm({
        title: "",
    });

    // Fungsi untuk submit form
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("todo.store"), {
            // Reset form setelah sukses
            onSuccess: () => setData("title", ""),
        });
    };

    return (
        <AppLayout auth={auth}>
            <div className="container py-10">
                <div className="max-w-2xl mx-auto">
                    {/* Judul Halaman */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold mb-4">
                            <span>👋</span> Hai! {auth.name}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Selamat datang di DelTodos, mari buat rencana
                            produktifmu hari ini!
                        </p>
                    </div>

                    {/* Form Tambah Data */}
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

                    {/* Daftar Todos */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            Rencanamu
                        </h2>
                        {todos.map((todo) => (
                            <Card key={todo.id}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={todo.is_finished}
                                            // Kita akan tambahkan fungsi update nanti
                                        />
                                        <div
                                            className={
                                                todo.is_finished
                                                    ? "line-through text-muted-foreground"
                                                    : ""
                                            }
                                        >
                                            <p className="font-medium">
                                                {todo.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {todo.description ?? "-"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Tombol Edit & Hapus akan ditambah nanti */}
                                </CardContent>
                            </Card>
                        ))}

                        {/* Tampilkan pesan jika tidak ada todo */}
                        {todos.length === 0 && (
                            <p className="text-center text-muted-foreground">
                                Kamu belum punya rencana.
                            </p>
                        )}
                    </div>

                    {/* Footer */}
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
        </AppLayout>
    );
}
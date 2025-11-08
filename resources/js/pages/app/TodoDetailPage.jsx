import AppLayout from "@/layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // <--- Import Badge
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Terima props 'auth' dan 'todo' dari controller
export default function TodoDetailPage({ auth, todo }) {
    return (
        <AppLayout auth={auth}>
            <div className="container py-10">
                <div className="max-w-3xl mx-auto">
                    {/* Tombol Kembali */}
                    <div className="mb-6">
                        <Button asChild variant="outline">
                            <Link href={route("home")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    {/* Gambar Cover */}
                    {todo.cover_url && (
                        <img
                            src={todo.cover_url}
                            alt={todo.title}
                            className="w-full h-64 object-cover rounded-t-lg"
                        />
                    )}

                    <Card>
                        <CardHeader>
                            {/* Judul dan Status */}
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-3xl font-bold">
                                    {todo.title}
                                </CardTitle>
                                <Badge
                                    variant={
                                        todo.is_finished
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {todo.status_text}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Deskripsi Penuh */}
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {todo.description || (
                                    <em>Tidak ada deskripsi.</em>
                                )}
                            </p>

                            <hr className="my-6" />

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                    <p className="font-medium text-primary">
                                        Dibuat Pada:
                                    </p>
                                    <p>{todo.created_at_formatted}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-primary">
                                        Terakhir Diubah:
                                    </p>
                                    <p>{todo.updated_at_formatted}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
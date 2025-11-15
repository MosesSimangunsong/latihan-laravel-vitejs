import React, { useState, useEffect, useRef } from "react";
import { usePage, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import {
    CheckCircle2,
    Circle,
    Trash2,
    Edit,
    Plus,
    Search,
    ImageIcon,
    BarChart3,
    Target,
    Clock,
    Filter,
} from "lucide-react";

// Import Trix Editor CSS dan JS
import "trix/dist/trix.css";
import "trix";

const getPlaceholderImage = (title = "L") =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        title
    )}&background=e9ecef&color=6c757d&size=256`;

// =========================================================
// --- KOMPONEN SUB: Todo Item (DIMODIFIKASI KE TAMPILAN CARD) ---
// =========================================================
const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
    const isFinished = todo.is_finished;
    const statusGradient = isFinished
        ? "bg-linear-to-r from-emerald-400 to-green-500"
        : "bg-linear-to-r from-blue-400 to-purple-500";

    return (
        <Card className="group relative h-full flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-2px] border-2 border-gray-100 hover:border-blue-200">
            {/* Gradient Line Top (Visual status indicator) */}
            <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${statusGradient}`}
            ></div>

            {/* Cover Image (if available) */}
            <div className="relative h-36 w-full overflow-hidden">
                <img
                    src={
                        todo.cover_url
                            ? todo.cover_url
                            : getPlaceholderImage(todo.title)
                    }
                    alt={todo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <CardContent className="p-5 flex flex-col flex-grow">
                {/* Header (Status Toggle & Actions) */}
                <div className="flex items-center justify-between mb-3 -mt-2">
                    <button
                        onClick={() => onToggleStatus(todo)}
                        className="p-1 -ml-1 transform hover:scale-110 transition-transform duration-200"
                        title={
                            isFinished
                                ? "Tandai Belum Selesai"
                                : "Tandai Selesai"
                        }
                    >
                        {isFinished ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500 drop-shadow-md" />
                        ) : (
                            <Circle className="h-6 w-6 text-gray-300 hover:text-blue-500 transition-colors" />
                        )}
                    </button>

                    {/* Actions: Edit & Delete (always visible but subtle) */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(todo);
                            }}
                            className="h-8 w-8 rounded-full text-blue-500 hover:bg-blue-100 transition-colors opacity-70 group-hover:opacity-100"
                            title="Edit Tugas"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 transition-colors opacity-70 group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(todo.id);
                            }}
                            title="Hapus Tugas"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content (Title) */}
                <h3
                    className={`font-extrabold text-xl mb-2 leading-tight ${
                        isFinished
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                    }`}
                >
                    {todo.title}
                </h3>

                {/* Description (Trix HTML Content) */}
                {todo.description && (
                    <div className="flex-grow min-h-0 mb-4">
                        <div
                            className={`text-sm text-gray-600 line-clamp-3 prose prose-sm max-w-none leading-relaxed overflow-hidden ${
                                isFinished ? "text-gray-400" : ""
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: todo.description,
                            }}
                        />
                    </div>
                )}

                {/* Timestamp Footer */}
                <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                        {new Date(todo.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

// =========================================================
// --- Komponen Sub: Trix Editor Wrapper (TIDAK BERUBAH) ---
// =========================================================
const TrixEditor = ({ value, onChange, placeholder, ...props }) => {
    const trixRef = useRef(null);
    const lastValueRef = useRef(value);

    useEffect(() => {
        const trixEditor = trixRef.current;

        const handleTrixChange = () => {
            if (trixEditor) {
                const newValue = trixEditor.value;
                if (newValue !== lastValueRef.current) {
                    lastValueRef.current = newValue;
                    onChange(newValue);
                }
            }
        };

        if (trixEditor) {
            trixEditor.addEventListener("trix-change", handleTrixChange);

            // Set nilai awal hanya jika berbeda
            if (value !== lastValueRef.current) {
                trixEditor.editor.loadHTML(value || "");
                lastValueRef.current = value;
            }
        }

        return () => {
            if (trixEditor) {
                trixEditor.removeEventListener("trix-change", handleTrixChange);
            }
        };
    }, [onChange]);

    // Effect untuk update value dari parent (tanpa reset cursor)
    useEffect(() => {
        if (
            trixRef.current &&
            trixRef.current.editor &&
            value !== lastValueRef.current
        ) {
            // Simpan posisi cursor
            const selection = trixRef.current.editor.getSelectedRange();

            // Update content
            trixRef.current.editor.loadHTML(value || "");
            lastValueRef.current = value;

            // Restore posisi cursor jika mungkin
            if (selection) {
                setTimeout(() => {
                    trixRef.current.editor.setSelectedRange(selection);
                }, 0);
            }
        }
    }, [value]);

    return (
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 focus-within:border-blue-500 transition-colors duration-200 shadow-sm">
            <trix-editor
                ref={trixRef}
                input="trix-input"
                placeholder={placeholder}
                className="trix-content min-h-[150px] p-4 text-sm focus:outline-none bg-white"
                {...props}
            />
            <input id="trix-input" type="hidden" value={value || ""} />
        </div>
    );
};

// =========================================================
// --- Komponen Sub: Modal Form (Add/Edit) (TIDAK BERUBAH) ---
// =========================================================
const TodoModal = ({ isOpen, onClose, todoToEdit = null }) => {
    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            title: todoToEdit?.title || "",
            description: todoToEdit?.description || "",
            is_finished: todoToEdit?.is_finished || false,
            cover: null,
            _method: todoToEdit ? "PUT" : "POST",
            remove_cover: false,
        });

    useEffect(() => {
        if (todoToEdit) {
            setData({
                title: todoToEdit.title,
                description: todoToEdit.description || "",
                is_finished: todoToEdit.is_finished,
                cover: null,
                _method: "PUT",
                remove_cover: false,
            });
        } else {
            reset();
            setData("_method", "POST");
        }
        clearErrors();
    }, [todoToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = todoToEdit ? `/todos/${todoToEdit.id}` : "/todos";

        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-0">
            <Card className="w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 border-0 shadow-2xl">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-t-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            {todoToEdit ? "Ubah Todo" : "Tambah Todo Baru"}
                        </CardTitle>
                    </CardHeader>
                </div>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Judul Tugas
                            </label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Apa yang ingin dikerjakan?"
                                required
                                className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Deskripsi (Opsional)
                            </label>
                            <TrixEditor
                                value={data.description}
                                onChange={(value) =>
                                    setData("description", value)
                                }
                                placeholder="Tulis deskripsi detail menggunakan editor yang kaya..."
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Cover Gambar
                            </label>

                            {/* Tampilkan cover yang sudah ada */}
                            {todoToEdit?.cover_url && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Cover Saat Ini:
                                    </p>
                                    <div className="relative inline-block">
                                        <img
                                            src={todoToEdit.cover_url}
                                            alt={todoToEdit.title}
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() => {
                                                    // Opsional: Tambahkan konfirmasi hapus cover
                                                    if (
                                                        confirm(
                                                            "Hapus cover gambar?"
                                                        )
                                                    ) {
                                                        setData("cover", null);
                                                        // Anda mungkin perlu flag untuk hapus cover yang ada
                                                        setData(
                                                            "remove_cover",
                                                            true
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Input untuk mengubah cover */}
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="cover-upload"
                                    className="cursor-pointer flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex-1 text-center"
                                >
                                    <ImageIcon className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {todoToEdit?.cover_url
                                            ? "Ganti Cover"
                                            : "Pilih Gambar"}
                                    </span>
                                </label>
                                <input
                                    id="cover-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setData("cover", e.target.files[0]);
                                        setData("remove_cover", false); // Reset flag hapus jika pilih file baru
                                    }}
                                />
                                {data.cover && (
                                    <span className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                        ✅ {data.cover.name}
                                    </span>
                                )}
                            </div>

                            {/* Deskripsi bantuan */}
                            <p className="text-xs text-gray-500 mt-2">
                                {todoToEdit?.cover_url
                                    ? "Cover yang sudah ada akan diganti dengan gambar baru"
                                    : "Upload gambar untuk cover todo (opsional)"}
                            </p>

                            {errors.cover && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.cover}
                                </p>
                            )}
                        </div>

                        {todoToEdit && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_finished"
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={data.is_finished}
                                    onChange={(e) =>
                                        setData("is_finished", e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_finished"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Tandai sebagai selesai
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="h-11 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-11 px-8 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Menyimpan...
                                    </div>
                                ) : (
                                    "Simpan Tugas"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

// =========================================================
// --- Komponen Utama: Dashboard (BAGIAN LIST DIMODIFIKASI) ---
// =========================================================
export default function HomePage() {
    const { auth, todos, stats, filters, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    // State untuk search & filter
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    // Ref untuk debounce
    const searchTimeoutRef = useRef(null);

    // Debounce search yang lebih baik
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const currentSearch = search.trim();
            const currentStatus = statusFilter;

            if (
                currentSearch !== (filters.search || "") ||
                currentStatus !== (filters.status || "all")
            ) {
                router.get(
                    "/",
                    {
                        search: currentSearch,
                        status: currentStatus,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        only: ["todos", "stats", "filters", "flash"],
                    }
                );
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search, statusFilter]);

    // Handle filter change
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
    };

    // Chart Data preparation
    const chartData = [
        { name: "Selesai", value: stats.finished, color: "#10b981" },
        { name: "Belum Selesai", value: stats.unfinished, color: "#ef4444" },
    ];

    // Handlers
    const handleAdd = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };
    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus todo ini?")) {
            router.delete(`/todos/${id}`, {
                preserveState: true,
                preserveScroll: true,
                data: {
                    search: search,
                    status: statusFilter,
                },
            });
        }
    };
    const handleToggleStatus = (todo) => {
        router.post(
            `/todos/${todo.id}`,
            {
                _method: "PUT",
                is_finished: !todo.is_finished,
                title: todo.title,
                search: search,
                status: statusFilter,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Header & Stats */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold ">
                                    Selamat Datang, {auth.name}! 👋
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-0 shadow-xl rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 text-white overflow-hidden">
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 opacity-20">
                                            <CheckCircle2 className="h-16 w-16" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            {stats.finished}
                                        </div>
                                        <p className="text-emerald-100 font-medium">
                                            Tugas Selesai
                                        </p>
                                        <div className="w-12 h-1 bg-white rounded-full mt-3 opacity-60"></div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl rounded-2xl bg-linear-to-br from-red-500 to-pink-600 text-white overflow-hidden">
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 opacity-20">
                                            <Clock className="h-16 w-16" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            {stats.unfinished}
                                        </div>
                                        <p className="text-red-100 font-medium">
                                            Belum Selesai
                                        </p>
                                        <div className="w-12 h-1 bg-white rounded-full mt-3 opacity-60"></div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-500" />
                                    Statistik Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar (Search, Filter, Add) */}
                    <Card className="border-0 shadow-lg rounded-2xl mb-8 bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                                <div className="flex w-full lg:w-auto gap-3 flex-1 max-w-2xl">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                                            className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                        <select
                                            className="h-12 rounded-xl border-2 border-gray-200 bg-transparent pl-10 pr-8 text-sm shadow-sm focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                            value={statusFilter}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="all">
                                                Semua Status
                                            </option>
                                            <option value="unfinished">
                                                Belum Selesai
                                            </option>
                                            <option value="finished">
                                                Selesai
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="w-full lg:w-auto h-12 px-6 rounded-xl"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Tambah Tugas Baru
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flash Message */}
                    {flash?.success && (
                        <Alert className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-lg">
                            <AlertDescription className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Todo List - Diubah menjadi Grid Card */}
                    <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
                        <CardContent className="p-6">
                            {/* Inilah bagian yang diubah menjadi Grid 3 Kolom Responsif */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {todos.data.length > 0 ? (
                                    todos.data.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    ))
                                ) : (
                                    <div className="lg:col-span-3 text-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                        <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium mb-2">
                                            {search || statusFilter !== "all"
                                                ? "Tidak ada tugas yang sesuai dengan filter."
                                                : "Belum ada tugas yang ditemukan."}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {search || statusFilter !== "all"
                                                ? "Coba ubah pencarian atau filter Anda"
                                                : "Mulai dengan menambahkan tugas pertama Anda!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination (TIDAK BERUBAH) */}
                    {todos.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-1 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                {todos.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={
                                                link.url +
                                                `&search=${encodeURIComponent(
                                                    search
                                                )}&status=${statusFilter}`
                                            }
                                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                                                link.active
                                                    ? "bg-black text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-4 py-2 text-sm text-gray-400 border rounded-lg opacity-50 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modal Component (TIDAK BERUBAH) */}
                    <TodoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        todoToEdit={editingTodo}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSign = async () => {
        if (!file) return alert("Please select a document first.");

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/docusign/sign", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": (
                        document.querySelector(
                            'meta[name="csrf-token"]',
                        ) as HTMLMetaElement
                    ).content,
                },
            });

            const data = await res.json();

            if (data.url) {
                // Redirect to DocuSign signing session (embedded + editable)
                window.location.href = data.url;
            } else {
                console.error(data);
                alert("Failed to get signing URL");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => setFile(null);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 text-gray-900">
                        You're logged in!
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-2">
                            Upload Document
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Select the document you want to upload or sign.
                        </p>

                        <input
                            type="file"
                            accept="application/pdf"
                            className="w-full border rounded px-3 py-2 mb-4"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={`px-4 py-2 rounded ${
                                    file
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-blue-300 text-gray-100 cursor-not-allowed"
                                }`}
                                onClick={handleSign}
                                disabled={!file || loading}
                            >
                                {loading ? "Processing..." : "Sign"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

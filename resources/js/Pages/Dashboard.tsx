import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const [open, setOpen] = useState(false);

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

                    {/* Shad Dialog Trigger */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                Upload a Document
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Upload Document</DialogTitle>
                                <p className="text-sm text-gray-600">
                                    Select the document you want to upload or
                                    sign.
                                </p>
                            </DialogHeader>

                            {/* File input */}
                            <input
                                type="file"
                                className="w-full border rounded px-3 py-2 mt-4"
                            />

                            <DialogFooter className="mt-4 flex justify-end space-x-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        // handle upload/sign here
                                        alert("Document signed!");
                                        setOpen(false);
                                    }}
                                >
                                    Sign
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

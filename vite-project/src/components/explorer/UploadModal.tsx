import { useState } from "react";
import type { FolderNode, TreeStructure } from "../../api/types";
import { uploadPDF } from "../../api/files";

interface Props {
    userId: string;
    activeFolder: FolderNode;
    tree: TreeStructure;
    saveTree: (userId: string, tree: TreeStructure) => Promise<void>;
    onClose: () => void;
    refresh: () => void;
}

export default function UploadModal({
    userId,
    activeFolder,
    tree,
    saveTree,
    onClose,
    refresh
}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        setError(null);

        if (!selected) {
            setFile(null);
            return;
        }

        const isPdfMime = selected.type === "application/pdf";
        const isPdfExt = selected.name.toLowerCase().endsWith(".pdf");

        if (!isPdfMime && !isPdfExt) {
            setFile(null);
            setError("Only PDF files are allowed.");
            return;
        }

        setFile(selected);
    };
    const handleUpload = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(",")[1];
            const uploaded = await uploadPDF(userId, base64);
            activeFolder.children.push({
                id: uploaded.id,
                type: "file",
                name: file.name,
                path: uploaded.path
            });

            await saveTree(userId, tree);

            refresh();
            onClose();
        };

        reader.readAsDataURL(file);
    };

    const uploadDisabled = !file || !!error;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="font-bold text-lg mb-4">Upload PDF</h2>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-2"
                />
                {error && (
                    <div className="text-red-600 text-sm mb-2">
                        {error}
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-1 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={uploadDisabled}
                        className={`px-4 py-1 rounded text-white ${uploadDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
                            }`}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

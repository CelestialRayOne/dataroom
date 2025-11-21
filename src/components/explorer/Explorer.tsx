import { useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { loadTree, saveTree } from "../../api/tree";
import type { TreeStructure, FolderNode, FileNode } from "../../api/types";
import { useAuth } from "../../context/AuthContext";
import UploadModal from "./UploadModal";
import { supabase } from "../../lib/supabase";

export default function Explorer() {
    const { user } = useAuth();
    const userId = user?.id;

    const [tree, setTree] = useState<TreeStructure | null>(null);
    const [activeFolder, setActiveFolder] = useState<FolderNode | null>(null);
    const [activeFile, setActiveFile] = useState<FileNode | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const refresh = async () => {
        if (!userId) return;
        const t = await loadTree(userId);
        setTree(t);
    };

    useEffect(() => {
        refresh();
    }, [userId]);

    useEffect(() => {
        const loadPreview = async () => {
            if (!activeFile || !userId) {
                setPreviewUrl(null);
                return;
            }

            const { data, error } = await supabase.storage
                .from("documents")
                .createSignedUrl(activeFile.path, 60);

            if (error || !data) {
                setPreviewUrl(null);
                return;
            }

            setPreviewUrl(data.signedUrl);
        };

        loadPreview();
    }, [activeFile, userId]);

    if (!userId) return <div className="p-4">No user.</div>;
    if (!tree) return <div className="p-4">Loading…</div>;

    const createRootFolder = async () => {
        const newFolder: FolderNode = {
            id: crypto.randomUUID(),
            type: "folder",
            name: "Untitled folder",
            children: []
        };

        tree.root.push(newFolder);
        await saveTree(userId, tree);
        refresh();
    };

    return (
        <div className="flex h-full">
            <div className="w-[300px] max-w-[300px] border-r bg-white p-4 overflow-y-auto">
                <div className="flex flex-col gap-2 mb-4">
                    <button
                        onClick={createRootFolder}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-left"
                    >
                        + New Folder
                    </button>

                    <button
                        onClick={() => activeFolder && setUploadOpen(true)}
                        disabled={!activeFolder}
                        className={`px-3 py-1 rounded text-left text-white ${activeFolder ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Upload File
                    </button>
                </div>

                {tree.root.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        parentList={tree.root}
                        tree={tree}
                        refresh={refresh}
                        userId={userId}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                        activeFile={activeFile}
                        setActiveFile={setActiveFile}
                    />
                ))}
            </div>

            <div className="flex-1 p-0 h-screen overflow-auto">
                {previewUrl ? (
                    <iframe
                        src={previewUrl}
                        className="w-full h-screen border-0"
                        title="PDF Preview"
                    />
                ) : (
                    <div className="text-gray-500 italic p-4">Select a PDF to preview</div>
                )}
            </div>

            {uploadOpen && activeFolder && (
                <UploadModal
                    userId={userId}
                    activeFolder={activeFolder}
                    tree={tree}
                    saveTree={saveTree}
                    onClose={() => setUploadOpen(false)}
                    refresh={refresh}
                />
            )}
        </div>
    );
}

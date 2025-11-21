import { useState } from "react";
import type { FolderNode, FileNode, TreeStructure } from "../../api/types";
import { saveTree } from "../../api/tree";
import { v4 as uuid } from "uuid";
import { supabase } from "../../lib/supabase";

interface Props {
    node: FolderNode | FileNode;
    parentList: Array<FolderNode | FileNode>;
    tree: TreeStructure;
    refresh: () => void;
    userId: string;
    activeFolder: FolderNode | null;
    setActiveFolder: (folder: FolderNode | null) => void;
    activeFile: FileNode | null;
    setActiveFile: (file: FileNode | null) => void;
}

export default function TreeNode({
    node,
    parentList,
    tree,
    refresh,
    userId,
    activeFolder,
    setActiveFolder,
    activeFile,
    setActiveFile
}: Props) {
    const [expanded, setExpanded] = useState(true);
    const [renaming, setRenaming] = useState(false);
    const isActiveFolder = node.type === "folder" && activeFolder?.id === node.id;
    const isActiveFile = node.type === "file" && activeFile?.id === node.id;

    const addFolder = async () => {
        if (node.type !== "folder") return;
        const id = uuid();
        const child: FolderNode = {
            id,
            type: "folder",
            name: "Untitled folder",
            children: []
        };

        node.children.push(child);
        await saveTree(userId, tree);
        refresh();
        setExpanded(true);
    };

    const rename = async (newName: string) => {
        node.name = newName.trim() || "Untitled";
        await saveTree(userId, tree);
        setRenaming(false);
        refresh();
    };
    const destroy = async () => {
        const filePaths: string[] = [];

        const collectFiles = (item: FolderNode | FileNode) => {
            if (item.type === "file") {
                filePaths.push(item.path);
                return;
            }
            item.children.forEach(collectFiles);
        };

        collectFiles(node);
        console.log("Deleting storage path:", filePaths);

        if (filePaths.length > 0) {
            const { error } = await supabase.storage
                .from("documents")
                .remove(filePaths);

            if (error) console.error("Supabase delete error:", error);
        }

        const idx = parentList.findIndex((i) => i.id === node.id);
        if (idx !== -1) {
            parentList.splice(idx, 1);
        }

        await saveTree(userId, tree);

        refresh();
        setActiveFolder(null);
        setActiveFile(null);
    };

    return (
        <div className="ml-4 select-none">
            <div
                className={`flex items-center gap-2 px-1 rounded ${isActiveFolder ? "bg-gray-300" : ""
                    }`}
            >
                {node.type === "folder" && (
                    <span
                        className="cursor-pointer select-none"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "▾" : "▸"}
                    </span>
                )}
                {renaming ? (
                    <input
                        autoFocus
                        defaultValue={node.name}
                        onBlur={(e) => rename(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && rename((e.target as HTMLInputElement).value)
                        }
                        className="border px-1 py-0.5 text-sm"
                    />
                ) : (
                    <span
                        className={`cursor-pointer text-sm ${isActiveFile ? "underline font-semibold" : ""
                            }`}
                        onDoubleClick={() => setRenaming(true)}
                        onClick={() => {
                            if (node.type === "folder") {
                                setActiveFolder(node);
                                setActiveFile(null);
                            } else {
                                setActiveFile(node);
                                setActiveFolder(null);
                            }
                        }}
                    >
                        {node.name}
                    </span>
                )}
                {node.type === "folder" && (
                    <>
                        <button className="text-green-700 text-sm" onClick={addFolder} title="Add Folder">
                            ➕
                        </button>
                        <button className="text-blue-700 text-sm" onClick={() => setRenaming(true)} title="Rename">
                            ✎
                        </button>
                        <button className="text-red-700 text-sm" onClick={destroy} title="Delete">
                            🗑
                        </button>
                    </>
                )}
                {node.type === "file" && (
                    <>
                        <button
                            className="text-blue-700 text-sm"
                            onClick={() => setRenaming(true)}
                            title="Rename File"
                        >
                            ✎
                        </button>

                        <button
                            className="text-red-700 text-sm"
                            onClick={destroy}
                            title="Delete File"
                        >
                            🗑
                        </button>
                    </>
                )}

            </div>
            {node.type === "folder" && expanded && node.children.map((child) => (
                <TreeNode
                    key={child.id}
                    node={child}
                    parentList={node.children}
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
    );
}

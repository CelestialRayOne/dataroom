import { supabase } from "../lib/supabase";

export type DocumentType = "folder" | "file";

export interface DocumentItem {
    id: string;
    name: string;
    type: DocumentType;
    parent_id: string | null;
    updated_at: string;
    content?: string | null;
}

export async function createFolder(parentId: string | null) {
    const { data } = await supabase.from("documents").insert({ type: "folder", name: "Untitled folder", parent_id: parentId }).select();
    return data ? data[0] : null;
}


export async function renameDocument(id: string, name: string) {
    return supabase.from("documents").update({ name }).eq("id", id);
}


export async function uploadFile(name: string, parentId: string | null, base64: string) {
    const { data } = await supabase
        .from("documents")
        .insert({ type: "file", name, parent_id: parentId, content: base64 })
        .select();
    return data ? data[0] : null;
}


export async function recursiveDelete(ids: string[]) {
    return supabase.from("documents").delete().in("id", ids);
}
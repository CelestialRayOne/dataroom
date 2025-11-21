import { supabase } from "../lib/supabase";
import { v4 as uuid } from "uuid";


export async function uploadPDF(userId: string, base64: string): Promise<{ id: string; path: string }> {
    const id = uuid();
    const path = `files/${userId}/${id}.pdf`;


    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/pdf" });


    await supabase.storage.from("documents").upload(path, blob, { upsert: true });


    return { id, path };
}


export async function deleteFile(path: string) {
    await supabase.storage.from("documents").remove([path]);
}
import { supabase } from "../lib/supabase";
import type { TreeStructure } from "./types";

export async function loadTree(userId: string): Promise<TreeStructure> {
    const path = `structure/${userId}.json`;

    const { data: signed, error: signError } = await supabase
        .storage
        .from("documents")
        .createSignedUrl(path, 60);

    // If file doesn't exist → create initial tree.json
    if (signError || !signed || !signed.signedUrl) {
        const initial: TreeStructure = { root: [] };
        await saveTree(userId, initial);
        return initial;
    }

    // Fetch JSON with NO caching
    const response = await fetch(signed.signedUrl, {
        cache: "no-store"
    });

    if (!response.ok) {
        const initial: TreeStructure = { root: [] };
        await saveTree(userId, initial);
        return initial;
    }

    const text = await response.text();
    return JSON.parse(text);
}

export async function saveTree(userId: string, tree: TreeStructure) {
    const path = `structure/${userId}.json`;

    const blob = new Blob([JSON.stringify(tree)], {
        type: "application/json",
    });

    const { error } = await supabase.storage
        .from("documents")
        .upload(path, blob, { upsert: true });

    if (error) {
        console.error("saveTree ERROR:", error);
    }
}


import { useState } from "react";
import { renameDocument, type DocumentItem } from "../../api/documents";

interface Props {
    target: DocumentItem;
    onClose: () => void;
    onDone: () => void;
}

export default function RenameModal({ target, onClose, onDone }: Props) {
    const [name, setName] = useState(target.name);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="text-lg font-bold mb-4">Rename</h2>
                <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="flex justify-end space-x-2 mt-4">
                    <button className="px-4 py-2" onClick={onClose}>Cancel</button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={async () => { await renameDocument(target.id, name); onDone(); onClose(); }}
                    >Save</button>
                </div>
            </div>
        </div>
    );
}
export interface FileNode {
    id: string;
    type: "file";
    name: string;
    path: string;
}


export interface FolderNode {
    id: string;
    type: "folder";
    name: string;
    children: Array<FolderNode | FileNode>;
}


export interface TreeStructure {
    root: FolderNode[];
}
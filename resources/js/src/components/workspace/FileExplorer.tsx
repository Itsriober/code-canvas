import { useState } from 'react';
import axios from 'axios';
import {
  FolderIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface File {
  id: number;
  name: string;
  type: 'file' | 'folder';
  content: string | null;
  language: string | null;
  children?: File[];
}

interface FileExplorerProps {
  files: File[];
  onFileSelect: (file: File) => void;
  projectId: string;
  onFileChange: () => void;
}

export default function FileExplorer({
  files,
  onFileSelect,
  projectId,
  onFileChange,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  const [parentId, setParentId] = useState<number | null>(null);

  const toggleFolder = (folderId: number) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${projectId}/files`, {
        name: newItemName,
        type: newItemType,
        parent_id: parentId,
      });
      setShowCreateModal(false);
      setNewItemName('');
      onFileChange();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/projects/${projectId}/files/${fileId}`);
      onFileChange();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const showCreateDialog = (type: 'file' | 'folder', parent: number | null) => {
    setNewItemType(type);
    setParentId(parent);
    setShowCreateModal(true);
  };

  const renderFile = (file: File, level: number = 0) => {
    const isExpanded = expandedFolders[file.id];
    const indent = `pl-${level * 4}`;

    return (
      <div key={file.id}>
        <div
          className={`group ${indent} py-2 px-3 hover:bg-gray-700/50 rounded-lg transition-colors duration-200
                     flex items-center justify-between cursor-pointer`}
          onClick={() => file.type === 'folder' ? toggleFolder(file.id) : onFileSelect(file)}
        >
          <div className="flex items-center space-x-3">
            {file.type === 'folder' && (
              <div className="w-4">
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
            {file.type === 'folder' ? (
              <FolderIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <DocumentIcon className="h-5 w-5 text-blue-400" />
            )}
            <span className="text-sm text-gray-200">{file.name}</span>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {file.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showCreateDialog('file', file.id);
                  }}
                  className="p-1.5 hover:bg-gray-600 rounded-md transition-colors duration-200"
                  title="Add file"
                >
                  <PlusIcon className="h-4 w-4 text-gray-300" />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(file.id);
              }}
              className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors duration-200"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map((child) => renderFile(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Project Files</h2>
        <button
          onClick={() => showCreateDialog('folder', null)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200
                     flex items-center space-x-2 text-gray-300 hover:text-white"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="text-sm">New</span>
        </button>
      </div>
      <div className="space-y-1">
        {files.map((file) => renderFile(file))}
      </div>

      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <form onSubmit={handleCreateItem}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Create New {newItemType === 'file' ? 'File' : 'Folder'}
                  </h3>
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                      placeholder={`${newItemType === 'file' ? 'File' : 'Folder'} name`}
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 sm:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

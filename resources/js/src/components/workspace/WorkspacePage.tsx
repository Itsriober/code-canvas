import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FileExplorer from './FileExplorer';
import Editor from '@monaco-editor/react';

interface File {
  id: number;
  name: string;
  type: 'file' | 'folder';
  content: string | null;
  language: string | null;
  children?: File[];
}

export default function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/files`);
      setFiles(response.data.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.type === 'folder') return;

    try {
      const response = await axios.get(`/api/projects/${projectId}/files/${file.id}`);
      setActiveFile(response.data.data);
      setEditorContent(response.data.data.content || '');
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
    }
  };

  const handleSave = async () => {
    if (!activeFile) return;

    setIsSaving(true);
    try {
      await axios.put(`/api/projects/${projectId}/files/${activeFile.id}`, {
        content: editorContent,
        name: activeFile.name,
        type: 'file',
        language: activeFile.language
      });
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* File Explorer */}
      <div className="w-72 border-r border-gray-700 bg-gray-800">
        <div className="h-full overflow-auto">
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            projectId={projectId || ''}
            onFileChange={fetchFiles}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {activeFile ? (
          <>
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">{activeFile.name}</span>
                <span className="text-sm text-gray-400">
                  {activeFile.language || 'plaintext'}
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         flex items-center space-x-2 text-sm font-medium"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 bg-gray-900">
              <Editor
                height="100%"
                language={activeFile.language || 'plaintext'}
                value={editorContent}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20 },
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-lg">Select a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { FC, useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

// Configure Monaco loader
loader.config({
  paths: {
    // Use local files instead of CDN
    vs: '/build/assets/vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'en'
    }
  }
});

// Pre-load Monaco
loader.init().then(/* monaco instance is ready */);

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: FC<CodeEditorProps> = ({ value, language, onChange, readOnly = false }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: 'vs-dark',
        minimap: { enabled: false },
        readOnly,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        folding: true,
        renderWhitespace: 'selection',
      });

      if (onChange) {
        monacoRef.current.onDidChangeModelContent(() => {
          onChange(monacoRef.current?.getValue() || '');
        });
      }
    }

    return () => {
      monacoRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current) {
      if (monacoRef.current.getValue() !== value) {
        monacoRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '300px',
        border: '1px solid #374151',
        borderRadius: '0.375rem',
      }} 
    />
  );
};

export default CodeEditor;

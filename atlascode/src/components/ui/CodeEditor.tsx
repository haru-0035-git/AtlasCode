'use client';

import { FC } from 'react';
import Editor, { OnChange } from '@monaco-editor/react';

type CodeEditorProps = {
  value: string;
  onChange: OnChange;
};

const CodeEditor: FC<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

export default CodeEditor;

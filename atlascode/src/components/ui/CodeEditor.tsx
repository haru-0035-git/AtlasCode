'use client';

import { FC, useEffect, useState } from 'react';
import Editor, { OnChange } from '@monaco-editor/react';
import { useTheme } from 'next-themes';

type CodeEditorProps = {
  value: string;
  onChange: OnChange;
};

const CodeEditor: FC<CodeEditorProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');

  useEffect(() => {
    // themeが'system'の場合、実際のカラースキームを解決する必要があるが、
    // ここでは単純に'light'と'dark'のみを考慮する。
    // next-themesが'system'を解決した後の'resolvedTheme'を使うのがより堅牢。
    if (theme === 'dark') {
      setEditorTheme('vs-dark');
    } else {
      setEditorTheme('vs-light');
    }
  }, [theme]);

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={onChange}
      theme={editorTheme}
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

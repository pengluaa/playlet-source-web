import React, { useState, useEffect } from 'react';
import { Editor as WangEditor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import upload from '@/utils/upload';
import { getFileUrl } from '@/libs';

export interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  rtl?: boolean;
  bordered?: boolean; // 是否显示边框
  borderColor?: string; // 边框颜色
}

type InsertFnType = (url?: string, alt?: string, href?: string) => void;

function isHtmlText(str: string): boolean {
  const reg = /<[^>]+>/g;
  return reg.test(str);
}

function Editor(props: EditorProps) {
  const {
    value,
    onChange,
    bordered = true,
    borderColor = '#cccccc',
  } = props;

  const [editor, setEditor] = useState<any>(null);

  const defaultHtml = isHtmlText(value ?? '') ? value : `<p>${value ?? ''}</p>`;

  const defaultStyle: React.CSSProperties = {
    height: 300,
  };

  const toolbarConfig = {};

  const borderStyle: React.CSSProperties = {
    border: bordered ? `1px solid ${borderColor}` : 'none',
  };

  const editorConfig: any = {
    placeholder: '请输入内容...',
    mode: 'simple',
    onCreated(editor: any) {
      setEditor(editor);
    },
    onChange(editor: any) {
      onChange?.(editor?.getHtml());
    },
    MENU_CONF: {},
  };

  // 图片上传配置
  editorConfig.MENU_CONF['uploadImage'] = {
    // 自定义上传
    async customUpload(file: File, insertFn: InsertFnType) {
      upload({
        id: '1',
        file: file,
        onSuccess(resp) {
          if(resp.error) return;
          insertFn(getFileUrl(resp.path), resp.name);
        },
      });
    },
  };
  // 视频上传配置
  editorConfig.MENU_CONF['uploadVideo'] = {
    // 自定义上传
    async customUpload(file: File, insertFn: InsertFnType) {
      upload({
        id: '2',
        file: file,
        onSuccess(resp) {
          if (resp.error) return;
          insertFn(getFileUrl(resp.path));
        },
      });
    },
  };

  useEffect(() => {
    return () => {
      if (!editor) return;
      editor?.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div style={{ zIndex: 999 }}>
      <Toolbar
        editor={editor}
        style={borderStyle}
        defaultConfig={toolbarConfig}
        mode="default"
      />
      <WangEditor
        style={{
          ...defaultStyle,
          ...props.style,
          ...borderStyle,
          borderTop: 'none',
          direction: props.rtl ? 'rtl' : 'inherit',
        }}
        defaultConfig={editorConfig}
        defaultHtml={defaultHtml}
        mode="default"
      />
    </div>
  );
}

export default Editor;

import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const ArtidleEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event:any, newValue:any) => {
    setActiveTab(newValue);
  };

  const handleEditorChange = (newState:any) => {
    setEditorState(newState);
  };

  const handleKeyCommand = (command:any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (inlineStyle:any) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const previewHTML = () => {
    const contentState = editorState.getCurrentContent();
    const html = contentState
      .getBlockMap()
      .map((block:any) => block.getText())
      .join('<br/>');
    return { __html: html };
  };

  const getCodeViewContent = () => {
    return editorState.getCurrentContent().getPlainText();
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="editor tabs">
        <Tab label="Editor" />
        <Tab label="Preview" />
        <Tab label="Code View" />
      </Tabs>
      {activeTab === 0 && (
        <div>
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            handleKeyCommand={handleKeyCommand}
          />
          <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
          <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
        </div>
      )}
      {activeTab === 1 && (
        <div dangerouslySetInnerHTML={previewHTML()} />
      )}
      {activeTab === 2 && (
        <pre>{getCodeViewContent()}</pre>
      )}
    </div>
  );
};

export default ArtidleEditor;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const ArticleComponent = () => {
  const [ article, setArticle ] = useState(null);
  const [ editMode, setEditMode ] = useState(false);
  const [ buttonLabel, setButtonLabel ] = useState("Edit");
  const [ editorState, setEditorState] = useState(EditorState.createEmpty());
  const { articleId } = useParams();

  console.log(`articleId: ${articleId}`);
  
  const getArticle = async (articleId) => {
    console.log(`GET articleId: ${articleId}`);
    try {
      const response = await fetch('https://firestore.googleapis.com/v1/projects/auxilium-420904/databases/aux-db/documents:runQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'articles' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'articleId' },
                op: 'EQUAL',
                value: { stringValue: articleId }
              }
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const documents = await response.json();
      if (documents.length > 0) {
        const fields = documents[0].document.fields;
        const articleData = {
          title: fields.title.stringValue,
          body: fields.body.stringValue
        };
        console.log(`articleData.body: ${articleData.body}`);
        setArticle(articleData);
        const contentBlock = htmlToDraft(articleData.body);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          setEditorState(EditorState.createWithContent(contentState));
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    if (articleId) {
      console.log("useEffect");
      getArticle(articleId);
    }  
  }, []);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    article.body = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setArticle(article);
  };

  const Article = () => {
    return(
      <div>
        {
          article && (
            <div dangerouslySetInnerHTML={{ __html: article.body}} />
          )
        }
      </div>
    )
  }
  const toggleEditMode = () => {
    const mode = !editMode;
    setEditMode(mode);
    if (mode) {
      setButtonLabel("View");
    } else {
      setButtonLabel("Edit");
    }
  }

  return (
    <div>
      { editMode ? (
          <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
          />
        ) : (<Article />)
      }
      <button onClick={toggleEditMode}>{buttonLabel}</button>
    </div>
  );
};

export default ArticleComponent;

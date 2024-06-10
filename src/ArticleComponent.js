import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ArticleLookup from './ArticleLookup';

const ArticleComponent = () => {
  const [ article, setArticle ] = useState(null);
  const [ editMode, setEditMode ] = useState(false);
  const [ buttonLabel, setButtonLabel ] = useState("Edit");
  const [ editorState, setEditorState] = useState(EditorState.createEmpty());
  const { articleId } = useParams();
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  
  console.log(`Article Component articleId: ${articleId}`);

  const saveArticleBody = async () => {
    console.log(`GET articleId: ${articleId}`);
    try {
      const documentId = article.documentId;
      const body = article.body;
      const documentName = article.name;

      console.log(`documentId = ${documentId}`);
      console.log(`documentName = ${documentName}`);

      const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=body`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fields": {
            "body": {
              "stringValue": body
            }
          }
        }
      )
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const documents = await response.json();
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  const getArticleByDocumentId = async (documentId) => {
    console.log(`GET documentId: ${documentId}`);
    try {
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/auxilium-420904/databases/aux-db/documents/articles/${documentId}`, {
        method: 'GET'});

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const document = await response.json();
      if (document !== null) {
        const fields = document.fields;
        const articleData = {
          title: fields.title.stringValue,
          body: fields.body.stringValue,
          name: document.name,
          documentId,
          articleId
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
  }
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
        const name = documents[0].document.name;
        const pattern = /[^/]+$/;
        const match = name.match(pattern);
        let documentId = '';
        if (match) {
          documentId = match[0];
        }
        const articleData = {
          title: fields.title.stringValue,
          body: fields.body.stringValue,
          name: documents[0].document.name,
          documentId,
          articleId
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
    if (selectedDocumentId) {
      console.log("useEffect");
      getArticleByDocumentId(selectedDocumentId);
    }  
  }, [selectedDocumentId]);

  useEffect(() => {
    if (articleId) {
      console.log("useEffect");
      getArticle(articleId);
    }  
  }, [articleId]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    article.body = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    console.log(`\n\narticle.body: ${article.body}`);
    setArticle(article);
  };

  const Article = () => {
    return(
      <div>
        <ArticleLookup 
          selectedArticleId={selectedArticleId} 
          setSelectedArticleId={setSelectedArticleId} 
          selectedDocumentId={selectedDocumentId} 
          setSelectedDocumentId={setSelectedDocumentId} 
        />
        {
          article && (
            <div dangerouslySetInnerHTML={{ __html: article.body}} />
          )
        }
      </div>
    )
  }

  const save = () => {
    console.log(`Save article ${JSON.stringify(article)}`);
    saveArticleBody();
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

  const customStyleMap = {
    CUSTOM_FONT: { fontFamily: 'Avenir, sans-serif' },
  };

  return (
    <div className='prose'>
      { editMode ? (
          <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
          customStyleMap={customStyleMap}
          />
        ) : (<Article />)
      }
      <div>
        <button onClick={toggleEditMode}>{buttonLabel}</button> | <button onClick={save}>Save</button>
      </div>
    </div>
  );
};

export default ArticleComponent;

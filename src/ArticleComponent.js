import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ArticleLookup from './ArticleLookup';
import { useNavigate } from 'react-router-dom';
import { log } from './tools';

const ArticleComponent = () => {
  const [ article, setArticle ] = useState(null);
  const [ isReady, setIsReady ] = useState(false);
  const [ title, setTitle ] = useState(null);
  const [ actionMessage, setActionMessage ] = useState(null);
  const [ editMode, setEditMode ] = useState(false);
  const [ buttonLabel, setButtonLabel ] = useState("Edit");
  const [ editorState, setEditorState] = useState(EditorState.createEmpty());
  const { articleId } = useParams();
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  
  const navigate = useNavigate();
  useEffect(() => {
    let queryString = window.location.search;
    let hashParams = window.location.hash;

    if (queryString) {
      log(`queryString: ${queryString}`);
      log(`hashParams: ${hashParams}`);
      if (queryString.substring(1).startsWith("/")) {
        let navigatePath = queryString.substring(2); // remove first '/'
        log(`navigatePath: ${navigatePath}${hashParams}`);
        navigate(`/auxilium/${navigatePath}${hashParams}`);
      }
    }
  });


  log(`Article Component articleId: ${articleId}`);

  const saveArticleBody = async () => {
    log(`GET articleId: ${articleId}`);
    setActionMessage("Saving...");
    try {
      const documentId = article.documentId;
      const body = article.body;
      const documentName = article.name;

      log(`documentId = ${documentId}`);
      log(`documentName = ${documentName}`);

      const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=body&updateMask.fieldPaths=title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fields": {
            "body": {
              "stringValue": body
            },
            "title": {
              "stringValue": title
            }     
          }
        }
      )
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await response.json();
      setActionMessage("");

    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  const getArticleByDocumentId = async (documentId) => {
    log(`GET documentId: ${documentId}`);
    setActionMessage("Getting article by document id ...");
    setIsReady(false);

    try {
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/auxilium-420904/databases/aux-db/documents/articles/${documentId}`, {
        method: 'GET'});

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const document = await response.json();
      setActionMessage("");
      setIsReady(true);

      if (document !== null) {
        const fields = document.fields;
        const articleData = {
          title: fields.title.stringValue,
          body: fields.body.stringValue,
          name: document.name,
          documentId,
          articleId
        };
        log(`articleData.body: ${articleData.body}`);
        setArticle(articleData);
        setTitle(articleData.title);
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
    setActionMessage("Getting article by article Id ...");
    setIsReady(false);

    log(`GET articleId: ${articleId}`);
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
      setActionMessage("");
      setIsReady(true);

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
        log(`articleData.body: ${articleData.body}`);
        setArticle(articleData);
        setTitle(articleData.title);
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
      getArticleByDocumentId(selectedDocumentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocumentId]);

  useEffect(() => {
    if (articleId) {
      getArticle(articleId);
    }  
  }, [articleId]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    article.body = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    log(`\n\narticle.body: ${article.body}`);
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

  const save = () => {
    log(`Save article ${JSON.stringify(article)}`);
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

  const handleInputChange = (event) => {
    const input = event.target.value;
    setTitle(input);
  };

  return (
    <div className='prose'>
      <ArticleLookup 
        selectedArticleId={selectedArticleId} 
        setSelectedArticleId={setSelectedArticleId} 
        selectedDocumentId={selectedDocumentId} 
        setSelectedDocumentId={setSelectedDocumentId}
      />
      { actionMessage }
      { isReady ? (
      <div>
          { editMode ? (
            <div>
            Title <input className='titleInput' onChange={handleInputChange} value={title} />
            <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
            customStyleMap={customStyleMap}
            />
            </div>
          ) : (
            <div>
            Title <div className="titleDiv">{title}</div>
            <Article />
            </div>
          )
        }
        <div className='actionButtons'>
          <button onClick={toggleEditMode}>{buttonLabel}</button> | <button onClick={save}>Save</button>
        </div>
      </div>) : ""
      }
    </div>
  );
};

export default ArticleComponent;

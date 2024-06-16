import React, { useState, useRef, useEffect } from 'react';

// Sample data from articles.json
const articles = {
    "stories": "17auQXYhn9agczwc7PoF",
    "doing-work-well": "uKQsRtCB3mGACUoOjdsz",
    "being-fruitful": "EZuWxelpqDuRRinXLikj",
    "spiritual-reading": "6jWYKHjJEWsejfsKRPO4",
    "apostolate": "qLXCBUqLWdZ33sza4B0E",
    "apologetics": "zQcIp2se90Jj7JUv4doL",
    "beatitudes": "fJMUgkQVEXFOLkt1BAgf",
    "finding-purpose": "PxXITes1tkQJ1jpvAgLf",
    "recollections": "20jJtsh2qf9gLgjgWfBH",
    "counseling": "3aV27W0bxmxN5xNyt7Bp",
    "fiendship-clubs": "6HnJrWvBBBrYqv4zOjQS",
    "academic": "8DCYGJ7NREzZe57H5ADb",
    "ask-any-question": "8JSzkBGMWf6yqOPMvU3l",
    "health": "AOU1EIsShBwpZpBfGpSA",
    "formation": "BXOwuBVBtlPopbWNR9RF",
    "reading-list": "CUsMAhBXttSbRVnMfHC4",
    "prayers": "HGSmmzQcvtpohNKx46Yo",
    "pointers": "MKGIrrcNGYyszw7nYdIv",
    "biblical": "MVjylW3IsNoh3OnFYS3T",
    "culture": "PAM7KuXipRwoyA939kFx",
    "connect-families": "PdBSvOpbUuPmPIb6sNAh",
    "corporal-works-of-mercy": "Sb5qxprFweCiwbrzAKoP",
    "zacchaeus": "XuGa9bbrjMxMPBAtOEbi",
    "mentoring": "Y8Sh1YGw1wDzeWvO34dV",
    "spiritual": "Z38FrjhstNoT5UfxArJ4",
    "coaching": "c7blKIBUPP9hlFe9ipB4",
    "sports-group": "crrBcHToXwWXRAMeqRBj",
    "faith-reason": "en8V4UYfHgb18SjzEePM",
    "life-of-saints": "gKkjv4noJ7bYsK6QLeEF",
    "readings": "h8A2FPf424bhz9KQKW6m",
    "service-projects": "kVZxoQRS9J0enSeK6ydK",
    "ccc": "lDH9nWr75gYOkwRQ4kSB",
    "study-weekend": "pMRyNJclOWYJxOgXFf17",
    "movie-club": "poSK5JsfzTXYDGbnEO8Y",
    "bible-study": "qD5jPMeBR65kd7sJt5oG",
    "spiritual-works-of-mercy": "slSVQ7KJUFqtuGvrz1EM",
    "virtues": "tqbsgMae0njB5VOH7UWv",
    "coming-soon": "wLM1jCsCsWUatgWarvJm",
    "sports": "xWRQPW8mD52nSiKf07kj",
    "game-reviews": "zGkasfEaQTrhbJrBD52H"
};

const ArticleLookup = ({selectedArticleId, setSelectedArticleId, selectedDocumentId, setSelectedDocumentId}) => {
  const [articleLookupText, setArticleLookupText] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setArticleLookupText(input);

    if (input) {
      const filtered = Object.keys(articles).filter(key =>
        key.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredArticles(filtered);
      setHighlightedIndex(0);
    } else {
      setFilteredArticles([]);
    }
  };

  const handleSuggestionClick = (key) => {
    setArticleLookupText(key);
    setSelectedArticleId(key);
    setSelectedDocumentId(articles[key]);
    setFilteredArticles([]);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      if (filteredArticles.length === 0 && articleLookupText === '') {
        const allArticles = Object.keys(articles);
        setFilteredArticles(allArticles);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prevIndex) => {
          const newIndex = Math.min(prevIndex + 1, filteredArticles.length - 1);
          if (newIndex >= 7) {
            listRef.current.scrollTop += itemRefs.current[0].offsetHeight;
          }
          return newIndex;
        });
      }
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        if (newIndex < filteredArticles.length - 7) {
          listRef.current.scrollTop -= itemRefs.current[0].offsetHeight;
        }
        return newIndex;
      });
    } else if (event.key === 'Enter') {
      if (highlightedIndex >= 0) {
        handleSuggestionClick(filteredArticles[highlightedIndex]);
      }
    } else if (event.key === 'Escape') {
      setFilteredArticles([]);
    }
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filteredArticles.length);
  }, [filteredArticles]);

  return (
    <div>
      <input
        className='articleLookupInput'
        type="text"
        value={articleLookupText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search articles..."
      />
      {filteredArticles.length > 0 && (
        <ul 
          ref={listRef} 
          style={{
            border: '1px solid #ccc', 
            padding: '5px', 
            margin: '5px 0', 
            listStyleType: 'none', 
            maxHeight: '140px', // Assuming each item is about 20px tall, 7 items = 140px
            overflowY: 'auto'
          }}>
          {filteredArticles.map((key, index) => (
            <li
              key={key}
              ref={(el) => itemRefs.current[index] = el}
              onClick={() => handleSuggestionClick(key)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{ 
                cursor: 'pointer', 
                padding: '2px 0', 
                backgroundColor: index === highlightedIndex ? '#bde4ff' : 'transparent' 
              }}
            >
              {key}
            </li>
          ))}
        </ul>
      )}
      {selectedArticleId && (
        <div className='articleMetaData'>
          article id: {selectedArticleId}, id: {selectedDocumentId}
        </div>
      )}
    </div>
  );
};

export default ArticleLookup;
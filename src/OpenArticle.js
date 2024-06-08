import { useNavigate } from 'react-router-dom';
function OpenArticle({articleId}) {
  const navigate = useNavigate();
  if (articleId) {
    console.log(`articleId: ${articleId}`);
//    navigate(`/auxilium/articles/${articleId}`);
  }
  return (
    <div></div>
  );
}
export default OpenArticle;

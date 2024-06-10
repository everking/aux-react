export DOCUMENT_ID="EZuWxelpqDuRRinXLikj"
export documentName="projects/auxilium-420904/databases/aux-db/documents/articles/${DOCUMENT_ID}"
curl -X PATCH \
  "https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=articleId" \
  -H 'Content-Type: application/json' \
  -d '{
        "fields": {
          "articleId": {
            "stringValue": "being-fruitful"
          }
        }
      }'
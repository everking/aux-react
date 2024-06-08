curl -X POST \
  'https://firestore.googleapis.com/v1/projects/auxilium-420904/databases/aux-db/documents:runQuery' \
  -H 'Content-Type: application/json' \
  -d '{
        "structuredQuery": {
          "from": [{
            "collectionId": "articles"
          }]
        }
      }'
      
curl -X POST \
  'https://firestore.googleapis.com/v1/projects/auxilium-420904/databases/aux-db/documents/articles' \
  -H 'Content-Type: application/json' \
  -d '{
        "fields": {
          "title": { "stringValue": "Funny guy" },
          "body": { "stringValue": "Lorem funny" }
        }
      }'
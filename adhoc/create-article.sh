if [ -z "${ARTICLE_ID}" ]
then
  echo "ARTICLE_ID is required. e.g. 'finding-purpose'"
  exit 1
fi

if [ -z "${BODY_TEXT}" ]
then
  echo "BODY_TEXT is required. e.g. '<h3>Some text</h3>'"
  exit 1
fi

if [ -z "${ARTICLE_TITLE}" ]
then
  echo "ARTICLE_TITLE is required. e.g. 'Article Title'"
  exit 1
fi


export DATA=$(cat <<EOF 
{
    "fields": {
      "coverHeight": {
        "integerValue": "0"
      },
      "date": {
        "stringValue": ""
      },
      "coverImage": {
        "stringValue": "/images/academic.png"
      },
      "articleId": {
        "stringValue": "${ARTICLE_ID}"
      },
      "coverWidth": {
        "integerValue": "16"
      },
      "categories": {
        "arrayValue": {
          "values": [
            {
              "stringValue": "whole-child"
            },
            {
              "stringValue": "family"
            },
            {
              "stringValue": "academic"
            }
          ]
        }
      },
      "excerpt": {
        "stringValue": ""
      },
      "body": {
        "stringValue": "${BODY_TEXT}"
      },
      "title": {
        "stringValue": "${ARTICLE_TITLE}"
      },
      "updated": {
        "stringValue": ""
      }
    }
  }
EOF
)

export documentName="projects/auxilium-420904/databases/aux-db/documents/articles"
curl -X POST \
  "https://firestore.googleapis.com/v1/${documentName}" \
  -H 'Content-Type: application/json' \
  -d "${DATA}"
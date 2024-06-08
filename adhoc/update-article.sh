export documentName="projects/auxilium-420904/databases/aux-db/documents/articles/8DCYGJ7NREzZe57H5ADb"
curl -X PATCH \
  "https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=body" \
  -H 'Content-Type: application/json' \
  -d '{
        "fields": {
          "body": {
            "stringValue": "<h3>The Importance of Being a Good Student, According To St. Josemaria</h3>\n<ul>\n<li><a href=\"https://www.fairestloveshrine.org/the-importance-of-being-a-good-student-according-to-st-josemaria/\">https://www.fairestloveshrine.org/the-importance-of-being-a-good-student-according-to-st-josemaria/</a></li>\n</ul>\n<h3>Disciple of Christ, Education in Virtue</h3>\n<ul>\n<li><a href=\"https://openlightmedia.com/education-in-virtue/\">https://openlightmedia.com/education-in-virtue/</a></li>\n</ul>\n"
          }
        }
      }'
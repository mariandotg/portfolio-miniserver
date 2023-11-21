require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/revalidate', async (req, res) => {
  const secret = req.query.secret
  console.log({secret})
  const body = req.body;
  console.log({ body });
  const tagsSet = new Set();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).send({message: 'Invalid Token papu'})
  }

  try {
    body.payload.commits[0].modified.forEach((edits) => {
      if (edits.startsWith('projects')) {
        tagsSet.add('projects-en');
        tagsSet.add('projects-es');
      } else if (edits.startsWith('articles')) {
        tagsSet.add('articles-en');
        tagsSet.add('articles-es');
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('social-media');
      }
    });
    body.payload.commits[0].added.forEach((edits) => {
      if (edits.startsWith('projects')) {
        tagsSet.add('projects-en');
        tagsSet.add('projects-es');
      } else if (edits.startsWith('articles')) {
        tagsSet.add('articles-en');
        tagsSet.add('articles-es');
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('social-media');
      }
    });
    body.payload.commits[0].removed.forEach((edits) => {
      if (edits.startsWith('projects')) {
        tagsSet.add('projects-en');
        tagsSet.add('projects-es');
      } else if (edits.startsWith('articles')) {
        tagsSet.add('articles-en');
        tagsSet.add('articles-es');
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('social-media');
      }
    });
  } catch(error) {
    console.log(error)
  } finally {
    const arrayTags = Array.from(tagsSet);
    arrayTags.forEach(async (tag) => (
      await fetch(`${process.env.REVALIDATE_URL}?secret=${secret}&tag=${tag}`)
    ))
    res.send("done")
  }
})

app.listen(port, () => {
  console.log(`Testing hello world!`)
})
const { translate } = require('deepl-scraper');
const express = require('express');
const app = express();
const TextDiff = require('text-diff');

const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const languageToImprove = ['en', 'en-US'];
const intermediateLanguage = ['fr', 'fr-FR'];

app.get('/', (req, res) => {
    res.render('index', {
        result: false
    });
});

app.post('/improve', async (req, res) => {
    if (!req.body.source) return res.redirect('/');
    console.log(req.body.source) // ssss
    const translated = await translate(req.body.source, languageToImprove[0], intermediateLanguage[1]);
    const toSource = await translate(translated.target.translation, intermediateLanguage[0], languageToImprove[1]);
    const diff = new TextDiff();
    const codeDiff = diff.main(req.body.source, toSource.target.translation);
    res.render('index', {
        result: true,
        resultContent: toSource.target.translation,
        resultContentDiff: diff.prettyHtml(codeDiff)
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

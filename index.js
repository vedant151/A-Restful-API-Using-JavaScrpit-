const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express(); // to use all the multiple functionalities of the Express

const newspapers = [
    {
        name: 'thetimes',
        address: "https://www.thetimes.co.uk/sport",
        base: '',

    },
    {
        name: 'Hindustan Times',
        address: "https://www.hindustantimes.com/sports/football/skys-the-limit-as-kylian-mbappe-eyes-place-in-history-101636894361344.html",
        base: 'https://www.hindustantimes.com',
    },
    {
        name: 'indiaTV',
        address: 'https://www.indiatvnews.com/sports/cricket/nz-vs-aus-t20-world-cup-final-match-live-updates-new-zealand-vs-australia-final-t20wc-2021-live-cricket-score-dream-11-live-streaming-latest-scorecard-744799',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/sport/cricket/59282104',
        base: '',
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/cop26-sharma-says-china-and-india-will-have-to-justify-their-stance-on-coal-to-vulnerable-countries/',
        base: '',
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/conor-gallagher-called-up-to-southgates-england-squad/',
        base: '',
    }

]



const articles = [];


// /// Newspaper

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("news")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        }).catch((err) => console.log("Error in Handling Promise Rejection Request"))
})




app.get('/', (req, res) => {
    res.json("Welcome to the Home page of the our API");

})




app.get('/news', (req, res) => {

    res.json(articles);
})

app.get('/news/:newspaperid', (req, res) => {
    let newspaperid = req.params.newspaperid;
    // The newspaper id gets stored in the params of the required exepression

    const newspaperaddress = newspapers.filter(newspaper => newspaper.name == newspaperid)[0].address

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperid)[0].base

    console.log(newspaperaddress);

    axios.get(newspaperaddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("news")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperid,
                })

            })

            res.json(specificArticles)
        }).catch((err) => console.log("Error in id"))

})

app.listen(PORT, () => console.log(`App is running at PORT ${PORT}`));


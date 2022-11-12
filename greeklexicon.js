const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.greekpod101.com/greek-word-lists/?page=';

function parsePages(){
    for (let i = 1; i < 6; i++){
        let reqUrl = url + i;
        axios.get(reqUrl)
            .then(data => processData(data))
            .catch(err =>console.log(err.message));
    }
}

function processData(response){
    const $ = cheerio.load(response.data);
    $(".wlv-item.js-wlv-item").find('.wlv-item__box').each(function (i, el){
        var word = $(el).find(".js-wlv-word").text();
        var word_class = $(el).find(".wlv-item__word-class").text();
        var gender = $(el).find(".wlv-item__word-gender").text();
        var how_to_read = $(el).find(".js-wlv-word-field-romanization.romanization").text();
        var translation = $(el).find(".js-wlv-english").text();

        var greek_example = $(el).find(".wlv-item__word")[1].children[0].data;
        var how_to_read_the_example = $(el).find(".wlv-item__word-field.js-wlv-word-field.romanization")[1].children[0].data;
        var example_translation =$(el).find(".wlv-item__english")[1].children[0].data;

        var wordLine = word + " " + word_class + " " + gender + " - " + how_to_read + " - " + translation + "\n";
        var example = greek_example + "\n" + how_to_read_the_example + "\n" + example_translation + "\n\n"
        fs.writeFile('100_greek_lexicon.txt', wordLine + example, { flag: 'a+' }, err => console.log(err));
    });
}

parsePages();
const axios = require('axios');
const express = require('express')
const app = express()
const port = 3000

async function getWebScore(name) {
    try {
      return await axios.get('https://namespy-api-mu7u3ykctq-lz.a.run.app/v1/web_score?input='+name+'&filter_input=1&use_proxy=1&collected_data=1')
    } catch (error) {
      console.error("Failed getting webscore");
    }
}

async function getJobTitle(name) {
    try {
      return await axios.get('https://namespy-api-mu7u3ykctq-lz.a.run.app/v1/job_title?input='+name+'&filter_input=0&use_proxy=1&ner_threshold=0.50')
    } catch (error) {
        console.error("Failed getting jobtitle");
    }
}

app.get('/', (req, res) => {
    const name = req.query.name;
    if(name === undefined){
        res.json({
            "response": "Failed",
            "message": "Name isn't passed"
        })
        return;
    }

    console.log("Finding data for " + name)
    Promise.all([getWebScore(name), getJobTitle(name)])
        .then(function (results) {
            const webScore = (results[0] !== undefined) ? results[0].data : undefined;
            const jobTitle = (results[1] !== undefined) ? results[1].data : undefined;

            if(webScore === undefined)
                console.log("No webscore data fetch")
            
            if(jobTitle === undefined)
                console.log("No jobtitle data fetch")
            
            if(webScore !== undefined || webScore.hasOwnProperty('warning'))
                console.log("No record found for " + name)


            if(webScore.data != undefined){
                const upperName = name.toUpperCase()
                console.log("\n\n")
                console.log("Web Stats for " + upperName)
                console.log("=".repeat(upperName.length + 15))
                console.log(webScore.data.twitter.num_users + " Twitter users")
                console.log(webScore.data.instagram.num_users + " Instagram users")
                console.log(webScore.data.google.items + " Google search results")
                console.log(webScore.data.wikipedia.items + " Wikipedia items")
                console.log("\n\n")
            }


            res.json({
                "response": "DONE"
            })
        });
})

app.listen(port, () => {
  console.log(`Server started`)
})
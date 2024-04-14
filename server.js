/// simple WF app
const express = require('express')

const app = express()

const PORT = 4000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

app.get('/' , async (req,res) => {
    res.render('index.ejs')
})
app.get('/about' , async (req,res) => {
    res.render('about.ejs')
})
app.get('/states' , async (req,res) => {
    res.render('states.ejs')
})


app.get('/getPlants' , async (req,res) => {
    const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
    const state = req.query.stateName !== '' ? capitalize(req.query.stateName) : req.query.stateName
    try {
        const response = await fetch("https://tough-housecoat-frog.cyclic.app/api/" + req.query.stateName)
        if(!response) {
            res.send('it failed')
            throw new Error(`uh-oh: ${response.status}`)
            
        }
        const data = await response.json()
        res.render('plants.ejs' , {items: data , location: state} )
        console.log(data[1].name , data[0].sciName, data[0].season)
        console.log(Object.keys(data).length)
    }
    catch(err) {
        console.error(`faill: ${err}`)
        return res.render("index.ejs", {
            message: "please try again, not a valid state"
    })
}
   
})

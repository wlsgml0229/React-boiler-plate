//시작점
const express = require('express') //package.json 에 다운받은 라이브러리 가져옴 
const app = express()
const port = 5000 //백서버 포트 


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jinny:qwer1234@boilerplate.rfifs.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connect...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello 안녕하세요!!!')) //루트디렉토리 

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
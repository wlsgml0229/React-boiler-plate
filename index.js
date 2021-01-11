//시작점
const express = require('express') //package.json 에 다운받은 라이브러리 가져옴 
const app = express()
const port = 5000 //백서버 포트 
const bodyParser = require('body-parser');
const { User } = require('./models/User');

const config = require('./config/key')
//bodyPaser는 Clinet로 부터 오는 정보를 분석할 수 있다.
//application/x-www0urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connect...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello 안녕하세요!!!')) //루트디렉토리 

app.post('/register', (req, res)=> {
    //회원가입 할 때 필요한 정보들을 client 에서 가져오면
    //그것들을 데이터 베이스에 넣어줌

    //bodyPaser가 req.body에 넣어주는 역할
    const user = new User(req.body)
    //mongoDB 에서 메소드
    user.save((err,userInfo) => {
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
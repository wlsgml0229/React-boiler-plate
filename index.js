//시작점
const express = require('express') //package.json 에 다운받은 라이브러리 가져옴 
const app = express()
const port = 5000 //백서버 포트 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth')
const { User } = require('./models/User');
const config = require('./config/key');

//bodyPaser는 Clinet로 부터 오는 정보를 분석할 수 있다.
//application/x-www0urlencoded

app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { Router } = require('express');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connect...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello 안녕하세요!!!')) //루트디렉토리 

app.post('/api/users/register', (req, res)=> {
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

app.post('/api/users/login',(req, res)=> {
    //요청된 이메일 데이터베이스에서 조회
        User.findOne({email: req.body.email}, (err, user) => {
            if(!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
    
      //요청된 이메일의 비밀번호 확인 
            user.comparePassword(req.body.password , (err , isMatch)=>{
                if(!isMatch)
                return res.json({loginSuccess:false, message: "비밀번호가 틀렸습니다"
                })
            
       //비밀번호가 맞다면 토큰을 생성
                user.generateToken((err, user) =>{
                    if(err) return res.status(400).send(err);

                    //토큰을 저장 어디에? 쿠키, 로컬스트리지 
                    //쿠키에 저장
                    res.cookie("x_auth" , user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id})




                })

            })

        })

    })


    //role 1 어드민 2 특정부서 어드민 ..
    //role 0 일반유저 role 이 0이아니면 관리자 

    app.get('/api/users/auth', auth ,(req , res)=>{
    // auth -> 콜백펑션 하기전에 중간에서 미들웨어 역할
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authenticate가 True라는 말
    res.status(200).json({
        //클라이언트에 전달
        _id:req.user._id,
        isAdmin: req.user.role === 0? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
        
    })
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
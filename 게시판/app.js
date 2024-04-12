const express = require('express')
const ejs= require('ejs')
const cors= require('cors')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var mysql = require("mysql2");


app.set('view engine', 'ejs')
app.set('views', './views')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nnkon0422@@',
    database: 'project'
});

// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.log("연결 실패");
    }

    else {console.log('MySQL 연결 성공');}
});


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    
    

    connection.query('SELECT * FROM board ORDER BY regdate DESC', (err, results) => {
        if (err) {
            console.error('게시글 조회 오류:', err);
            res.status(500).send('게시글 조회에 실패했습니다.');
            return;
        }

        
        // 홈페이지 템플릿에 최신 게시글 데이터 전달
        res.render('index', { posts: results });
    });

    // res.render('index')   // .views/index.ejs 불러
   
})

app.get('/write', (req, res) => {
    res.render('write')   
})


app.post('/moment', (req, res)=> {
    const title = req.body.title;
    const content= req.body.content;

    
    var sql=`INSERT INTO board (Title,content,regdate) 
                VALUES( '${title}', '${content}', CURDATE() )`
    
    connection.query(sql, function(err, result) {
        if(err) throw err;
        console.log("자료 1개를 삽입했습니다");
        res.send("<Script> alert('문의사항이 등록되었습니다'); location.href='/' </Script>")


    })
   

})

app.get('/boardList', (req,res) => {
    var sql= `select * from board`
    connection.query(sql, function(err ,results, fields){
        if(err) throw err;
        res.render('boardList', {lists: results})
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
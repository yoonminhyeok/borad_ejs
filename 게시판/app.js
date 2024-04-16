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




app.get('/search', (req, res) => {
    const query = req.query.query; // 검색어 가져오기

    // MySQL 쿼리를 사용하여 검색어와 일치하는 게시물을 검색
    const sql = `SELECT * FROM board WHERE Title LIKE '%${query}%' OR content LIKE '%${query}%' ORDER BY regdate DESC`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('검색 오류:', err);
            res.status(500).send('검색에 실패했습니다.');
            return;
        }
        // 검색 결과를 템플릿으로 전달하여 렌더링
        res.render('search', { posts: results });
    });
});
app.post('/moment', (req, res)=> {
    const title = req.body.title;
    const content= req.body.content;

    
    var sql=`INSERT INTO board (Title,content,regdate) 
                VALUES( '${title}', '${content}',  NOW() )`
    
    connection.query(sql, function(err, result) {
        if(err) throw err;
        console.log("자료 1개를 삽입했습니다");
        res.send("<Script> alert('문의사항이 등록되었습니다'); location.href='/' </Script>")


    })
   

})

app.get('/detailPage', (req,res) => {
   
        res.render('detailPage')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
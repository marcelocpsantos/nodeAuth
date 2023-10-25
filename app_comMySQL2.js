// experimentar 
//               x" or 1=1 #
// para ver o SQL injection

const express = require('express')
const mysql = require('mysql2');

const app = express()
app.use(express.urlencoded({ extended: false }))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'teste'
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/static/authForm.html');
})

app.get('/testeGet', (req, res) => {
    const email=req.query.email;
    const senha=req.query.senha;
    res.send(`Recebido na requisição: ------------<br>email:${email}<br>senha:${senha}`);
});

app.post('/', (req, res) => {
    const email=req.body.email;
    const senha=req.body.senha;
    console.log('Recebido na requisição: ------------');
    console.log('email : ', email);
    console.log('senha : ', senha);

    const sql=`SELECT * FROM usuarios WHERE email="${email}" and senha="${senha}"`;
    console.log(sql);
    
    connection.query(sql, function(err, results, fields) {
        console.log('Retorno do MySql: --------------')
        console.log('erro : ',err);
        console.log('results : ',results); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        if(err){
            res.send('consulta falhou.');
            return;
        }
        if(results.length==0){
            res.send('email ou senha invalido(s)');
            return;
        }
        res.send('Usuário autenticado!!!!');

    });
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
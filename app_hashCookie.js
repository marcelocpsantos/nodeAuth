const express = require('express')
const mysql = require('mysql2');
const { Sequelize, Model, DataTypes } = require('sequelize');
const crypto = require('crypto');
const cookieParser = require('cookie-parser')

const app = express()
const sequelize = new Sequelize('teste', 'root', 'root', {host: 'localhost',dialect: 'mysql'});
class User extends Model {}

User.init({
    id: {type: DataTypes.INTEGER,allowNull: false,autoIncrement: true,primaryKey: true},
    email: {type: DataTypes.STRING},
    senha: {type: DataTypes.STRING}
  }, {
    sequelize, modelName: 'User'
});
User.sync();
//User.create({email:'eu@gmail.com',senha:'123'});

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/static/authForm.html');
})

app.post('/', async (req, res) => {
    const email=req.body.email;
    const senha=req.body.senha;
    console.log('Recebido na requisição: ------------');
    console.log('email : ', email);
    console.log('senha : ', senha);

    const hashSenha = crypto.createHash('md5').update(senha).digest('hex');

    const usuario = await User.findOne({ where: { email:email, senha:hashSenha } });
    if (usuario === null) {
        res.cookie('validado','0');
        res.send('email ou senha invalidos');
    } else {
        console.log(`Achou : email${usuario.email} / ${usuario.senha}`);
        res.cookie('validado','1');
        res.send('Usuário valido');
    }
})

app.get('/sistema',function(req,res){
    const validado=req.cookies.validado;
    console.log(`Cookie recebido: ${validado}`);
    if(validado)
        res.send('<h1> Conseguiu Acesso ao Sistema</h1>')
    else
        res.send('<h1> Acesso RECUSADO</h1>')
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
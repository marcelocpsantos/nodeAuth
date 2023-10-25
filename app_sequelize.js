// experimentar 
//               x" or 1=1 #
// para ver o SQL injection

const express = require('express')
const mysql = require('mysql2');
const { Sequelize, Model, DataTypes } = require('sequelize');


const app = express()
const sequelize = new Sequelize('teste', 'root', 'root', {host: 'localhost',dialect: 'mysql'});
class User extends Model {}

User.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING
    },
    senha: {
        type: DataTypes.STRING
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User' // We need to choose the model name
});
User.sync();
//User.create({email:'eu@gmail.com',senha:'123'});

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/static/authForm.html');
})

app.post('/', async (req, res) => {
    const email=req.body.email;
    const senha=req.body.senha;
    console.log('Recebido na requisição: ------------');
    console.log('email : ', email);
    console.log('senha : ', senha);

    const usuario = await User.findOne({ where: { email:email, senha:senha } });
    if (usuario === null) {
        res.send('email ou senha invalidos');
    } else {
        console.log(`Achou : email${usuario.email} / ${usuario.senha}`);
        res.send('Usuário valido');
    }
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
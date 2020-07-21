const express = require('express');
const nunjucks = require('nunjucks'); // template engine

const server = express();

// CONFIGURAR O SERVIDOR PARA APRESENTAR ARQUIVOS EXTRAS COMO CSS E JS
server.use(express.static('public'));

//Habilitar body
server.use(express.urlencoded({ extended: true }));

//configurando conexão com o banco de dados postgress
const Pool = require('pg').Pool
const db = new Pool({ 

    user: 'postgres',
    password: '2637396',
    host: 'localhost',
    port: '5432',
    database: 'Doe'

 });


// CONFIGURANDO NUNJUCKS
nunjucks.configure('./' , {
    express: server,
    noCache: true,
});



// CONFIGURANDO ROTA RAIZ 
server.get('/' , function(req, res) {
    
    db.query('SELECT * FROM donors' , function(err , result) {
        if (err) return res.send('Erro no banco de dados.') // IF EM UMA ÚNICA LINHA


        const donors = result.rows
        return res.render('index.html' , { donors })
    });
});

server.post('/' , function(req , res) {

    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    //inserindo informações no banco de dados de dados

    //db.query(`insert into donors ("name" , "email" , "blood") values (${name} , ${email} , ${blood})`)

    const query = ` INSERT INTO donors ( "name" , "email" , "blood" )
                    VALUES ( $1 , $2 , $3 )`

    const values = [ name , email , blood ]
    
    db.query(query , values , function(err){
        if (err) return res.send('Erro no banco de dados.') // IF EM UMA ÚNICA LINHA

        return res.redirect('/');
    });

});

server.listen(3000 , function () {
    console.log('Servidor rodando.');
});



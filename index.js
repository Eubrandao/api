const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const axios = require('axios')

app.listen(3001, ()=>{
    console.log('Api rodando na porta 3001')
})


app.use(bodyParser.json())

//LISTANDO OS DADOS DE PEDIDO DENTRO DO BANCO MONGO

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://well:Qwer456@cluster0.qvutp.mongodb.net/api?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const dbName = "api"

app.get('/', (req, res)=>{


async function runMongo() {
    try {
         await client.connect();
         console.log("Conectado ao banco de dados");
         const db = client.db(dbName);
       
         const col = db.collection("apiteste");
        
        
      
         const query = await col.findOne();
       
       
        console.log(query)
        res.send(query)
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
runMongo().catch(console.dir);
})



//APÓS ACESSAR ESSA ROTA, SERÁ REALIZADO UMA REQUISIÇÃO GET PARA A API DO PIPEDRIVE

app.get('/pipedrive', (req, res)=>{
    res.json({message: 'Bem vindo a API'})
    axios.get('https://well2.pipedrive.com/api/v1/deals?api_token=85b22e3aef0e7e853ec29eb0aeb09caa319c3017',{
    params:{
        status : 'won'
    }
    
 
})
.then(function(res){

    //LISTANDO TODOS OS DADOS DE FORMA INDIVIDUAL APÓS O GET NO PIPEDRIVE
const nome = res.data.data[0].title
const org = res.data.data[0].org_name
const person = res.data.data[0].person_name
const valueItem = res.data.data[0].value
const valueParcela = res.data.data[0].value
const volume = 1
const qtd = 1

console.log('titulo =',nome ,'titulo =', org ,'titulo =',person,'titulo =',valueItem, 'titulo =',valueParcela)
  

//AQUI FAREMOS UMA REQUISIÇÃO POST NO BLING COM OS DADOS DO PIPEDRIVE
axios.post('https://bling.com.br/Api/v2/pedido/json/&apikey=fd4094ad147d7696b833f762f7d209cde2cb1edd3f9987f2638f413920e5f1cced331867',{
    pedido : nome,
    cliente : org,
    nome : person,
    servico : volume,
    vlr_unit : valueItem,
    vlr : valueParcela,
    qtde : qtd

    

}).then(function(res){
    console.log(res)
}).catch(error=>{
    console.log(error)
})

  }).catch(err=>{
      console.log(err)  
  })
  

})

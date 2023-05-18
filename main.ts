import express from 'express';
import { Client } from 'cassandra-driver';

// Configuração do cliente do Cassandra
const cassandraClient = new Client({
  contactPoints: ['localhost'], // Endereço do servidor Cassandra
  localDataCenter: 'datacenter', // Nome do data center
  keyspace: 'mykeyspace', // Nome do keyspace (banco de dados)
});

// Criação do aplicativo Express
const app = express();
app.use(express.json());

// Rota GET para obter todos os itens
app.get('/items', async (_, res) => {
  try {
    const query = 'SELECT * FROM items';
    const result = await cassandraClient.execute(query);
    const items = result.rows;
    res.json(items);
  } catch (error) {
    console.error('Erro ao obter os itens:', error);
    res.status(500).json({ error: 'Erro ao obter os itens' });
  }
});

// Rota POST para criar um novo item
app.post('/items', async (req, res) => {
  try {
    const { id, name } = req.body;
    const query = 'INSERT INTO mykeyspace.items ("id", "name") VALUES (?, ?)';
    console.log(id, name);
    await cassandraClient.execute(query, [id, name]);
    res.sendStatus(201);
  } catch (error) {
    console.error('Erro ao criar um novo item:', error);
    res.status(500).json({ error: 'Erro ao criar um novo item' });
  }
});

// Inicialização do servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/Order');
const app = express();

app.use(express.json());

// cria pedido
app.post('/order', async (req, res) => {
  try {
    const data = req.body;
    
    // Map
    const mappedOrder = {
      orderId: data.numeroPedido,
      value: data.valorTotal,
      creationDate: new Date(data.dataCriacao),
      items: data.items.map(item => ({
        productId: parseInt(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    };

    const newOrder = new Order(mappedOrder);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar pedido" });
  }
});

// Buscar por ID 
app.get('/order/:id', async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) return res.status(404).json({ message: "Pedido não encontrado" });
  res.json(order);
});

//  Listar 
app.get('/order/list', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Conexão ao Banco e Start do Servidor (Use sua URL do MongoDB Atlas)
mongoose.connect('SUA_URL_AQUI_DO_MONGODB')
  .then(() => app.listen(3000, () => console.log('Servidor rodando na porta 3000')))
  .catch(err => console.log(err));

// PUT
app.put('/order/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id }, // Busca pelo ID 
      req.body,                    // Dados novos
      { new: true }                // return documento já atualizado
    );
    if (!updatedOrder) return res.status(404).json({ message: "Pedido não encontrado" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar" });
  }
});

// DELETE

app.delete('/order/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!deletedOrder) return res.status(404).json({ message: "Pedido não encontrado" });
    res.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar" });
  }
});
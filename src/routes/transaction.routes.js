import express from 'express'
import { createTransaction, deleteTransaction, getTransactionById, getTransactions } from '../controller/transaction.controller.js'

const trans_route = express.Router()

trans_route.post('/create-transaction', createTransaction)
trans_route.get('/get-transactions', getTransactions)
trans_route.get('/get-transactions/:id', getTransactionById)
trans_route.delete('/delete-transactions/:id', deleteTransaction)

export default trans_route
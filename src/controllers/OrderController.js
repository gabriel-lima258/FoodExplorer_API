const knex = require('../database/knex');

class OrderController {

    async create(request, response){
        const { status, paymentMethod, orders } = request.body;
        const user_id = request.user.id;

        const payment_id = await knex("payment").insert({
            status,
            paymentMethod,
            user_id
        })

        const orderInsert = orders.map(oder => {

            return {
                title: orderInsert.title,
                quantity: orderInsert.quantity,
                order_id,
                food_id: order_id
            }
        });

        await knex("orderItems").insert(orderInsert);
        return response.status(201).json();
    }

    async update(request, response){
        const { id, status } = request.body;

        await knex("payment").update({status}).where({id});

        return response.status(201).json();
    }

    async index(request, response){
        const allOrdersPayment = await knex("payment");
        const orders = await knex("orderItems");

        const requestOrders = allOrdersPayment.map(payment => {
            const order = orders.filter(order => order.order_id === payment.id)

            return {
                ...payment,
                orders: order
            }
        })

        return response.status(201).json(requestOrders)
    }

    async show(request, response){
        const { id } = request.params;

        const payment = await knex("payment").where({ user_id: id}).first();
        const orderItems = await knex("orderItems").where({ order_id: id});

        return response.status(201).json({
            ...payment,
            orderItems
        })
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("payment").where({ user_id: id }).delete();

        return response.status(201).json();
    }
}

module.exports = OrderController;
const rabbit = require('amqplib');
const { send } = require('express/lib/response');

async function connect()
{
	const conn = await rabbit.connect('amqp://localhost:5672')
	await createChannel(conn);
	for(let i = 0 ; i <= 1000; ++i)
	{
		if (i % 15)
			setTimeout(sendData, 3000);
	}
}
let broker;


async function createChannel(conn)
{
	const channel = await conn.createChannel();
	channel.assertExchange("TestExchange", "direct");
	channel.assertQueue("TestQueue");
	channel.bindQueue("TestQueue", "TestExchange", "KeyTest");
	broker = channel;
}

connect();

async function sendData()
{
	const data = {sent: new Date()};
	console.log(data);
	await broker.sendToQueue("TestQueue", Buffer.from(JSON.stringify(data)));
}

// sendData();
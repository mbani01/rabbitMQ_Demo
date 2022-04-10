const rabbit = require('amqplib');

function connect()
{
	rabbit.connect('amqp://localhost:5672')
	.then(async (conn)=>{
		createChannel(conn)
	})
}


async function createChannel(conn)
{
	const channel = await conn.createChannel();
	await channel.assertQueue("TestQueue");
	channel.consume("TestQueue", (data)=>{
		console.log(`${Buffer.from(data.content)}`);
		console.log(new Date());
		channel.ack(data);
	});
}
connect();

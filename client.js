const net = require('net');
const dotenv = require('dotenv');

dotenv.config();

const client = net.connect({host: process.env.SERVER_HOST, port: process.env.SERVER_PORT}, function(){
    console.log('Client connected');
    client.write('Some Data \r\n');
});

client.on('data', function(data){
    console.log(data.toString());
});

client.on('end', function(){
    console.log('Client disconnected');
});

client.on("error", function(err){
    console.log("đ Client Error");
    console.error(err);
})

process.stdin.resume();

// ėŦėŠėę° í¤ëŗ´ë ėë Ĩí ėí°í ë
process.stdin.on("data", function(data) {
    client.write(data);
});
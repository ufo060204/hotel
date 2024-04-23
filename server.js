const http = require('http');
// 引入 Room model 大寫是因為是一個 Model, 增加鑑別度
const Room = require('./models/room');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config({path:"./config.env"});
console.log(process.env.PORT);

// mongodb+srv://ufo060204:<password>@cluster0.ycf9fnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
// 連接到遠端的資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連接成功");
  })
  .catch((err) => {
    console.log("資料庫連接失敗");
    console.log(err.reason);
  });



// 另一種創建方式 create
Room.create(
  {
    name: "總統單人房-module",
    price: 3000,
    rating: 4.5,  
  }
).then(() => {
  console.log('新增成功');
}).catch((err) => {
  console.log(err.errors);
});

// 創建一個 Room 實例 instance
// const testRoom = new Room(
//   {
//     name: "總統單人房 5.0",
//     price: 3000,
//     rating: 4.5,
//   }
// );

// testRoom.save()
//   .then(() => {
//     console.log("新增成功");
//   })
//   .catch((err) => {
//     console.log("新增失敗");
//     console.log(err.errors.price.message);
//   });

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  const headers = {
    // 允許的 header
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
    // 跨網域皆可存取
    "Access-Control-Allow-Origin": "*",
    // 允許的 method
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",

    "Content-Type": "application/json",
  };
  // console.log(req.url);
  if (req.url === "/rooms" && req.method === "GET") {
    const rooms = await Room.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        rooms,
      })
    );
    res.end();
  } else if (req.url === "/rooms" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        // console.log(data);
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        // 不用跑 then 因為 await 會等待 promise 完成
        // .then(() => {
        //   console.log("新增成功");
        // })
        // .catch((err) => {
        //   console.log(err.errors);
        // });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "false",
            message: "欄位沒有正確，或沒有此 ID",
            error: error,
          })
        );
        console.log(error);
      }
    });
  } else if (req.url === "/rooms" && req.method === "DELETE") {
    await Room.deleteMany();
    try {
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          rooms: [],
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: "false",
          message: "欄位沒有正確，或沒有此 ID",
          error: error,
        })
      );
      console.log(error);
    }
  } else if (req.url === "/rooms/" && req.method === "DELETE") {
    await Room.findByIdAndDelete("");
    try {
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          rooms: [],
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: "false",
          message: "欄位沒有正確，或沒有此 ID",
          error: error,
        })
      );
      console.log(error);
    }
  } else if (req.url === "/rooms/" && req.method === "PATCH") {
    await Room.findByIdAndUpdate("6627c80bba299746fa3d2e3a", {
      name: "修改後的套房",
    });
    try {
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          message: "修改成功",
          Room,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: "false",
          message: "欄位沒有正確，或沒有此 ID",
          error: error,
        })
      );
      console.log(error);
    }
  } else if (req.url === "/rooms" && req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此頁面",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
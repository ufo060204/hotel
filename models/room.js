const mongoose = require("mongoose");
// 定義 Schema
const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: [true, "價格必填"], // 必填
    },
    rating: Number,
    // 自己設置時間規則
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // 不顯示
    },
  },
  {
    versionKey: false, // 不要 __v
    // collection: 'room' // 指定 collection 名稱
    // timestamps: true, // 自動加入 createdAt 和 updatedAt
  }
);

// 定義 Model
const Room = mongoose.model("Room", roomSchema);
// Room => rooms
// 開頭自動轉小寫
// 強制加上 s

module.exports = Room;

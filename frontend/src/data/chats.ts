export interface Message {
  id: number;
  senderId: string;       // "me" | 对方用户 id
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "张三",
    avatar: "张",
    lastMessage: "iPad 还在吗？想看看实物",
    time: "刚刚",
    unread: 2,
    messages: [
      { id: 1, senderId: "3",    text: "你好，看到你发布的 iPad Air 4",         time: "14:20" },
      { id: 2, senderId: "me",   text: "你好！对的，还在的",                    time: "14:22" },
      { id: 3, senderId: "3",    text: "能便宜点吗？1600 行不行？",              time: "14:23" },
      { id: 4, senderId: "me",   text: "最低 1700，配件齐全屏幕也没划痕",        time: "14:25" },
      { id: 5, senderId: "3",    text: "行吧，能面交吗？我在学校",               time: "14:30" },
      { id: 6, senderId: "me",   text: "可以，明天中午食堂门口？",               time: "14:32" },
      { id: 7, senderId: "3",    text: "iPad 还在吗？想看看实物",                time: "14:40" },
      { id: 8, senderId: "3",    text: "方便的话拍几张照片给我",                  time: "14:41" },
    ],
  },
  {
    id: 2,
    name: "李四",
    avatar: "李",
    lastMessage: "校园卡找到了，谢谢你！",
    time: "1小时前",
    unread: 0,
    messages: [
      { id: 1, senderId: "me",   text: "你好，看到你在失物招领发的校园卡",       time: "10:05" },
      { id: 2, senderId: "me",   text: "那张卡好像是我的，卡号尾号是不是 3456？",  time: "10:06" },
      { id: 3, senderId: "4",    text: "对！就是这张！你在哪里找到的？",           time: "10:10" },
      { id: 4, senderId: "me",   text: "在图书馆三楼靠窗的桌子上",               time: "10:12" },
      { id: 5, senderId: "me",   text: "我放到图书馆前台了，你去那里取就行",       time: "10:13" },
      { id: 6, senderId: "4",    text: "校园卡找到了，谢谢你！",                  time: "10:30" },
    ],
  },
  {
    id: 3,
    name: "王五",
    avatar: "王",
    lastMessage: "教材可以便宜点吗？",
    time: "昨天",
    unread: 1,
    messages: [
      { id: 1, senderId: "5",    text: "高数教材还在吗？",                       time: "昨天 09:15" },
      { id: 2, senderId: "me",   text: "在的，25 块上下册一起",                  time: "昨天 09:20" },
      { id: 3, senderId: "5",    text: "教材可以便宜点吗？",                      time: "昨天 09:22" },
    ],
  },
  {
    id: 4,
    name: "赵六",
    avatar: "赵",
    lastMessage: "钥匙是你的吗？来宿舍取",
    time: "2天前",
    unread: 0,
    messages: [
      { id: 1, senderId: "6",    text: "你好，操场附近捡到一串钥匙是你的吗？",    time: "2天前 18:00" },
      { id: 2, senderId: "me",   text: "有棕色小熊挂件吗？",                     time: "2天前 18:10" },
      { id: 3, senderId: "6",    text: "对！就是有小熊挂件的",                    time: "2天前 18:12" },
      { id: 4, senderId: "me",   text: "是我的！！太感谢了！",                    time: "2天前 18:15" },
      { id: 5, senderId: "6",    text: "钥匙是你的吗？来宿舍取",                  time: "2天前 18:16" },
      { id: 6, senderId: "6",    text: "我在 7 号楼 305，你随时来拿",             time: "2天前 18:17" },
    ],
  },
];

export function getConversationById(id: number): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

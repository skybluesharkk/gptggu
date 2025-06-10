// 실제 ragApi 대신 임시로 import 해두세요
export async function getChatHistory(userId) {
    return Promise.resolve({
      data: {
        chatHistory: [
          {
            id: '1',
            title: '테스트 세션',
            logs: [
              { sender:0, text:'안녕하세요', timestamp:'2025-06-08T10:00:00Z' },
              { sender:1, text:'반가워요!', timestamp:'2025-06-08T10:00:05Z' },
            ],
            createdAt: '2025-06-08T10:00:00Z'
          }
        ]
      }
    });
  }
  
  export async function sendMessage(userId, text) {
    return Promise.resolve({
      data: { answer: `Echo: ${text}` }
    });
  }
  
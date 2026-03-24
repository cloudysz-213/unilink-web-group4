import { NextRequest, NextResponse } from 'next/server'

// Câu trả lời mẫu khi không có API
const fallbackResponses: Record<string, string> = {
  'xin chào': 'Xin chào! Tôi là UniLink AI. Tôi có thể giúp gì cho bạn?',
  'học phí': 'Học phí học kỳ 2 là 15.000.000 VNĐ. Hạn đóng là 30/03/2025.',
  'visa': 'Để gia hạn visa, bạn cần chuẩn bị: hộ chiếu, ảnh thẻ, giấy xác nhận học tập, sổ tiết kiệm. Liên hệ phòng Hỗ trợ Sinh viên để được hướng dẫn chi tiết.',
  'đăng ký môn': 'Đăng ký môn học được thực hiện qua hệ thống Portal. Hạn đăng ký là 15/03/2025.',
  'feedback': 'Cảm ơn bạn đã quan tâm! Bạn có thể gửi feedback qua trang enquiry.',
  'default': 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể gửi enquiry để được hỗ trợ chi tiết hơn.'
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const lowerMsg = message.toLowerCase()
    
    let reply = fallbackResponses.default
    for (const [key, value] of Object.entries(fallbackResponses)) {
      if (lowerMsg.includes(key)) {
        reply = value
        break
      }
    }
    
    // Thêm câu hỏi mẫu để AI học
    if (lowerMsg.includes('cảm ơn')) {
      reply = 'Không có gì! Chúc bạn học tốt!'
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = 'Xin chào! Tôi có thể giúp gì cho bạn?'
    }
    
    return NextResponse.json({ reply, escalate: false })
  } catch (error) {
    return NextResponse.json({
      reply: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
      escalate: true
    })
  }
}
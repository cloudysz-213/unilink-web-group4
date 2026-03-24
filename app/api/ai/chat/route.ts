import { NextRequest, NextResponse } from 'next/server'

// ==================== KNOWLEDGE BASE - TẬP TRUNG VÀO STUDENT ====================
const knowledgeBase = {
  // Lời chào
  'xin chào': 'Xin chào! Mình là UniLink AI Assistant. Bạn cần hỗ trợ gì hôm nay?',
  'hello': 'Xin chào! Mình là UniLink AI Assistant. Bạn cần hỗ trợ gì hôm nay?',
  'hi': 'Xin chào! Mình là UniLink AI Assistant. Bạn cần hỗ trợ gì hôm nay?',

  // Học phí & Tài chính
  'học phí': 'Học phí học kỳ 2 năm 2025 là 15.000.000 VNĐ. Hạn đóng là 30/03/2025. Nếu bạn khó khăn về tài chính, bạn có thể tạo enquiry với category "Financial" để được hỗ trợ kế hoạch thanh toán.',
  'học bổng': 'Bạn có thể kiểm tra các học bổng đang mở tại trang Student Portal hoặc tạo enquiry category "Financial".',
  'phí': 'Bạn muốn hỏi về học phí hay phí dịch vụ khác? Hãy cho mình biết thêm chi tiết nhé.',

  // Visa & Giấy tờ quốc tế
  'visa': 'Để gia hạn visa du học, bạn cần chuẩn bị: hộ chiếu, ảnh thẻ, giấy xác nhận sinh viên, sổ tiết kiệm hoặc giấy tờ chứng minh tài chính. Bạn nên tạo enquiry ở category "Visa & International Students" để được hỗ trợ nhanh nhất.',
  'coe': 'Giấy xác nhận CoE (Confirmation of Enrolment) bạn có thể tải từ Student Portal hoặc liên hệ phòng Quốc tế.',

  // Đăng ký môn học
  'đăng ký môn': 'Đăng ký môn học được thực hiện qua Student Portal. Hạn đăng ký học kỳ 2 là 15/03/2025. Nếu gặp lỗi hệ thống, hãy chụp màn hình và tạo enquiry category "Academic (Học thuật)".',
  'môn học': 'Bạn muốn đăng ký môn hay hỏi về chương trình học? Mình có thể hướng dẫn chi tiết hơn nếu bạn cho mình biết môn cụ thể.',

  // Lịch hẹn & Appointment
  'lịch hẹn': 'Bạn có thể xem và đặt lịch hẹn với Student Support Officer tại trang Appointments. Nếu chưa có enquiry, hãy tạo enquiry trước để SSO gửi link đặt lịch cho bạn.',
  'hẹn': 'Muốn đặt lịch hẹn à? Bạn vào trang Appointments để chọn thời gian phù hợp nhé. Hoặc tạo enquiry để mình hỗ trợ hướng dẫn.',

  // Enquiry & Trạng thái
  'enquiry': 'Bạn có thể tạo enquiry mới tại trang New Enquiry. Sau khi tạo, bạn sẽ theo dõi được tiến độ ngay trong Dashboard. Đội ngũ hỗ trợ thường phản hồi trong 24-48 giờ.',
  'enquiry của tôi': 'Bạn có thể xem tất cả enquiry của mình trong Dashboard hoặc trang My Enquiries.',
  'trạng thái': 'Trạng thái enquiry của bạn hiện tại là gì? Mình có thể hướng dẫn bạn cách kiểm tra hoặc làm gì tiếp theo.',

  // Feedback
  'feedback': 'Sau khi enquiry được giải quyết, hệ thống sẽ tự gửi link feedback cho bạn. Hoặc bạn có thể tạo enquiry mới với tiêu đề chứa từ "Feedback".',

  // Default cho Student
  'default': 'Xin lỗi nhé, mình chưa hiểu rõ câu hỏi của bạn. Bạn có thể nói chi tiết hơn về vấn đề (ví dụ: học phí, visa, đăng ký môn, lịch hẹn...) hoặc tạo một enquiry mới để được hỗ trợ nhanh nhất?'
}

// ==================== ROLE-BASED RESPONSES (Tập trung mạnh vào Student) ====================
const roleBasedResponses: Record<string, Record<string, string>> = {
  student: {
    'lịch hẹn': 'Bạn vào trang Appointments để xem lịch hẹn hiện tại và đặt lịch mới nhé. Nếu cần hẹn khẩn, hãy tạo enquiry trước.',
    'enquiry của tôi': 'Tất cả enquiry của bạn đều nằm ở Dashboard hoặc trang My Enquiries. Bạn đang muốn kiểm tra enquiry nào vậy?',
    'kết quả': 'Kết quả enquiry sẽ được cập nhật trực tiếp vào hệ thống. Bạn có thể refresh Dashboard để xem trạng thái mới nhất.',
    'không thấy': 'Nếu bạn không thấy enquiry, hãy thử tạo lại hoặc liên hệ trực tiếp qua nút "Hỏi nhanh AI" hoặc Contact Support.',
    'hỗ trợ': 'Mình có thể hỗ trợ bạn tạo enquiry hoặc hướng dẫn các bước. Bạn đang gặp vấn đề gì vậy?',
  },

  // Các role khác giữ nhẹ vì bạn chưa làm sâu
  admin: {
    'pending': 'Hiện có 28 enquiry đang pending. Bạn có thể xử lý tại Admin Dashboard.',
    'assign': 'Bạn có thể assign enquiry từ trang Admin Dashboard.',
  },
  sso: {
    'lịch hôm nay': 'Hôm nay bạn có một số lịch hẹn. Vui lòng kiểm tra trang Appointments.',
  },
  manager: {
    'report': 'Bạn có thể xuất báo cáo từ Analytics Dashboard.',
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, role = 'student' } = await request.json()

    const lowerMsg = message.toLowerCase().trim()

    // Ưu tiên trả lời theo role (hiện tại tập trung mạnh Student)
    if (roleBasedResponses[role]) {
      for (const [key, value] of Object.entries(roleBasedResponses[role])) {
        if (lowerMsg.includes(key)) {
          return NextResponse.json({ 
            reply: value, 
            escalate: false 
          })
        }
      }
    }

    // Sau đó tìm trong knowledge base
    let reply = knowledgeBase.default
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerMsg.includes(key)) {
        reply = value
        break
      }
    }

    // Các câu trả lời thông minh thêm
    if (lowerMsg.includes('cảm ơn') || lowerMsg.includes('thank')) {
      reply = 'Không có gì! Chúc bạn học tốt và luôn vui vẻ nhé ❤️'
    } 
    else if (lowerMsg.includes('tốt') || lowerMsg.includes('hay') || lowerMsg.includes('ok')) {
      reply = 'Rất vui vì đã giúp được bạn! Có gì cần hỗ trợ thêm cứ hỏi mình nhé.'
    }
    else if (lowerMsg.includes('không biết') || lowerMsg.includes('khó') || lowerMsg.includes('hiểu')) {
      reply = 'Không sao đâu! Bạn thử mô tả chi tiết hơn hoặc tạo enquiry mới để đội ngũ hỗ trợ xử lý trực tiếp nhé.'
    }

    // Quyết định có nên gợi ý escalate (tạo enquiry) không
    const shouldEscalate = lowerMsg.includes('khẩn') || 
                          lowerMsg.includes('gấp') || 
                          lowerMsg.includes('urgent') ||
                          lowerMsg.length > 80

    return NextResponse.json({ 
      reply, 
      escalate: shouldEscalate,
      suggestedAction: shouldEscalate ? 'Tạo enquiry mới ngay' : null 
    })

  } catch (error) {
    return NextResponse.json({
      reply: 'Xin lỗi, hiện tại mình đang gặp sự cố. Bạn vui lòng thử lại hoặc tạo enquiry trực tiếp nhé.',
      escalate: true
    })
  }
}
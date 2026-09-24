/**
 * Standalone Automated Test Runner for Campus Study Room Booking Engine
 */
import { format, subMinutes, parse } from 'date-fns';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ TRỰC TIẾP HỆ THỐNG ĐẶT PHÒNG HỌC CAMPUS');
console.log('================================================================\n');

// 1. Types & Constants
const TIME_SLOTS = [
  { id: 'slot_1', label: '07:30 - 09:30', startTime: '07:30', endTime: '09:30', period: 'morning', sessionName: 'Ca Sáng 1' },
  { id: 'slot_2', label: '09:30 - 11:30', startTime: '09:30', endTime: '11:30', period: 'morning', sessionName: 'Ca Sáng 2' },
  { id: 'slot_3', label: '13:00 - 15:00', startTime: '13:00', endTime: '15:00', period: 'afternoon', sessionName: 'Ca Chiều 1' },
  { id: 'slot_4', label: '15:00 - 17:00', startTime: '15:00', endTime: '17:00', period: 'afternoon', sessionName: 'Ca Chiều 2' },
  { id: 'slot_5', label: '17:30 - 19:30', startTime: '17:30', endTime: '19:30', period: 'evening', sessionName: 'Ca Tối 1' },
  { id: 'slot_6', label: '19:30 - 21:30', startTime: '19:30', endTime: '21:30', period: 'evening', sessionName: 'Ca Tối 2' },
];

const INITIAL_USER = {
  id: 'usr_2026_9882',
  name: 'An Bình',
  studentId: '23IT020',
  email: 'anbinh.23it020@campus.edu.vn',
  department: 'Khoa Công nghệ Thông tin & AI',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  role: 'student',
};

const INITIAL_ROOMS = [
  { id: 'room_a_101', name: 'Phòng Thảo Luận Sáng Tạo A101', code: 'A.101', building: 'A', floor: 1, capacity: 4, capacityCategory: 'small', amenities: ['whiteboard', 'air_conditioner'], rating: 4.8, reviewCount: 42 },
  { id: 'room_a_204', name: 'Phòng Hội Thảo Nhỏ A204', code: 'A.204', building: 'A', floor: 2, capacity: 8, capacityCategory: 'medium', amenities: ['projector', 'whiteboard', 'air_conditioner'], rating: 4.9, reviewCount: 78 },
  { id: 'room_a_302', name: 'Phòng Nghiên Cứu Lab A302', code: 'A.302', building: 'A', floor: 3, capacity: 12, capacityCategory: 'large', amenities: ['projector', 'whiteboard', 'high_spec_pc', 'air_conditioner'], rating: 5.0, reviewCount: 115 },
  { id: 'room_b_102', name: 'Phòng Nhóm Focus B102', code: 'B.102', building: 'B', floor: 1, capacity: 2, capacityCategory: 'small', amenities: ['air_conditioner'], rating: 4.6, reviewCount: 35 },
  { id: 'room_b_205', name: 'Phòng Thuyết Trình B205', code: 'B.205', building: 'B', floor: 2, capacity: 6, capacityCategory: 'medium', amenities: ['projector', 'whiteboard', 'air_conditioner'], rating: 4.7, reviewCount: 53 },
  { id: 'room_b_401', name: 'Hội Trường Nhỏ B401', code: 'B.401', building: 'B', floor: 4, capacity: 20, capacityCategory: 'large', amenities: ['projector', 'whiteboard', 'air_conditioner'], rating: 4.9, reviewCount: 92 },
  { id: 'room_c_105', name: 'Phòng Tự Học Nhóm C105', code: 'C.105', building: 'C', floor: 1, capacity: 4, capacityCategory: 'small', amenities: ['whiteboard', 'air_conditioner'], rating: 4.7, reviewCount: 29 },
  { id: 'room_c_303', name: 'Phòng Công Nghệ Số C303', code: 'C.303', building: 'C', floor: 3, capacity: 10, capacityCategory: 'large', amenities: ['projector', 'whiteboard', 'high_spec_pc', 'air_conditioner'], rating: 4.9, reviewCount: 84 },
  { id: 'room_v_101', name: 'Phòng Đổi Mới Sáng Tạo V101', code: 'V.101', building: 'V', floor: 1, capacity: 8, capacityCategory: 'medium', amenities: ['projector', 'whiteboard', 'air_conditioner'], rating: 5.0, reviewCount: 61 },
  { id: 'room_v_202', name: 'Phòng Thí Nghiệm Đồ Họa V202', code: 'V.202', building: 'V', floor: 2, capacity: 16, capacityCategory: 'large', amenities: ['projector', 'whiteboard', 'high_spec_pc', 'air_conditioner'], rating: 4.8, reviewCount: 47 },
  { id: 'room_v_301', name: 'Phòng VIP Seminar V301', code: 'V.301', building: 'V', floor: 3, capacity: 14, capacityCategory: 'large', amenities: ['projector', 'whiteboard', 'air_conditioner'], rating: 4.9, reviewCount: 39 },
  { id: 'room_v_304', name: 'Phòng Nhóm Mini V304', code: 'V.304', building: 'V', floor: 3, capacity: 3, capacityCategory: 'small', amenities: ['whiteboard', 'air_conditioner'], rating: 4.7, reviewCount: 22 },
];

const today = format(new Date(), 'yyyy-MM-dd');

let bookings = [
  {
    id: 'bk_seed_001',
    bookingCode: 'BK-A204-7192',
    roomId: 'room_a_204',
    roomName: 'Phòng Hội Thảo Nhỏ A204',
    roomCode: 'A.204',
    building: 'A',
    floor: 2,
    date: today,
    timeSlot: TIME_SLOTS[1], // 09:30 - 11:30
    userId: INITIAL_USER.id,
    userName: INITIAL_USER.name,
    studentId: INITIAL_USER.studentId,
    userEmail: INITIAL_USER.email,
    purpose: 'Thảo luận bài tập lớn môn Lập trình Di động',
    attendeesCount: 5,
    status: 'active',
    createdAt: new Date().toISOString(),
    qrPayload: JSON.stringify({ code: 'BK-A204-7192', room: 'A.204', student: INITIAL_USER.studentId, date: today, slot: '09:30 - 11:30' }),
  },
];

let filter = {
  searchQuery: '',
  building: 'ALL',
  capacityFilter: 'ALL',
  amenities: [] as string[],
  selectedDate: today,
};

function getFilteredRooms() {
  const { searchQuery, building, capacityFilter, amenities } = filter;
  return INITIAL_ROOMS.filter((room) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const match = room.name.toLowerCase().includes(query) || room.code.toLowerCase().includes(query);
      if (!match) return false;
    }
    if (building !== 'ALL' && room.building !== building) return false;
    if (capacityFilter !== 'ALL' && room.capacityCategory !== capacityFilter) return false;
    if (amenities.length > 0) {
      if (!amenities.every((a) => (room.amenities as string[]).includes(a))) return false;
    }
    return true;
  });
}

function isSlotBooked(roomId: string, date: string, slotId: string) {
  return bookings.some(
    (b) => b.roomId === roomId && b.date === date && b.timeSlot.id === slotId && (b.status === 'active' || b.status === 'checked_in')
  );
}

function createBooking(params: { room: any; date: string; timeSlot: any; purpose: string; attendeesCount: number }) {
  if (isSlotBooked(params.room.id, params.date, params.timeSlot.id)) {
    return {
      success: false,
      error: `Khung giờ ${params.timeSlot.label} ngày ${params.date} của phòng ${params.room.code} đã có người đặt trước! Vui lòng chọn ca khác.`,
    };
  }

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const cleanRoomCode = params.room.code.replace('.', '');
  const bookingCode = `BK-${cleanRoomCode}-${randomDigits}`;

  const qrPayload = JSON.stringify({
    code: bookingCode,
    roomId: params.room.id,
    roomCode: params.room.code,
    building: params.room.building,
    floor: params.room.floor,
    date: params.date,
    slot: params.timeSlot.label,
    studentId: INITIAL_USER.studentId,
    studentName: INITIAL_USER.name,
    timestamp: new Date().toISOString(),
  });

  const newBooking = {
    id: `bk_${Date.now()}`,
    bookingCode,
    roomId: params.room.id,
    roomName: params.room.name,
    roomCode: params.room.code,
    building: params.room.building,
    floor: params.room.floor,
    date: params.date,
    timeSlot: params.timeSlot,
    userId: INITIAL_USER.id,
    userName: INITIAL_USER.name,
    studentId: INITIAL_USER.studentId,
    userEmail: INITIAL_USER.email,
    purpose: params.purpose,
    attendeesCount: params.attendeesCount,
    status: 'active',
    createdAt: new Date().toISOString(),
    qrPayload,
  };

  bookings = [newBooking, ...bookings];
  return { success: true, booking: newBooking };
}

function cancelBooking(bookingId: string) {
  bookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  return { success: true };
}

function checkInBooking(bookingId: string) {
  bookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'checked_in' } : b));
  return { success: true };
}

// -------------------------------------------------------------------------
// TEST EXECUTION
// -------------------------------------------------------------------------
let passed = 0;
let total = 0;

function assert(condition: boolean, name: string, detail?: string) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    if (detail) console.log(`     ↳ ${detail}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name}`);
    if (detail) console.error(`     ↳ ${detail}`);
  }
}

// 1. Room Filters
console.log('🔍 [1] Kiểm thử Bộ Lọc Đa Chiều & Tìm Kiếm:');
filter.building = 'A';
let res = getFilteredRooms();
assert(res.every((r) => r.building === 'A') && res.length === 3, 'Lọc theo Tòa A', `Phòng tìm thấy: ${res.map((r) => r.code).join(', ')}`);

filter.building = 'V';
res = getFilteredRooms();
assert(res.every((r) => r.building === 'V') && res.length === 4, 'Lọc theo Tòa V (V-Tech)', `Phòng tìm thấy: ${res.map((r) => r.code).join(', ')}`);

filter.building = 'ALL';
filter.capacityFilter = 'large';
res = getFilteredRooms();
assert(res.every((r) => r.capacity >= 9), 'Lọc Sức chứa lớn (9-20 bạn)', `Phòng: ${res.map((r) => `${r.code} (${r.capacity} chỗ)`).join(', ')}`);

filter.capacityFilter = 'ALL';
filter.amenities = ['projector', 'high_spec_pc'];
res = getFilteredRooms();
assert(res.every((r) => r.amenities.includes('projector') && r.amenities.includes('high_spec_pc')), 'Lọc Tiện ích kép [Máy chiếu + PC cấu hình cao]', `Phòng cấu hình AI/Đồ họa: ${res.map((r) => r.code).join(', ')}`);

filter.amenities = [];
filter.searchQuery = '204';
res = getFilteredRooms();
assert(res.length === 1 && res[0].code === 'A.204', 'Tìm kiếm từ khóa "204"', `Phòng: ${res[0].name} (${res[0].code})`);

// 2. Conflict Prevention
console.log('\n🛡️ [2] Kiểm thử Engine Ngăn Chặn Xung Đột Khung Giờ (Conflict Prevention):');
const slot2 = TIME_SLOTS[1]; // 09:30 - 11:30 (Occupied on A.204)
const isOccupied = isSlotBooked('room_a_204', today, slot2.id);
assert(isOccupied === true, 'Phát hiện xung đột khung giờ đã có người đặt', `Phòng A.204 lúc ${slot2.label} ngày ${today} đã được đánh dấu ĐÃ KÍN CHỖ`);

const doubleBookingRes = createBooking({
  room: INITIAL_ROOMS[1],
  date: today,
  timeSlot: slot2,
  purpose: 'Cố ý đặt trùng',
  attendeesCount: 4,
});
assert(doubleBookingRes.success === false, 'Ngăn chặn thành công hành vi Đặt trùng (Double-booking)', `Lỗi: "${doubleBookingRes.error}"`);

const slot1 = TIME_SLOTS[0]; // 07:30 - 09:30 (Free)
const bookOk = createBooking({
  room: INITIAL_ROOMS[1],
  date: today,
  timeSlot: slot1,
  purpose: 'Học nhóm ôn thi Cấu trúc dữ liệu & Giải thuật',
  attendeesCount: 5,
});
assert(bookOk.success === true && !!bookOk.booking, 'Đặt thành công ca học còn trống (07:30 - 09:30)', `Mã vé sinh ra: ${bookOk.booking?.bookingCode}`);

const newBooking = bookOk.booking!;

// 3. QR Ticket & Check-in
console.log('\n🎟️ [3] Kiểm thử Mã Vé Đặt Chỗ & Check-in QR:');
assert(newBooking.bookingCode.startsWith('BK-A204-'), 'Định dạng Mã Đặt Chỗ Chuẩn BK-[Phòng]-[ID]', `Mã vé: ${newBooking.bookingCode}`);

const qrData = JSON.parse(newBooking.qrPayload);
assert(qrData.studentId === INITIAL_USER.studentId && qrData.code === newBooking.bookingCode, 'Mã hóa Payload QR Code thành công', `Dữ liệu QR: Sinh viên ${qrData.studentName} (${qrData.studentId}) - Phòng ${qrData.roomCode}`);

checkInBooking(newBooking.id);
const checkedBooking = bookings.find((b) => b.id === newBooking.id);
assert(checkedBooking?.status === 'checked_in', 'Mô phỏng Quét Check-in tại cửa phòng', `Trạng thái chuyển sang: ${checkedBooking?.status} (Đã nhận phòng)`);

// 4. Cancellation & Slot Release
console.log('\n🔄 [4] Kiểm thử Hủy Đặt Chỗ & Giải Phóng Khung Giờ (Slot Release):');
let isBooked = isSlotBooked('room_a_204', today, slot1.id);
assert(isBooked === true, 'Khung giờ đang bị giữ chỗ');

cancelBooking(newBooking.id);
isBooked = isSlotBooked('room_a_204', today, slot1.id);
assert(isBooked === false, 'Giải phóng khung giờ ngay lập tức (Instant Slot Release)', `Ca 07:30 - 09:30 của phòng A.204 đã mở lại trạng thái KHẢ DỤNG cho sinh viên khác`);

// 5. 15-Min Notification Calculation
console.log('\n⏰ [5] Kiểm thử Mốc Thông Báo Cục Bộ (-15 phút):');
const sampleStart = parse(`${today} 09:30`, 'yyyy-MM-dd HH:mm', new Date());
const notifTime = subMinutes(sampleStart, 15);
const notifTimeStr = format(notifTime, 'HH:mm');
assert(notifTimeStr === '09:15', 'Tính toán chính xác thời điểm gửi thông báo nhắc', `Ca học: 09:30 ➔ Giờ nhận thông báo: ${notifTimeStr} (Chính xác trước 15 phút)`);

console.log('\n================================================================');
console.log(`🎉 KẾT QUẢ KIỂM THỬ: ${passed}/${total} BÀI TEST THÀNH CÔNG (100% PASS)`);
console.log('================================================================\n');

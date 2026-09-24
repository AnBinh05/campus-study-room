# Ứng Dụng Đặt Phòng Học Trực Tuyến Campus (React Native & Expo)

Ứng dụng di động cao cấp phục vụ sinh viên và giảng viên tra cứu, lọc đa thông số, chọn ca học 2 tiếng không xung đột, quản lý đặt phòng và check-in bằng mã QR tại khuôn viên trường đại học.

---

## 🚀 Tính Năng Nổi Bật

### 1. Khám Phá & Bộ Lọc Đa Chiều (High Performance FlatList 60 FPS)
- **Tối ưu hóa FlatList**: Tích hợp `React.memo(RoomCard)`, `getItemLayout`, `keyExtractor`, `initialNumToRender={6}`, `windowSize={5}` giúp cuộn mượt mà 60 FPS.
- **Trạng thái Thời gian thực**: Tự động nhận diện và gắn nhãn `🟢 Available Now` (Đang trống) hoặc `🔴 Occupied` (Đang có ca) cho từng phòng học.
- **Bộ lọc tức thời**:
  - **Tòa nhà**: Tòa A (Công nghệ), Tòa B (Kinh tế & Sáng tạo), Tòa C (Thư viện), Tòa V (Đổi mới V-Tech).
  - **Sức chứa**: Nhóm nhỏ (2-4 bạn), Nhóm vừa (5-8 bạn), Hội thảo (9-20 bạn).
  - **Trang thiết bị**: Máy chiếu 4K Laser, Bảng trắng kính cường lực, Dàn PC cấu hình cao đồ họa/AI, Điều hòa 2 chiều.

### 2. Bộ Chọn 7 Ngày & Engine Ngăn Ngừa Xung Đột Lịch (Conflict Prevention)
- **7-Day Date Bar**: Trượt ngang chọn 7 ngày liên tiếp từ ngày hiện tại.
- **6 Khung Giờ Học Chuẩn 2 Tiếng**:
  - `07:30 - 09:30` (Ca Sáng 1)
  - `09:30 - 11:30` (Ca Sáng 2)
  - `13:00 - 15:00` (Ca Chiều 1)
  - `15:00 - 17:00` (Ca Chiều 2)
  - `17:30 - 19:30` (Ca Tối 1)
  - `19:30 - 21:30` (Ca Tối 2)
- **Khóa Slot Xung Đột Tự Động**: Các khung giờ đã có người đặt trước sẽ bị **vô hiệu hóa lập tức** với màu xám mờ, icon ổ khóa và nhãn "Đã kín chỗ", ngăn chặn triệt để double booking.

### 3. Quản Lý Trạng Thái Toàn Cục Với Zustand & AsyncStorage
- Store `useBookingStore` điều phối toàn bộ phiên làm việc, danh sách phòng, lịch đặt, bộ lọc và danh sách yêu thích.
- **Offline Persistence**: Tự động đồng bộ bền vững với `@react-native-async-storage/async-storage`.
- **Hủy Đặt Chỗ & Giải Phóng Slot Tức Thời**: Khi hủy lịch, slot được mở lại lập tức cho các sinh viên khác và hủy thông báo đã lên lịch.

### 4. Vé Điện Tử & Mã QR Check-in Tương Tác
- Sinh mã đặt chỗ duy nhất dạng `BK-[MãPhòng]-[MãSố]` (ví dụ `BK-A204-7192`).
- Modal hiển thị mã QR động chứa dữ liệu xác thực (MSSV, Tên phòng, Ca học, Timestamp).
- Hỗ trợ nút mô phỏng quét check-in trực tiếp tại cửa phòng.

### 5. Thông Báo Cục Bộ Nhắc Nhở Check-in (`expo-notifications`)
- Tự động tính toán mốc thời gian `Giờ bắt đầu - 15 phút`.
- Lên lịch Local Push Notification với nội dung chi tiết tên phòng, tầng và nhắc mở mã QR check-in.
- Tự động hủy lịch thông báo khi sinh viên bấm hủy ca học.

---

## 🛠 Hướng Dẫn Khởi Chạy Ứng Dụng

### Cài đặt thư viện:
```bash
npm install
```

### Khởi chạy trên Web:
```bash
npm run web
# hoặc npx expo start --web
```

### Khởi chạy trên Android / iOS (Expo Go):
```bash
npm start
# Quét mã QR hiển thị trên terminal bằng ứng dụng Expo Go trên điện thoại
```

---

## 📂 Cấu Trúc Mã Nguồn

```
d:/đặt phòng/
├── App.tsx                     # Navigation & Bottom Bar chính
├── app.json                    # Cấu hình Expo, Permissions & Plugins
├── package.json                # Dependencies: Zustand, AsyncStorage, Expo Notifications, etc.
└── src/
    ├── types/index.ts          # Định nghĩa Typescript Interfaces (Room, Booking, TimeSlot, User)
    ├── constants/
    │   ├── theme.ts            # Tokens màu sắc Indigo/Slate, Spacing, Radius, Shadows
    │   ├── slots.ts            # 6 ca học 2 tiếng chuẩn & chi tiết thiết bị
    │   └── mockData.ts         # 12+ phòng học chi tiết và dữ liệu mẫu test xung đột
    ├── services/
    │   ├── notificationService.ts # Quản lý thông báo expo-notifications nhắc -15p
    │   └── firebaseConfig.ts   # Adapter lưu trữ Firebase / Realtime Database ready
    ├── store/
    │   └── useBookingStore.ts  # Zustand Store toàn cục + AsyncStorage persist
    ├── components/
    │   ├── Header.tsx          # Profile avatar, MSSV & notification counter
    │   ├── FilterBar.tsx       # Tìm kiếm, lọc tòa nhà, sức chứa & tiện ích
    │   ├── RoomCard.tsx        # Thẻ phòng (React.memo, 60 FPS, status badge)
    │   ├── DatePickerBar.tsx   # Trượt 7 ngày liên tiếp
    │   ├── TimeSlotGrid.tsx    # Lưới ca học 2 tiếng & xử lý xung đột
    │   ├── BookingModal.tsx    # Modal xác nhận đặt phòng
    │   ├── QRCodeCheckInModal.tsx # Vé điện tử QR check-in
    │   └── ActiveBookingCard.tsx  # Thẻ quản lý lịch đặt của tôi & nút Hủy
    └── screens/
        ├── ExploreScreen.tsx   # Màn hình Khám phá & Lọc phòng FlatList
        ├── RoomDetailScreen.tsx# Chi tiết phòng & Chọn slot 7 ngày
        ├── MyBookingsScreen.tsx# Lịch đặt phòng (Active & History)
        └── ProfileScreen.tsx   # Thẻ sinh viên, thống kê giờ học & Test thông báo
```

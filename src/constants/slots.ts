import { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot_1',
    label: '07:30 - 09:30',
    startTime: '07:30',
    endTime: '09:30',
    period: 'morning',
    sessionName: 'Ca Sáng 1',
  },
  {
    id: 'slot_2',
    label: '09:30 - 11:30',
    startTime: '09:30',
    endTime: '11:30',
    period: 'morning',
    sessionName: 'Ca Sáng 2',
  },
  {
    id: 'slot_3',
    label: '13:00 - 15:00',
    startTime: '13:00',
    endTime: '15:00',
    period: 'afternoon',
    sessionName: 'Ca Chiều 1',
  },
  {
    id: 'slot_4',
    label: '15:00 - 17:00',
    startTime: '15:00',
    endTime: '17:00',
    period: 'afternoon',
    sessionName: 'Ca Chiều 2',
  },
  {
    id: 'slot_5',
    label: '17:30 - 19:30',
    startTime: '17:30',
    endTime: '19:30',
    period: 'evening',
    sessionName: 'Ca Tối 1',
  },
  {
    id: 'slot_6',
    label: '19:30 - 21:30',
    startTime: '19:30',
    endTime: '21:30',
    period: 'evening',
    sessionName: 'Ca Tối 2',
  },
];

export const AMENITY_DETAILS: Record<string, { label: string; icon: string; description: string }> = {
  projector: {
    label: 'Máy chiếu',
    icon: 'Tv',
    description: 'Máy chiếu 4K Laser & màn chiếu tự động',
  },
  whiteboard: {
    label: 'Bảng trắng',
    icon: 'PenTool',
    description: 'Bảng từ kính chống lóa kèm bút dạ & lau bảng',
  },
  high_spec_pc: {
    label: 'PC cấu hình cao',
    icon: 'Monitor',
    description: 'Dàn máy i7/32GB RAM/RTX chuyên dụng đồ họa & AI',
  },
  air_conditioner: {
    label: 'Điều hòa',
    icon: 'Wind',
    description: 'Hệ thống điều hòa 2 chiều lọc khí ion âm',
  },
};

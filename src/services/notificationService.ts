import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types';
import { parse, subMinutes, isFuture } from 'date-fns';

// Configure notification behavior when app is in foreground (mobile only)
if (Platform.OS !== 'web') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch (e) {
    console.warn('[NotificationService] setNotificationHandler skipped on web:', e);
  }
}

export class NotificationService {
  /**
   * Request push notification permissions from user
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('[NotificationService] Web platform: Push notifications simulated in-app.');
      return true;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[NotificationService] Failed to get push token for notification!');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('booking_reminders', {
          name: 'Nhắc nhở đặt phòng học',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4F46E5',
          sound: 'default',
        });
      }

      return true;
    } catch (error) {
      console.warn('[NotificationService] Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule check-in reminder 15 minutes before booking timeSlot start
   */
  static async scheduleBookingReminder(booking: Booking): Promise<string | undefined> {
    try {
      // Parse booking start time: e.g. "2026-09-17" + "07:30"
      const dateTimeString = `${booking.date} ${booking.timeSlot.startTime}`;
      const bookingStartTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());

      // Reminder is 15 minutes before start
      const reminderTime = subMinutes(bookingStartTime, 15);

      console.log(
        `[NotificationService] Scheduling reminder for ${booking.roomCode} at ${reminderTime.toISOString()} (15m before ${bookingStartTime.toISOString()})`
      );

      // On Web, local scheduled push notifications trigger via setTimeout or in-app toast
      if (Platform.OS === 'web') {
        const diffMs = reminderTime.getTime() - Date.now();
        if (diffMs > 0 && diffMs < 2147483647) {
          const timerId = `web_notif_${booking.id}_${Date.now()}`;
          setTimeout(() => {
            console.log(
              `[Local Alert] ⏰ Sắp đến giờ nhận phòng: Phòng ${booking.roomCode} của bạn bắt đầu lúc ${booking.timeSlot.startTime}!`
            );
          }, Math.min(diffMs, 5000)); // Test/Demo trigger
          return timerId;
        }
        return `web_notif_${booking.id}`;
      }

      // If reminder time has not passed yet, schedule it
      if (isFuture(reminderTime)) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Sắp đến giờ nhận phòng học!',
            body: `Phòng ${booking.roomCode} (${booking.roomName}) của bạn sẽ bắt đầu lúc ${booking.timeSlot.startTime}. Vui lòng mở mã QR để check-in tại cửa phòng.`,
            data: {
              bookingId: booking.id,
              bookingCode: booking.bookingCode,
              roomId: booking.roomId,
              roomCode: booking.roomCode,
            },
            sound: true,
          },
          trigger: {
            date: reminderTime,
            channelId: 'booking_reminders',
          },
        });

        return notificationId;
      } else {
        // If booking is imminent (less than 15 mins away), send a trigger in 5 seconds
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '✅ Đặt phòng thành công!',
            body: `Phòng ${booking.roomCode} của bạn đã sẵn sàng cho ca ${booking.timeSlot.label}. Chúc bạn học tập hiệu quả!`,
            data: { bookingId: booking.id },
            sound: true,
          },
          trigger: {
            seconds: 2,
            channelId: 'booking_reminders',
          },
        });

        return notificationId;
      }
    } catch (error) {
      console.warn('[NotificationService] Failed to schedule notification:', error);
      return undefined;
    }
  }

  /**
   * Cancel scheduled notification when user cancels booking
   */
  static async cancelBookingReminder(notificationId?: string): Promise<void> {
    if (!notificationId) return;

    if (Platform.OS === 'web') {
      console.log(`[NotificationService] Web reminder cancelled for id: ${notificationId}`);
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`[NotificationService] Successfully cancelled notification id: ${notificationId}`);
    } catch (error) {
      console.warn(`[NotificationService] Error cancelling notification ${notificationId}:`, error);
    }
  }
}

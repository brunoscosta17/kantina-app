import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import api from '../lib/api';
import { useAuth } from '../store/auth';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useAuth((s) => s.token);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!token) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const count = data.filter((n: any) => !n.read).length;
        setUnreadCount(count);
      } catch (e) {
        console.log('Error fetching unread notifications count:', e);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [token]);

  return (
    <TouchableOpacity 
      onPress={() => {
        setUnreadCount(0); // Optimistic clear
        navigation.navigate('Notifications');
      }} 
      style={{ marginRight: 16, position: 'relative', padding: 4 }}
    >
      <Icon name="bell-outline" size={28} color={COLORS.orange} />
      {unreadCount > 0 && (
        <Badge 
          size={18} 
          style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#E11D48', fontWeight: 'bold' }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </TouchableOpacity>
  );
}

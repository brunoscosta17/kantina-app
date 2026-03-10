import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import api from '../lib/api';
import { useAuth } from '../store/auth';

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuth((s) => s.token);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.log('Error marking as read', e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <View style={{ padding: 16, flex: 1 }}>
        {loading ? (
          <ActivityIndicator />
        ) : notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell-off-outline" size={64} color="#ccc" />
          <Text style={{ color: COLORS.textVariant, marginTop: 16 }}>Você não possui notificações no momento.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => markAsRead(item.id, item.read)}
              style={{
                backgroundColor: item.read ? '#fff' : '#FFF3E0',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
                borderLeftWidth: item.read ? 0 : 4,
                borderLeftColor: COLORS.orange,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontWeight: item.read ? '600' : '800', color: COLORS.text, fontSize: 16 }}>
                  {item.title}
                </Text>
                <Text style={{ color: COLORS.textVariant, fontSize: 12 }}>
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <Text style={{ color: COLORS.text, fontSize: 14 }}>{item.body}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

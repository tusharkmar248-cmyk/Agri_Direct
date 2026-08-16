// ─── Agri Direct: Notifications ─────────────────────────────────────

import { CheckCheck, Tag, Truck, TrendingUp, Info } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { NotificationType } from '../types';

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  offer: { icon: <Tag size={18} />, color: 'bg-accent-100 text-accent-600' },
  order: { icon: <Truck size={18} />, color: 'bg-primary-100 text-primary-600' },
  price: { icon: <TrendingUp size={18} />, color: 'bg-success-100 text-success-500' },
  system: { icon: <Info size={18} />, color: 'bg-info-100 text-info-500' },
};

export default function Notifications() {
  const { state, dispatch } = useStore();
  const { t } = useT();
  const uid = state.currentUser.id;

  const myNotifs = state.notifications.filter(n => n.userId === uid);
  const unread = myNotifs.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', userId: uid });
  };

  const handleMarkRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', id });
  };

  const timeAgo = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('justNow');
    if (mins < 60) return `${mins} ${t('minutesAgo')}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${t('hoursAgo')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t('daysAgo')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-primary">{t('notifications')}</h2>
          {unread > 0 && (
            <span className="badge badge-danger">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={handleMarkAllRead}
            className="btn-secondary text-sm"
          >
            <CheckCheck size={16} /> {t('markAllRead')}
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2 stagger-children">
        {myNotifs.map(notif => {
          const config = typeConfig[notif.type];
          return (
            <button
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`glass-card p-4 flex items-start gap-4 w-full text-left cursor-pointer border-0 transition-all
                ${!notif.read ? 'border-l-4 !border-l-primary-500 bg-primary-50/50' : 'opacity-75'}`}
            >
              <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-text-primary text-sm">{notif.title}</div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{notif.message}</p>
                <span className="text-xs text-text-muted mt-1 inline-block">{timeAgo(notif.createdAt)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {myNotifs.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-text-muted">{t('noNotifications')}</p>
        </div>
      )}
    </div>
  );
}

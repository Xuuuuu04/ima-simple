import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

interface Chat {
  id: number;
  title: string;
  created_at: string;
}

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (chatId: number) => void;
  currentChatId?: number | null;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentChatId,
}) => {
  const [history, setHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/chat/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
        console.error('Unexpected API response format:', data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '300px',
        backgroundColor: '#f9fafb',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
          历史会话
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: '#6b7280',
            padding: '4px',
            borderRadius: '4px',
          }}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            加载中...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>
            {error}
            <button
              onClick={fetchHistory}
              style={{
                display: 'block',
                margin: '10px auto',
                padding: '4px 8px',
                fontSize: '0.875rem',
                color: '#2563eb',
                background: 'none',
                border: '1px solid #2563eb',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              重试
            </button>
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
            暂无历史会话
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history.map((chat) => (
              <li key={chat.id} style={{ marginBottom: '8px' }}>
                <div
                  onClick={() => onSelect(chat.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    backgroundColor: currentChatId === chat.id ? '#e0e7ff' : '#ffffff',
                    border: '1px solid',
                    borderColor: currentChatId === chat.id ? '#c7d2fe' : '#e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (currentChatId !== chat.id) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentChatId !== chat.id) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      color: '#1f2937',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat.title || '无标题会话'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatDate(chat.created_at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

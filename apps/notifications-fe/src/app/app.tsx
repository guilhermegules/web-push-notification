import { useState } from 'react';
import { Toast } from './components/toast';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from './hooks/useNotification';

const userId = uuidv4();

export function App() {
  const [toast, setToast] = useState({ open: false, message: '' });

  const { onNotify, onSubscribe, onUnsubscribe } = useNotification({
    userId,
    toastAction: (message) => {
      setToast({ open: true, message });
    },
  });

  return (
    <div className="bg-slate-600 h-screen flex items-center justify-center">
      <div>
        <h1 className="text-slate-100 mb-4 text-4xl">
          React Push Notification
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onSubscribe}
            className="text-slate-100 p-2 border-x-2 border-y-2 rounded-sm"
          >
            Subscribe
          </button>
          <button
            onClick={onUnsubscribe}
            className="text-slate-100 p-2 border-x-2 border-y-2 rounded-sm"
          >
            Unsubscribe
          </button>
          <button
            onClick={() => onNotify({ title: 'Title', body: 'Content' })}
            className="text-slate-100 p-2 border-x-2 border-y-2 rounded-sm"
          >
            Please notify me!
          </button>
        </div>
      </div>

      {toast.open && (
        <Toast
          message={toast.message}
          onClose={() => {
            setToast({
              open: false,
              message: '',
            });
          }}
          duration={2000}
        />
      )}
    </div>
  );
}

export default App;

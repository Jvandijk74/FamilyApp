import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      const history = response.data.history;

      const formattedMessages = [];
      history.forEach(chat => {
        formattedMessages.push({
          role: 'user',
          content: chat.message,
          timestamp: chat.created_at
        });
        formattedMessages.push({
          role: 'assistant',
          content: chat.response,
          timestamp: chat.created_at
        });
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.error || 'Er ging iets mis met de AI chat. Controleer of de ANTHROPIC_API_KEY is ingesteld.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Fout: ${errorMessage}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Weet je zeker dat je de chatgeschiedenis wilt verwijderen?')) {
      return;
    }

    try {
      await chatAPI.clearHistory();
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Fout bij verwijderen van chatgeschiedenis');
    }
  };

  const suggestedQuestions = [
    "Wat moeten wij vandaag doen?",
    "Welke boodschappen moeten we halen?",
    "Wat staat er deze week op de planning?",
    "Hebben we vandaag afspraken?"
  ];

  if (loadingHistory) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Laden...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chat Assistent</h1>
            <p className="text-gray-600">
              Stel vragen over jullie agenda en boodschappen
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Geschiedenis wissen
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start een gesprek
                </h3>
                <p className="text-gray-600 mb-6">
                  Vraag de AI over jullie planning en boodschappen
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-3">Probeer bijvoorbeeld:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="block w-full max-w-md mx-auto px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-semibold">AI Assistent</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <form onSubmit={handleSend} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Stel een vraag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Verzenden...' : 'Verzenden'}
              </button>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips voor AI Chat</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• De AI heeft toegang tot jullie agenda en boodschappenlijst</li>
            <li>• Vraag naar "vandaag", "deze week" of specifieke dagen</li>
            <li>• Vraag om samenvattingen van jullie planning</li>
            <li>• De AI kan helpen met het organiseren van taken</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

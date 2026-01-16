import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calendarAPI, shoppingAPI } from '../services/api';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [activeShoppingItems, setActiveShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [eventsRes, shoppingRes] = await Promise.all([
        calendarAPI.getToday(),
        shoppingAPI.getActive()
      ]);

      setTodayEvents(eventsRes.data.events);
      setActiveShoppingItems(shoppingRes.data.items);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welkom! Hier zie je een overzicht van vandaag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Vandaag op de agenda</h2>
              <Link
                to="/calendar"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bekijk alles →
              </Link>
            </div>

            {todayEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Geen afspraken vandaag! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(parseISO(event.start_date), 'HH:mm')}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Toegevoegd door {event.user_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Shopping Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Boodschappenlijst</h2>
              <Link
                to="/shopping"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bekijk alles →
              </Link>
            </div>

            {activeShoppingItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Geen boodschappen op de lijst! 🛒
              </p>
            ) : (
              <div className="space-y-2">
                {activeShoppingItems.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-gray-900">{item.name}</span>
                      {item.quantity && (
                        <span className="text-sm text-gray-500 ml-2">({item.quantity})</span>
                      )}
                      {item.category && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {activeShoppingItems.length > 8 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{activeShoppingItems.length - 8} meer items
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Snelle acties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/calendar"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Nieuwe afspraak</div>
            </Link>
            <Link
              to="/shopping"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium">Boodschap toevoegen</div>
            </Link>
            <Link
              to="/chat"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Chat met AI</div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

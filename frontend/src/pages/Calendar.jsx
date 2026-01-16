import { useState, useEffect } from 'react';
import { calendarAPI } from '../services/api';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import Layout from '../components/Layout';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await calendarAPI.getAll();
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await calendarAPI.update(editingEvent.id, formData);
      } else {
        await calendarAPI.create(formData);
      }

      await loadEvents();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Fout bij opslaan van afspraak');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
      return;
    }

    try {
      await calendarAPI.delete(id);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Fout bij verwijderen van afspraak');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date,
      end_date: event.end_date || '',
      location: event.location || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: ''
    });
  };

  const handleOpenModal = () => {
    const now = new Date();
    const defaultDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
    setFormData({
      title: '',
      description: '',
      start_date: defaultDateTime,
      end_date: '',
      location: ''
    });
    setShowModal(true);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Agenda</h1>
            <p className="text-gray-600">Beheer jullie afspraken en activiteiten</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Nieuwe afspraak
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Geen afspraken gevonden
            </h3>
            <p className="text-gray-600 mb-6">
              Voeg je eerste afspraak toe om te beginnen
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Eerste afspraak toevoegen
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 mb-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        {format(parseISO(event.start_date), 'PPP', { locale: nl })}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🕐</span>
                        {format(parseISO(event.start_date), 'HH:mm')}
                        {event.end_date && ` - ${format(parseISO(event.end_date), 'HH:mm')}`}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <span className="mr-1">📍</span>
                          {event.location}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Toegevoegd door {event.user_name}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingEvent ? 'Afspraak bewerken' : 'Nieuwe afspraak'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv. Doktersafspraak"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschrijving
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Extra details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eind
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locatie
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv. Thuis, Kantoor"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingEvent ? 'Opslaan' : 'Toevoegen'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;

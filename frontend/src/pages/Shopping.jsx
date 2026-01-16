import { useState, useEffect } from 'react';
import { shoppingAPI } from '../services/api';
import Layout from '../components/Layout';

const Shopping = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await shoppingAPI.getAll();
      setItems(response.data.items);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await shoppingAPI.update(editingItem.id, formData);
      } else {
        await shoppingAPI.create(formData);
      }

      await loadItems();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Fout bij opslaan van boodschap');
    }
  };

  const handleToggle = async (id) => {
    try {
      await shoppingAPI.toggle(id);
      await loadItems();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) {
      return;
    }

    try {
      await shoppingAPI.delete(id);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Fout bij verwijderen van item');
    }
  };

  const handleClearCompleted = async () => {
    if (!confirm('Weet je zeker dat je alle afgevinkte items wilt verwijderen?')) {
      return;
    }

    try {
      await shoppingAPI.clearCompleted();
      await loadItems();
    } catch (error) {
      console.error('Error clearing completed items:', error);
      alert('Fout bij verwijderen van afgevinkte items');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity || '',
      category: item.category || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: '',
      category: ''
    });
  };

  const activeItems = items.filter(item => !item.is_completed);
  const completedItems = items.filter(item => item.is_completed);

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Boodschappenlijst</h1>
            <p className="text-gray-600">
              {activeItems.length} actieve items, {completedItems.length} afgevinkt
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Nieuw item
          </button>
        </div>

        {/* Active Items */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Te kopen</h2>
          </div>
          {activeItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Geen actieve boodschappen
              </h3>
              <p className="text-gray-600">
                Voeg items toe aan je boodschappenlijst
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleToggle(item.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 ml-4">
                      <div className="flex items-center">
                        <span className="text-gray-900 font-medium">{item.name}</span>
                        {item.quantity && (
                          <span className="ml-2 text-sm text-gray-500">({item.quantity})</span>
                        )}
                        {item.category && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Toegevoegd door {item.user_name}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Afgevinkt</h2>
              <button
                onClick={handleClearCompleted}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Verwijder alles
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {completedItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors opacity-60">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggle(item.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 ml-4">
                      <div className="flex items-center">
                        <span className="text-gray-900 line-through">{item.name}</span>
                        {item.quantity && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ({item.quantity})
                          </span>
                        )}
                        {item.category && (
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingItem ? 'Item bewerken' : 'Nieuw item'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv. Melk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hoeveelheid
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv. 2 liter, 500g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv. Zuivel, Groente"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingItem ? 'Opslaan' : 'Toevoegen'}
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

export default Shopping;

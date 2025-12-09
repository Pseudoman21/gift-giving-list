'use client';

import { useState, useEffect } from 'react';

interface Person {
  id: string;
  name: string;
  giveMoney: boolean;
  moneyAmount: number;
  giveGift: boolean;
  moneyGiven?: boolean;
  giftGiven?: boolean;
}

export default function Home() {
  const [persons, setPersons] = useState<Person[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('giftGivingList');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse localStorage data:', e);
        }
      }
    }
    return [];
  });
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  // Save to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0 || localStorage.getItem('giftGivingList')) {
      localStorage.setItem('giftGivingList', JSON.stringify(persons));
    }
  }, [persons]);

  const addPerson = () => {
    if (newName.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newName.trim(),
        giveMoney: false,
        moneyAmount: 0,
        giveGift: false,
        moneyGiven: false,
        giftGiven: false,
      };
      setPersons([newPerson, ...persons]);
      setNewName('');
      showToast(`${newName.trim()} added to the list!`);
    }
  };

  const deletePerson = (id: string) => {
    const person = persons.find(p => p.id === id);
    setPersons(persons.filter(p => p.id !== id));
    if (person) {
      showToast(`${person.name} removed from the list`);
    }
  };

  const startEdit = (person: Person) => {
    setEditingId(person.id);
    setEditingName(person.name);
  };

  const saveEdit = () => {
    if (editingName.trim()) {
      setPersons(persons.map(p =>
        p.id === editingId ? { ...p, name: editingName.trim() } : p
      ));
      setEditingId(null);
      setEditingName('');
      showToast('Name updated successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const toggleMoney = (id: string) => {
    const person = persons.find(p => p.id === id);
    setPersons(persons.map(p =>
      p.id === id ? { ...p, giveMoney: !p.giveMoney } : p
    ));
    if (person) {
      showToast(person.giveMoney ? 'Money gift removed' : 'Money gift added');
    }
  };

  const updateMoneyAmount = (id: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    setPersons(persons.map(p =>
      p.id === id ? { ...p, moneyAmount: numAmount } : p
    ));
  };

  const toggleGift = (id: string) => {
    const person = persons.find(p => p.id === id);
    setPersons(persons.map(p =>
      p.id === id ? { ...p, giveGift: !p.giveGift } : p
    ));
    if (person) {
      showToast(person.giveGift ? 'Physical gift removed' : 'Physical gift added');
    }
  };

  const toggleMoneyGiven = (id: string) => {
    const person = persons.find(p => p.id === id);
    setPersons(persons.map(p =>
      p.id === id ? { ...p, moneyGiven: !p.moneyGiven } : p
    ));
    if (person) {
      showToast(person.moneyGiven ? 'Money marked as pending' : 'Money marked as given!');
    }
  };

  const toggleGiftGiven = (id: string) => {
    const person = persons.find(p => p.id === id);
    setPersons(persons.map(p =>
      p.id === id ? { ...p, giftGiven: !p.giftGiven } : p
    ));
    if (person) {
      showToast(person.giftGiven ? 'Gift marked as pending' : 'Gift marked as given!');
    }
  };

  const moneyCount = persons.filter(p => p.giveMoney).length;
  const giftCount = persons.filter(p => p.giveGift).length;

  // Calculate pending and given totals
  const pendingCount = persons.filter(p =>
    (p.giveMoney && !p.moneyGiven) || (p.giveGift && !p.giftGiven)
  ).length;
  const givenCount = persons.filter(p =>
    (p.giveMoney && p.moneyGiven) || (p.giveGift && p.giftGiven)
  ).length;

  // Calculate money amounts
  const givenMoneyAmount = persons.reduce((sum, p) =>
    sum + (p.giveMoney && p.moneyGiven ? p.moneyAmount : 0), 0);
  const remainingMoneyAmount = persons.reduce((sum, p) =>
    sum + (p.giveMoney && !p.moneyGiven ? p.moneyAmount : 0), 0);
  const totalMoneyAmount = givenMoneyAmount + remainingMoneyAmount;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-5xl mx-auto p-4 md:p-8 w-full">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-green-600 mb-4 shadow-lg">
            <span className="text-3xl">🎄</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Christmas Gift List
          </h1>
          <p className="text-gray-600 text-lg">Track your holiday giving with ease</p>
        </div>

        {/* Add Person Form */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Enter person's name..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 font-medium bg-white placeholder:text-gray-400"
              />
              <button
                onClick={addPerson}
                className="text-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Person
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Persons List */}
        <div className="space-y-3 mb-8">
          {persons.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-lg">No persons added yet. Start by adding someone above!</p>
            </div>
          ) : (
            persons.map((person) => (
              <div
                key={person.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                {editingId === person.id ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                      autoFocus
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={saveEdit}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header with name and actions */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{person.name}</h3>
                        <p className="text-sm text-gray-500">Gift details</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(person)}
                          className="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit name"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deletePerson(person.id)}
                          className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Delete person"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Gift options as cards */}
                    <div className="space-y-4">
                      {/* Money Card */}
                      <div
                        onClick={() => toggleMoney(person.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] ${person.giveMoney
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-sm'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50/30'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${person.giveMoney ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                              💵
                            </div>
                            <div>
                              <div className="font-bold text-gray-700 uppercase text-sm">Money</div>
                              <div className={`text-sm font-semibold ${person.giveMoney ? 'text-green-600' : 'text-gray-400'}`}>
                                {person.giveMoney ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                          {person.giveMoney && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMoneyGiven(person.id);
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                                person.moneyGiven
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-2 border-yellow-300'
                              }`}
                            >
                              {person.moneyGiven ? (
                                <>
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Given
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {person.giveMoney && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 pt-3 border-t border-green-200"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-bold text-gray-900">₱</span>
                              <input
                                type="number"
                                value={person.moneyAmount || ''}
                                onChange={(e) => updateMoneyAmount(person.id, e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="flex-1 text-4xl font-bold text-gray-900 bg-transparent border-none focus:outline-none p-0"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Click amount to edit</p>
                          </div>
                        )}
                      </div>

                      {/* Gift Card */}
                      <div
                        onClick={() => toggleGift(person.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] ${person.giveGift
                            ? 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 shadow-sm'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50/30'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${person.giveGift ? 'bg-red-100' : 'bg-gray-100'
                              }`}>
                              🎁
                            </div>
                            <div>
                              <div className="font-bold text-gray-700 uppercase text-sm">Gift</div>
                              <div className={`text-sm font-semibold ${person.giveGift ? 'text-red-600' : 'text-gray-400'}`}>
                                {person.giveGift ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                          {person.giveGift && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleGiftGiven(person.id);
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                                person.giftGiven
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-2 border-yellow-300'
                              }`}
                            >
                              {person.giftGiven ? (
                                <>
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Given
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Total Summary */}
        {persons.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">{persons.length}</div>
                <div className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wide">Total People</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="text-3xl font-bold text-green-700">{moneyCount}</div>
                <div className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Money Gifts</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="text-3xl font-bold text-red-700">{giftCount}</div>
                <div className="text-xs text-red-600 font-semibold mt-1 uppercase tracking-wide">Physical Gifts</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-700">{pendingCount}</div>
                <div className="text-xs text-yellow-600 font-semibold mt-1 uppercase tracking-wide">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200 col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-teal-700">{givenCount}</div>
                <div className="text-xs text-teal-600 font-semibold mt-1 uppercase tracking-wide">Given</div>
              </div>
            </div>

            {/* Money Amount Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-700">
                  ₱{totalMoneyAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 uppercase tracking-wide">Total Amount</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  ₱{givenMoneyAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-green-600 font-semibold mt-1 uppercase tracking-wide">Amount Given</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">
                  ₱{remainingMoneyAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-orange-600 font-semibold mt-1 uppercase tracking-wide">Remaining Amount</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50 ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}

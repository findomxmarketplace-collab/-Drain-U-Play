import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Layout, Plus, Users, History, Settings, ExternalLink, Check, X, ShieldCheck } from 'lucide-react';

import BACKEND_URL from '../api';

const socket = io(BACKEND_URL);

const GoddessDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomStates, setRoomStates] = useState({});
  const [history, setHistory] = useState([]);
  const [newRoomId, setNewRoomId] = useState('');
  const [goddessId] = useState('goddess_1'); // Mock for now

  const triggerSyncTask = (task) => {
    const roomId = rooms[0]?.id || 'main' // Just use first room for demo
    socket.emit('trigger_sync_task', { roomId, task })
  }

  useEffect(() => {
    fetchRooms();
    fetchHistory();

    socket.on('state_update', (state) => {
      setRoomStates(prev => ({ ...prev, [state.roomId || 'main']: state }));
    });

    return () => {
      socket.off('state_update');
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/rooms`);
      setRooms(res.data);
      // Join all rooms to get real-time state
      res.data.forEach(room => {
        socket.emit('join_game', { playerId: 'GODDESS', roomId: room.id });
      });
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  const updateSolanaAddress = (roomId, address) => {
    socket.emit('update_room_settings', { roomId, solanaAddress: address });
    // Update local state temporarily for UI responsiveness
    setRoomStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], solanaAddress: address }
    }));
  };

  const updateWishtenderLink = (roomId, link) => {
    socket.emit('update_room_settings', { roomId, wishtenderLink: link });
    setRoomStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], wishtenderLink: link }
    }));
  };

  const updateThroneLink = (roomId, link) => {
    socket.emit('update_room_settings', { roomId, throneLink: link });
    setRoomStates(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], throneLink: link }
    }));
  };

  const approvePayment = (roomId, playerId) => {
    socket.emit('confirm_first_duty', { roomId, playerId });
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/session-history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const createRoom = async () => {
    if (!newRoomId) return;
    try {
      await axios.post(`${BACKEND_URL}/create-room`, { roomId: newRoomId, goddessId });
      setNewRoomId('');
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create room');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-pink-500 uppercase tracking-tighter">Goddess Control</h1>
            <p className="text-neutral-500 uppercase text-xs tracking-widest font-bold">Multi-Room SaaS Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-900 px-4 py-2 rounded-full border border-pink-500/30 text-sm font-bold text-pink-400">
              SaaS License: Active ($46.66/mo)
            </div>
            <button className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Room Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Layout size={20} className="text-pink-500" /> Active Rooms
                </h2>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Room ID (e.g. friday-drain)"
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button 
                    onClick={createRoom}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-xl transition-all active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 hover:border-pink-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-black uppercase">{room.id}</h3>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Goddess: {room.goddessId}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                          <Users size={14} /> {room.playerCount}
                        </div>
                        {roomStates[room.id]?.solanaAddress && (
                          <div className="text-[8px] text-purple-400 font-mono truncate max-w-[80px]">
                            {roomStates[room.id].solanaAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-[8px] text-neutral-500 font-black uppercase mb-1 block">Solana Wallet (Manual Mode)</label>
                        <input 
                          type="text" 
                          placeholder="Address..."
                          defaultValue={roomStates[room.id]?.solanaAddress || ''}
                          onBlur={(e) => updateSolanaAddress(room.id, e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-purple-500 transition-colors font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] text-neutral-500 font-black uppercase mb-1 block">Wishtender</label>
                          <input 
                            type="text" 
                            placeholder="Link..."
                            defaultValue={roomStates[room.id]?.wishtenderLink || ''}
                            onBlur={(e) => updateWishtenderLink(room.id, e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[8px] focus:outline-none focus:border-pink-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-neutral-500 font-black uppercase mb-1 block">Throne</label>
                          <input 
                            type="text" 
                            placeholder="Link..."
                            defaultValue={roomStates[room.id]?.throneLink || ''}
                            onBlur={(e) => updateThroneLink(room.id, e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[8px] focus:outline-none focus:border-pink-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Pending Approvals */}
                      {Object.values(roomStates[room.id]?.players || {}).some(p => p.cryptoApprovalRequested) && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-2">
                          <div className="text-[8px] text-purple-400 font-black uppercase mb-2 flex items-center gap-1">
                            <ShieldCheck size={10} /> Pending Approvals
                          </div>
                          <div className="space-y-2">
                            {Object.values(roomStates[room.id]?.players || {})
                              .filter(p => p.cryptoApprovalRequested)
                              .map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                                  <span className="text-[10px] font-bold truncate max-w-[60px]">{p.id}</span>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => approvePayment(room.id, p.id)}
                                      className="bg-green-600 hover:bg-green-500 p-1 rounded transition-colors"
                                    >
                                      <Check size={10} />
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-500 p-1 rounded transition-colors">
                                      <X size={10} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`/?roomId=${room.id}&playerId=${room.goddessId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-xs font-bold py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                      >
                        Launch Board <ExternalLink size={12} />
                      </a>
                      <button className="px-3 bg-neutral-700 hover:bg-pink-900 rounded-lg transition-colors">
                        <History size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
                    <p className="text-neutral-600 font-bold uppercase text-sm italic">No active rooms. Create your first palace above.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <History size={20} className="text-pink-500" /> Recent Session History
              </h2>
              <div className="space-y-3">
                {history.map(session => (
                  <div key={session.id} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-xl text-sm">
                    <span className="text-neutral-300">Room: <b className="text-white">{session.room_id}</b></span>
                    <span className="text-pink-400 font-bold">Total Tribute: ${session.total_tribute}</span>
                    <span className="text-neutral-500 text-xs">{new Date(session.ended_at).toLocaleDateString()}</span>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-neutral-600 italic text-sm text-center py-4">No session history yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Global Settings & Tasks */}
          <div className="space-y-8">
            <div className="bg-pink-500/10 rounded-3xl border border-pink-500/30 p-6">
              <h2 className="text-xl font-bold mb-4 text-pink-400">Task Control</h2>
              <p className="text-xs text-neutral-400 mb-6 uppercase tracking-wider font-bold">Global toggle for all active rooms</p>
              
              <div className="space-y-4">
                {[
                  { label: 'Engagement Boost (Tier 1)', task: 'Like/RT Goddess last 5 posts or pay $20' },
                  { label: 'Public Devotion (Tier 2)', task: 'Update social bio for 1 hour or pay $100' },
                  { label: 'Group Drain (Tier 3)', task: 'Tribute $50 immediately' },
                ].map((task, i) => (
                  <div key={i} className="flex justify-between items-center bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                    <span className="text-sm font-medium">{task.label}</span>
                    <button 
                      onClick={() => triggerSyncTask(task.task)}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition-all active:scale-95"
                    >
                      TRIGGER
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
              <h2 className="text-xl font-bold mb-4">Live Support</h2>
              <p className="text-xs text-neutral-400 mb-4 uppercase tracking-wider font-bold">Priority technical assistance</p>
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-pink-400 font-bold py-3 rounded-xl border border-pink-500/20 transition-all">
                CONTACT ARCHITECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoddessDashboard;

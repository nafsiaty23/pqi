
import React, { useState, useEffect, useMemo } from 'react';
import { Specialist, SpecialistStatus } from './types';
import { MOCK_SPECIALISTS, MOCK_STATS } from './mockData';
import StatsCard from './components/StatsCard';
import SpecialistRow from './components/SpecialistRow';
import { getAIFollowUpSuggestion, getDailyInsights } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>(MOCK_SPECIALISTS);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyInsights, setDailyInsights] = useState('');
  const [filter, setFilter] = useState<SpecialistStatus | 'ALL'>('ALL');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getDailyInsights(MOCK_STATS);
      setDailyInsights(insight);
    };
    fetchInsights();
  }, []);

  const stats = useMemo(() => {
    const total = specialists.length;
    const pending = specialists.filter(s => s.status === SpecialistStatus.PENDING).length;
    const verified = specialists.filter(s => s.status === SpecialistStatus.VERIFIED).length;
    return { total, pending, verified };
  }, [specialists]);

  const filteredSpecialists = useMemo(() => {
    return filter === 'ALL' ? specialists : specialists.filter(s => s.status === filter);
  }, [specialists, filter]);

  const handleUpdateStatus = (id: string, newStatus: SpecialistStatus) => {
    setSpecialists(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    if (selectedSpecialist?.id === id) {
      setSelectedSpecialist(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddNote = () => {
    if (!selectedSpecialist || !newNote.trim()) return;
    
    const updatedNote = newNote.trim();
    setSpecialists(prev => prev.map(s => 
      s.id === selectedSpecialist.id 
        ? { ...s, notes: [...s.notes, updatedNote] } 
        : s
    ));
    
    // Update local selected specialist to reflect the new note immediately
    setSelectedSpecialist(prev => prev ? { ...prev, notes: [...prev.notes, updatedNote] } : null);
    setNewNote('');
  };

  const handleViewDetails = async (s: Specialist) => {
    setSelectedSpecialist(s);
    setAiSuggestion('');
    setIsGenerating(true);
    setNewNote('');
    const suggestion = await getAIFollowUpSuggestion(s);
    setAiSuggestion(suggestion);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Follow-up message copied!');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">PsyTrack</h1>
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-lg text-white transition-all">
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <i className="fas fa-users"></i>
            <span>Specialists</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <i className="fas fa-calendar-alt"></i>
            <span>Daily Tasks</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all">
            <i className="fas fa-chart-line"></i>
            <span>Reports</span>
          </a>
        </nav>

        <div className="mt-auto pt-10">
          <div className="p-4 bg-slate-800 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Daily AI Insight</h4>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {dailyInsights || "Analyzing trends..."}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Specialist Management</h2>
            <p className="text-slate-500">Track and follow up with your community members.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
              <i className="fas fa-download mr-2"></i> Export CSV
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md transition-all">
              <i className="fas fa-plus mr-2"></i> New Entry
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard label="Total Registered" value={stats.total} icon="fa-users" color="bg-indigo-500" trend="+12%" />
          <StatsCard label="Pending Follow-up" value={stats.pending} icon="fa-clock" color="bg-amber-500" trend="-3%" />
          <StatsCard label="Verified Experts" value={stats.verified} icon="fa-check-double" color="bg-emerald-500" trend="+5%" />
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Registration Activity</h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> New Users</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded-full"></span> Follow-ups</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReg)" />
                <Area type="monotone" dataKey="followUps" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Specialist List & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-lg font-bold text-slate-800">Recent Registrations</h3>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border-slate-200 rounded-lg p-1 px-3 focus:ring-indigo-500"
              >
                <option value="ALL">All Status</option>
                <option value={SpecialistStatus.PENDING}>Pending</option>
                <option value={SpecialistStatus.CONTACTED}>Contacted</option>
                <option value={SpecialistStatus.VERIFIED}>Verified</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Specialist</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Focus Area</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSpecialists.map(specialist => (
                    <SpecialistRow 
                      key={specialist.id} 
                      specialist={specialist} 
                      onView={handleViewDetails}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                  {filteredSpecialists.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No specialists found with this status.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Info / AI Follow-up & Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-[fit-content] sticky top-8">
            {selectedSpecialist ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedSpecialist.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{selectedSpecialist.specialization}</p>
                  </div>
                  <button onClick={() => setSelectedSpecialist(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Experience</p>
                    <p className="text-sm font-semibold">{selectedSpecialist.experienceYears} Years</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                    <p className="text-sm font-semibold text-indigo-600">{selectedSpecialist.status}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">About</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedSpecialist.bio}</p>
                </div>

                {/* Internal Notes Section */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Internal Notes</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedSpecialist.notes.length > 0 ? (
                      selectedSpecialist.notes.map((note, idx) => (
                        <div key={idx} className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 border border-slate-100">
                          {note}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a quick note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="flex-1 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">AI Follow-up Draft</h4>
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Gemini 3 Flash</span>
                  </div>
                  
                  {isGenerating ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg animate-pulse space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto">
                        {aiSuggestion || "Select a specialist to generate a follow-up draft."}
                      </div>
                      {aiSuggestion && (
                        <button 
                          onClick={() => copyToClipboard(aiSuggestion)}
                          className="absolute bottom-2 right-2 bg-white shadow-sm border border-indigo-200 text-indigo-600 px-3 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Quick Actions</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(selectedSpecialist.id, SpecialistStatus.CONTACTED)}
                      className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                    >
                      Mark Contacted
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedSpecialist.id, SpecialistStatus.VERIFIED)}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm"
                    >
                      Verify Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <i className="fas fa-user-plus text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Specialist Selected</h3>
                <p className="text-sm text-slate-400 mt-2 px-6">Click "View Details" on a registration to see profile and generate AI suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { Home, MapPin, Bed, Maximize, Calendar, TrendingUp, Eye, Image, Map, X, ChevronLeft, ChevronRight, Phone, Mail, User, MessageSquare, Settings, Plus, Edit2, Save, Trash2, Clock, Award, Star, Zap, AlertCircle } from 'lucide-react';

const App = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Moderne Villa - Costa Blanca",
      location: "Denia, Valencia",
      price: 485000,
      m2: 185,
      bedrooms: 4,
      deliveryDate: "Q2 2026",
      roi: 7.2,
      totalUnits: 24,
      soldUnits: 19,
      salesStartDate: "2024-08-01",
      exclusive: true,
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
      ],
      floorplans: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
      ],
      description: "Luxe nieuwbouw villa met privé zwembad en zeezicht. Modern design met hoogwaardige afwerking.",
      features: ["Privé zwembad", "Zeezicht", "Airconditioning", "Ondergrondse parking"]
    },
    {
      id: 2,
      title: "Penthouse Project - Marbella",
      location: "Marbella, Málaga",
      price: 725000,
      m2: 145,
      bedrooms: 3,
      deliveryDate: "Q4 2025",
      roi: 8.5,
      totalUnits: 16,
      soldUnits: 13,
      salesStartDate: "2024-06-15",
      exclusive: true,
      images: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
      ],
      floorplans: [
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&q=80"
      ],
      description: "Exclusief penthouse in prestigieus project nabij Puerto Banús. Luxe afwerking en prachtig dakterras.",
      features: ["Dakterras 60m²", "Zeezicht", "Conciërge service", "Fitnessruimte"]
    }
  ]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState('alle');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const formatPrice = (price) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
  
  const calculateAvailability = (property) => {
    const available = property.totalUnits - property.soldUnits;
    const percentageSold = Math.round((property.soldUnits / property.totalUnits) * 100);
    return { available, percentageSold };
  };

  const calculateSalesSpeed = (property) => {
    const startDate = new Date(property.salesStartDate);
    const monthsElapsed = Math.max(1, Math.round((new Date() - startDate) / (1000 * 60 * 60 * 24 * 30)));
    const soldPerMonth = property.soldUnits / monthsElapsed;
    return { monthsElapsed, soldPerMonth };
  };

  const handleReservation = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Vul alle verplichte velden in.');
      return;
    }
    setProperties(prev => prev.map(p => p.id === selectedProperty.id ? { ...p, soldUnits: Math.min(p.soldUnits + 1, p.totalUnits) } : p));
    alert('Reserveringsaanvraag verzonden!\n\nWe nemen binnen 24 uur contact met je op.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setViewMode('overview');
    setSelectedProperty(null);
  };

  const updateProperty = (id, updates) => setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProperty = (id) => { if (window.confirm('Weet je zeker dat je dit wilt verwijderen?')) setProperties(prev => prev.filter(p => p.id !== id)); };
  
  const addNewProperty = () => {
    const newProperty = {
      id: Math.max(...properties.map(p => p.id), 0) + 1,
      title: "Nieuw Project",
      location: "Locatie",
      price: 300000,
      m2: 120,
      bedrooms: 3,
      deliveryDate: "Q1 2026",
      roi: 6.5,
      totalUnits: 20,
      soldUnits: 0,
      salesStartDate: new Date().toISOString().split('T')[0],
      exclusive: false,
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"],
      floorplans: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"],
      description: "Nieuwe projectomschrijving",
      features: ["Feature 1", "Feature 2"]
    };
    setProperties(prev => [...prev, newProperty]);
    setEditingProperty(newProperty);
  };

  const nextImage = () => {
    const images = viewMode === 'floorplan' ? selectedProperty.floorplans : selectedProperty.images;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = viewMode === 'floorplan' ? selectedProperty.floorplans : selectedProperty.images;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const filteredProperties = properties.filter(p => {
    const { available } = calculateAvailability(p);
    if (filterStatus === 'beschikbaar') return available > 0;
    if (filterStatus === 'uitverkocht') return available === 0;
    return true;
  });

  const getUrgencyStyle = (available) => {
    if (available <= 3) return { bg: 'from-rose-500 to-red-600', text: 'Laatste Kans', pulse: true };
    if (available <= 5) return { bg: 'from-amber-500 to-orange-600', text: 'Bijna Uitverkocht', pulse: true };
    if (available <= 10) return { bg: 'from-yellow-400 to-amber-500', text: 'Populair', pulse: false };
    return { bg: 'from-emerald-400 to-teal-500', text: 'Beschikbaar', pulse: false };
  };

  // Admin Edit Modal
  if (editingProperty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">Project Bewerken</h2>
            <button onClick={() => setEditingProperty(null)} className="text-slate-400 hover:text-amber-400 text-3xl">×</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Project Naam</label>
              <input type="text" value={editingProperty.title} onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Locatie</label>
              <input type="text" value={editingProperty.location} onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Prijs (€)</label>
              <input type="number" value={editingProperty.price} onChange={(e) => setEditingProperty({...editingProperty, price: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">m²</label>
              <input type="number" value={editingProperty.m2} onChange={(e) => setEditingProperty({...editingProperty, m2: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Slaapkamers</label>
              <input type="number" value={editingProperty.bedrooms} onChange={(e) => setEditingProperty({...editingProperty, bedrooms: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Opleverdatum</label>
              <input type="text" value={editingProperty.deliveryDate} onChange={(e) => setEditingProperty({...editingProperty, deliveryDate: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">ROI %</label>
              <input type="number" step="0.1" value={editingProperty.roi} onChange={(e) => setEditingProperty({...editingProperty, roi: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Totaal Woningen</label>
              <input type="number" value={editingProperty.totalUnits} onChange={(e) => setEditingProperty({...editingProperty, totalUnits: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
            <div><label className="block text-sm font-medium text-amber-200/80 mb-2">Verkochte Woningen</label>
              <input type="number" value={editingProperty.soldUnits} onChange={(e) => setEditingProperty({...editingProperty, soldUnits: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-lg text-white" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { updateProperty(editingProperty.id, editingProperty); setEditingProperty(null); }} className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18} />Opslaan</button>
            <button onClick={() => setEditingProperty(null)} className="px-6 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl">Annuleren</button>
          </div>
        </div>
      </div>
    );
  }

  // Property Detail View (Virtuele Tour + Reservering)
  if (selectedProperty && viewMode !== 'overview') {
    const images = viewMode === 'floorplan' ? selectedProperty.floorplans : selectedProperty.images;
    const { available, percentageSold } = calculateAvailability(selectedProperty);
    const { monthsElapsed, soldPerMonth } = calculateSalesSpeed(selectedProperty);

    if (viewMode === 'reserve') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
          <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-amber-400" size={32} />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">Exclusieve Reservering</h2>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-xl text-white mb-2">{selectedProperty.title}</h3>
              <p className="text-slate-300 text-sm mb-3 flex items-center gap-2"><MapPin size={16} className="text-amber-400" />{selectedProperty.location}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-4">{formatPrice(selectedProperty.price)}</p>
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2">
                <AlertCircle size={18} className="text-red-400" />
                <span className="text-sm text-red-300 font-medium">Nog slechts {available} van {selectedProperty.totalUnits} beschikbaar</span>
              </div>
            </div>
            <div className="space-y-5">
              <div><label className="block text-sm font-semibold text-amber-200/80 mb-2 flex items-center gap-2"><User size={16} />Volledige Naam</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white" placeholder="Uw naam" /></div>
              <div><label className="block text-sm font-semibold text-amber-200/80 mb-2 flex items-center gap-2"><Mail size={16} />E-mailadres</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white" placeholder="uw.email@voorbeeld.nl" /></div>
              <div><label className="block text-sm font-semibold text-amber-200/80 mb-2 flex items-center gap-2"><Phone size={16} />Telefoonnummer</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white" placeholder="+31 6 12345678" /></div>
              <div><label className="block text-sm font-semibold text-amber-200/80 mb-2 flex items-center gap-2"><MessageSquare size={16} />Bericht</label>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white" placeholder="Vragen..." /></div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setViewMode('gallery')} className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl">Terug</button>
                <button onClick={handleReservation} className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-xl font-bold">Verstuur Aanvraag</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Gallery/Floorplan View
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="bg-slate-900/50 backdrop-blur-xl border-b border-amber-500/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <button onClick={() => { setViewMode('overview'); setSelectedProperty(null); setCurrentImageIndex(0); }} className="flex items-center gap-2 text-amber-200 hover:text-amber-400"><ChevronLeft size={20} />Terug</button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">{selectedProperty.title}</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-3 mb-6">
            <button onClick={() => setViewMode('gallery')} className={viewMode === 'gallery' ? 'px-6 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-medium' : 'px-6 py-3 rounded-xl flex items-center gap-2 bg-slate-800/50 border border-amber-500/20 text-amber-200'}><Image size={18} />Renders ({selectedProperty.images.length})</button>
            <button onClick={() => setViewMode('floorplan')} className={viewMode === 'floorplan' ? 'px-6 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 font-medium' : 'px-6 py-3 rounded-xl flex items-center gap-2 bg-slate-800/50 border border-amber-500/20 text-amber-200'}><Map size={18} />Plattegronden ({selectedProperty.floorplans.length})</button>
          </div>
          <div className="relative bg-black rounded-2xl overflow-hidden mb-8">
            <img src={images[currentImageIndex]} alt="Afbeelding" className="w-full h-[600px] object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-amber-500/90 text-white p-4 rounded-full"><ChevronLeft size={24} /></button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-amber-500/90 text-white p-4 rounded-full"><ChevronRight size={24} /></button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white px-6 py-3 rounded-full">{currentImageIndex + 1} / {images.length}</div>
              </>
            )}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">{selectedProperty.title}</h2>
              <p className="text-slate-300 text-lg mb-6">{selectedProperty.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4"><MapPin size={20} className="text-amber-400" /><div><p className="text-xs text-slate-400 uppercase">Locatie</p><p className="text-white font-medium">{selectedProperty.location}</p></div></div>
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4"><Maximize size={20} className="text-amber-400" /><div><p className="text-xs text-slate-400 uppercase">Oppervlakte</p><p className="text-white font-medium">{selectedProperty.m2} m²</p></div></div>
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4"><Bed size={20} className="text-amber-400" /><div><p className="text-xs text-slate-400 uppercase">Slaapkamers</p><p className="text-white font-medium">{selectedProperty.bedrooms}</p></div></div>
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4"><Calendar size={20} className="text-amber-400" /><div><p className="text-xs text-slate-400 uppercase">Oplevering</p><p className="text-white font-medium">{selectedProperty.deliveryDate}</p></div></div>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2"><Star className="text-amber-400" size={20} />Premium Kenmerken</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedProperty.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 bg-slate-800/30 rounded-lg p-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div><span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4"><Zap size={22} className="text-yellow-400" /><h3 className="font-bold text-xl text-white">Verkoopsprestaties</h3></div>
                <p className="text-slate-300 mb-4"><span className="text-2xl font-bold text-amber-400">{percentageSold}%</span> verkocht in {monthsElapsed} maanden - Gemiddeld <span className="font-semibold text-amber-300">{soldPerMonth.toFixed(1)}</span> verkopen/maand</p>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden"><div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 h-full" style={{ width: percentageSold + '%' }}></div></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-2xl p-8 h-fit">
              <div className="text-center mb-8">
                <p className="text-amber-200/60 text-sm uppercase tracking-widest mb-3 font-semibold">Exclusieve Investering</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-6">{formatPrice(selectedProperty.price)}</p>
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 rounded-xl p-5 mb-6">
                  <p className="text-amber-200/80 text-sm mb-2 font-medium">Verwacht Rendement</p>
                  <p className="text-4xl font-bold text-white">{selectedProperty.roi}%</p>
                  <p className="text-amber-300/60 text-xs mt-1">Jaarlijks ROI</p>
                </div>
                <div className={available <= 5 ? 'bg-gradient-to-br from-red-500/20 to-orange-500/10 border-2 border-red-400/50 animate-pulse rounded-xl p-5 mb-6' : 'bg-slate-800/30 border border-amber-500/20 rounded-xl p-5 mb-6'}>
                  <div className="flex items-center justify-center gap-3 mb-2"><Home size={22} className="text-amber-400" /><p className="font-bold text-2xl text-white">{available} <span className="text-lg text-slate-400">/ {selectedProperty.totalUnits}</span></p></div>
                  <p className={available <= 3 ? 'text-sm font-medium text-red-300' : available <= 5 ? 'text-sm font-medium text-orange-300' : 'text-sm font-medium text-amber-300'}>{available <= 3 ? 'Laatste Woningen!' : available <= 5 ? 'Bijna Uitverkocht' : 'Beschikbaar'}</p>
                </div>
                {selectedProperty.exclusive && (<div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/40 rounded-lg p-3 mb-6"><div className="flex items-center justify-center gap-2"><Award size={16} className="text-amber-400" /><span className="text-amber-200 text-xs font-bold uppercase">Exclusief Aanbod</span></div></div>)}
              </div>
              <button onClick={() => setViewMode('reserve')} disabled={available === 0} className={available === 0 ? 'w-full font-bold py-5 rounded-xl text-lg bg-slate-700 text-slate-500 cursor-not-allowed' : 'w-full font-bold py-5 rounded-xl text-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900'}>{available === 0 ? 'Uitverkocht' : 'Reserveer Nu'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Overview
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-amber-500/10">
        <div className="max-w-

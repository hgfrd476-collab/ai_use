import React, { useState, useRef } from 'react';
import { Bed, PlusCircle, Trash2, Users, Maximize, Edit3, DollarSign, Upload, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Modal } from '../../components/common/Modal';
import { RoomType } from '../../types';

export const OwnerAccommodationPage: React.FC = () => {
  const { currentUser, businesses, rooms, createRoom, deleteRoom, addToast } = useApp();

  const myBusinesses = businesses.filter(
    (b) => b.ownerId === currentUser.id && b.category === 'ACCOMMODATION'
  );
  const myBusinessIds = myBusinesses.map((b) => b.id);
  const myRooms = rooms.filter((r) => myBusinessIds.includes(r.businessId));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBizId, setSelectedBizId] = useState(myBusinessIds[0] || '');

  // New room fields (Strict max 3 photos)
  const MAX_ROOM_PHOTOS = 3;
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('DELUXE');
  const [basePrice, setBasePrice] = useState(45);
  const [maxGuests, setMaxGuests] = useState(2);
  const [bedType, setBedType] = useState('1 King Bed');
  const [sizeSqm, setSizeSqm] = useState(38);
  const [totalUnits, setTotalUnits] = useState(5);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const roomFileRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('Spacious room overlooking the tranquil gardens with en-suite rain shower.');

  const handleRoomFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = MAX_ROOM_PHOTOS - roomImages.length;
    if (availableSlots <= 0) {
      addToast('Limit Reached', 'You can upload a maximum of 3 room photos.', 'warning');
      return;
    }

    const fileArray = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      addToast('Limit: 3 Photos', `Only ${availableSlots} photo(s) added (max 3 allowed).`, 'info');
    }

    const promises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) resolve(e.target.result as string);
          else reject(new Error('Failed to read image'));
        };
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });
    });

    Promise.allSettled(promises).then((results) => {
      const newImages = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value);

      if (newImages.length > 0) {
        setRoomImages((prev) => [...prev, ...newImages].slice(0, MAX_ROOM_PHOTOS));
        addToast('Photos Ready', `Added ${newImages.length} room photo(s) (up to 3 total)`, 'success');
      }
    });
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBizId) {
      addToast('Error', 'Please select or create an accommodation business first.', 'error');
      return;
    }

    const finalImages = roomImages;

    createRoom({
      businessId: selectedBizId,
      name,
      roomType,
      description,
      basePrice,
      maxGuests,
      bedType,
      sizeSqm,
      sizeSqMeters: sizeSqm,
      capacity: { adults: maxGuests, children: 0, total: maxGuests },
      beds: bedType,
      bathrooms: 1,
      amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Balcony', 'Breakfast Included'],
      images: finalImages,
      totalInventory: totalUnits,
      totalUnits,
      availableUnits: totalUnits,
      status: 'ACTIVE',
      cancellationPolicy: 'FLEXIBLE',
    });

    setModalOpen(false);
    setName('');
    addToast('Room Created', `${name} has been added with ${finalImages.length} photo(s).`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manage Room & Unit Inventory ({myRooms.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure room types, rates per night, bed styles, and available unit capacity.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Room Type</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myRooms.map((room) => {
          const biz = businesses.find((b) => b.id === room.businessId);
          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 relative bg-slate-100 overflow-hidden">
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {room.roomType}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-0.5">
                    {biz?.name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{room.name}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Up to {room.maxGuests} guests
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5" /> {room.sizeSqm} m²
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{room.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Base Rate</span>
                      <PriceDisplay amountUSD={room.basePrice} period="night" size="sm" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">Available</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {room.availableUnits} / {room.totalUnits} Units
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => {
                    deleteRoom(room.id);
                    addToast('Room Removed', 'Room was removed from inventory.', 'info');
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Room / Unit"
        subtitle="Specify pricing, guest capacity, and bed arrangements"
      >
        <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Business Property</label>
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
            >
              {myBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Garden Pool Villa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Category</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="STANDARD">Standard</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
                <option value="VILLA">Private Villa</option>
                <option value="FAMILY">Family Room</option>
                <option value="DORM">Shared Dormitory</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rate (USD / night)</label>
              <input
                type="number"
                required
                min={5}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Guests</label>
              <input
                type="number"
                required
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Unit Count</label>
              <input
                type="number"
                required
                min={1}
                value={totalUnits}
                onChange={(e) => setTotalUnits(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Room Photos (Max 3 direct device uploads) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">
                Room Photos ({roomImages.length}/{MAX_ROOM_PHOTOS})
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                {roomImages.length >= MAX_ROOM_PHOTOS
                  ? 'Maximum 3 photos reached'
                  : `Can upload up to ${MAX_ROOM_PHOTOS - roomImages.length} more`}
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={roomFileRef}
              type="file"
              multiple
              accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.avif,.heic,.heif,.tif,.tiff"
              onChange={(e) => {
                handleRoomFileUpload(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />

            {roomImages.length < MAX_ROOM_PHOTOS ? (
              /* Drag & drop upload area */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleRoomFileUpload(e.dataTransfer.files);
                }}
                onClick={() => roomFileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20'
                }`}
              >
                <Upload className="w-5 h-5 text-emerald-600 animate-bounce" />
                <p className="font-bold text-slate-800 text-xs">
                  Click to upload or drag & drop room photos
                </p>
                <span className="text-[10px] text-slate-500">
                  Upload up to 3 photos directly from your device
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    roomFileRef.current?.click();
                  }}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Choose Room Photos ({roomImages.length}/3)</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Maximum 3 photos reached</p>
                    <p className="text-[10px] text-emerald-700">Delete an image below to replace it.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRoomImages([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer underline shrink-0"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Gallery Grid */}
            {roomImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {roomImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Room photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setRoomImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Car, PlusCircle, Trash2, Fuel, Gauge, Users, ShieldCheck, ToggleLeft, ToggleRight, Upload, Plus, Check, Globe, MapPin, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Modal } from '../../components/common/Modal';
import { VehicleType } from '../../types';

export const OwnerTransportationPage: React.FC = () => {
  const { currentUser, businesses, vehicles, createVehicle, deleteVehicle, addToast } = useApp();

  const myRentalBusinesses = businesses.filter(
    (b) => b.ownerId === currentUser.id && b.category === 'TRANSPORTATION'
  );
  const myRentalBusinessIds = myRentalBusinesses.map((b) => b.id);
  const myVehicles = vehicles.filter((v) => myRentalBusinessIds.includes(v.businessId));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBizId, setSelectedBizId] = useState(myRentalBusinessIds[0] || businesses[0]?.id || '');

  // Form (Strict max 3 photos)
  const MAX_VEHICLE_PHOTOS = 3;
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('SCOOTER');
  const [transmission, setTransmission] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
  const [fuelType, setFuelType] = useState<'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'>('PETROL');
  const [seats, setSeats] = useState(2);
  const [pricePerDay, setPricePerDay] = useState(12);
  const [depositUSD, setDepositUSD] = useState(50);
  const [totalVehicles, setTotalVehicles] = useState(5);
  const [locationUrl, setLocationUrl] = useState('');
  const [pickupLocationsInput, setPickupLocationsInput] = useState('Shop Headquarters, Siem Reap Downtown Hotel Delivery, Airport Pickup ($5)');
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const vehicleFileRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('Reliable fuel-efficient scooter, perfect for exploring temples and city boulevards.');

  const handleVehicleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = MAX_VEHICLE_PHOTOS - vehicleImages.length;
    if (availableSlots <= 0) {
      addToast('Limit Reached', 'You can upload a maximum of 3 vehicle photos.', 'warning');
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
        setVehicleImages((prev) => [...prev, ...newImages].slice(0, MAX_VEHICLE_PHOTOS));
        addToast('Photos Ready', `Added ${newImages.length} vehicle photo(s) (up to 3 total)`, 'success');
      }
    });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBizId) {
      addToast('Error', 'Please select or create a transportation rental business first.', 'error');
      return;
    }

    const finalImages = vehicleImages;
    const parsedPickups = pickupLocationsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createVehicle({
      businessId: selectedBizId,
      name,
      vehicleType: vehicleType as any,
      brand: 'Honda',
      model: name,
      year: 2024,
      color: 'Metallic Black',
      engine: '125cc',
      description,
      pricePerHour: Math.round(pricePerDay / 8),
      pricePerDay,
      deposit: depositUSD,
      depositUSD,
      transmission,
      fuelType,
      seats,
      helmetIncluded: true,
      insuranceIncluded: true,
      pickupLocations: parsedPickups.length > 0 ? parsedPickups : ['Shop Headquarters', 'Downtown Hotel Delivery'],
      locationUrl: locationUrl.trim() || undefined,
      mapUrl: locationUrl.trim() || undefined,
      deliveryAvailable: true,
      deliveryFee: 5,
      status: 'ACTIVE',
      cancellationPolicy: 'FLEXIBLE',
      features: ['Clean Helmet', 'Phone Mount', '24/7 Roadside Assistance'],
      images: finalImages,
      totalVehicles,
      availableVehicles: totalVehicles,
    });

    setModalOpen(false);
    setName('');
    addToast('Vehicle Added', `${name} added with ${finalImages.length} photo(s)!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manage Transportation Fleet ({myVehicles.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control motorbikes, scooters, tuk-tuks, SUVs, and rental fleet inventory.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Vehicle to Fleet</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myVehicles.map((veh) => {
          const biz = businesses.find((b) => b.id === veh.businessId);
          return (
            <div
              key={veh.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 relative bg-slate-100 overflow-hidden">
                  <img src={veh.images[0]} alt={veh.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-emerald-700 text-white text-[10px] font-bold">
                    {veh.vehicleType}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-0.5">
                    {biz?.name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{veh.name}</h3>

                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Seats</span>
                      <span className="font-bold text-slate-800">{veh.seats}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Gear</span>
                      <span className="font-bold text-slate-800">{veh.transmission}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Fuel</span>
                      <span className="font-bold text-slate-800">{veh.fuelType}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Rental Rate</span>
                      <PriceDisplay amountUSD={veh.pricePerDay} period="day" size="sm" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">Deposit</span>
                      <span className="text-xs font-bold text-slate-800">${veh.depositUSD} USD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">
                  {veh.availableVehicles} of {veh.totalVehicles} in stock
                </span>
                <button
                  onClick={() => {
                    deleteVehicle(veh.id);
                    addToast('Vehicle Deleted', 'Vehicle was removed from fleet.', 'info');
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Vehicle to Fleet"
        subtitle="Specify technical specs, pricing, and required deposit"
      >
        <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Rental Business</label>
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
            >
              {myRentalBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Model Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Honda Click 125cc (2024)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vehicle Category</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="SCOOTER">Scooter / Moped</option>
                <option value="MOTORBIKE">Motorbike / Trail</option>
                <option value="CAR">Compact Car</option>
                <option value="SUV">SUV 4x4</option>
                <option value="VAN">VIP Van / Minibus</option>
                <option value="TUKTUK">Traditional Tuk-Tuk</option>
                <option value="BICYCLE">Bicycle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (USD / day)</label>
              <input
                type="number"
                required
                min={2}
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deposit (USD)</label>
              <input
                type="number"
                required
                min={0}
                value={depositUSD}
                onChange={(e) => setDepositUSD(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fleet Count</label>
              <input
                type="number"
                required
                min={1}
                value={totalVehicles}
                onChange={(e) => setTotalVehicles(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Pickup Points & Location URL */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pickup & Handoff Locations <span className="text-xs font-normal text-slate-400">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Shop Headquarters, Airport Pickup ($5), Downtown Hotel Delivery"
                value={pickupLocationsInput}
                onChange={(e) => setPickupLocationsInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Location URL / Google Maps Link
                  <span className="ml-1.5 text-xs font-normal text-slate-400">(Optional map link)</span>
                </label>
                {locationUrl.trim() && (
                  <a
                    href={locationUrl.startsWith('http') ? locationUrl : `https://${locationUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="e.g. https://maps.google.com/?q=... or https://goo.gl/maps/..."
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  className="w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 transition text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Photos (Max 3 direct device uploads) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">
                Vehicle Photos ({vehicleImages.length}/{MAX_VEHICLE_PHOTOS})
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                {vehicleImages.length >= MAX_VEHICLE_PHOTOS
                  ? 'Maximum 3 photos reached'
                  : `Can upload up to ${MAX_VEHICLE_PHOTOS - vehicleImages.length} more`}
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={vehicleFileRef}
              type="file"
              multiple
              accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.avif,.heic,.heif,.tif,.tiff"
              onChange={(e) => {
                handleVehicleFileUpload(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />

            {vehicleImages.length < MAX_VEHICLE_PHOTOS ? (
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
                  handleVehicleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => vehicleFileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20'
                }`}
              >
                <Upload className="w-5 h-5 text-emerald-600 animate-bounce" />
                <p className="font-bold text-slate-800 text-xs">
                  Click to upload or drag & drop vehicle photos
                </p>
                <span className="text-[10px] text-slate-500">
                  Upload up to 3 photos directly from your device
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    vehicleFileRef.current?.click();
                  }}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Choose Vehicle Photos ({vehicleImages.length}/3)</span>
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
                  onClick={() => setVehicleImages([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer underline shrink-0"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Gallery Grid */}
            {vehicleImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {vehicleImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Vehicle photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setVehicleImages((prev) => prev.filter((_, i) => i !== idx))}
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
              Save Vehicle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

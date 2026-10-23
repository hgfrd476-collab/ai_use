import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Upload,
  Trash2,
  Plus,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessCategory, BusinessType } from '../../types';
import { LOCATIONS } from '../../data/locations';

export const OwnerBusinessCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, createBusiness, addToast } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [khmerName, setKhmerName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('ACCOMMODATION');
  const [businessType, setBusinessType] = useState<BusinessType>('HOTEL');
  const [description, setDescription] = useState('');

  // Step 2
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(LOCATIONS[0].name);
  const [province, setProvince] = useState(LOCATIONS[0].province);
  const [locationUrl, setLocationUrl] = useState('');
  const [phone, setPhone] = useState('+855 12 345 678');
  const [email, setEmail] = useState(currentUser.email);
  const [telegram, setTelegram] = useState('@host_cambodia');

  // Step 3: Multi-image media gallery (Strict max 3 images)
  const MAX_IMAGES = 3;
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [amenityInput, setAmenityInput] = useState('Free High-Speed WiFi, Outdoor Swimming Pool, Tropical Garden, Daily Khmer Breakfast, Airport Shuttle');

  // Step 4
  const [registrationNumber, setRegistrationNumber] = useState('MOC-REP-2024-8849');
  const [taxNumber, setTaxNumber] = useState('K009-9021882');
  const [bankName, setBankName] = useState('ABA Bank');
  const [accountName, setAccountName] = useState(currentUser.name);
  const [accountNumber, setAccountNumber] = useState('001 882 994');

  const popularAmenities = [
    'Free High-Speed WiFi',
    'Outdoor Swimming Pool',
    'Air Conditioning',
    'Daily Khmer Breakfast',
    'Airport Shuttle',
    'Tropical Garden',
    'Spa & Wellness',
    'Restaurant & Bar',
    '24/7 Front Desk',
    'Free Parking',
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      addToast('Limit Reached', 'You can upload a maximum of 3 images.', 'warning');
      return;
    }

    const fileArray = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      addToast('Limit: 3 Images', `Only the first ${availableSlots} image${availableSlots > 1 ? 's were' : ' was'} added (max 3 allowed).`, 'info');
    }

    const promises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        // Accept ANY image file format (PNG, JPG, WEBP, GIF, SVG, BMP, HEIC, AVIF, TIFF, etc.)
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read image file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });
    });

    Promise.allSettled(promises).then((results) => {
      const newImages = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value);

      if (newImages.length > 0) {
        setImages((prev) => {
          const updated = [...prev, ...newImages].slice(0, MAX_IMAGES);
          if (!coverImage || !prev.includes(coverImage)) {
            setCoverImage(updated[0]);
          }
          return updated;
        });
        addToast(
          'Images Added',
          `Added ${newImages.length} image${newImages.length > 1 ? 's' : ''} (up to 3 total)`,
          'success'
        );
      }
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const targetImage = prev[indexToRemove];
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (coverImage === targetImage) {
        setCoverImage(updated[0] || '');
      }
      return updated;
    });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  const handleSetCover = (imgUrl: string) => {
    setCoverImage(imgUrl);
    addToast('Cover Photo Selected', 'Set as primary showcase image', 'info');
  };

  const handleToggleAmenity = (amenity: string) => {
    const currentList = amenityInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (currentList.includes(amenity)) {
      setAmenityInput(currentList.filter((item) => item !== amenity).join(', '));
    } else {
      setAmenityInput([...currentList, amenity].join(', '));
    }
  };

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const loc = LOCATIONS.find((l) => l.name === cityName);
    if (loc) {
      setProvince(loc.province);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amenitiesList = amenityInput.split(',').map((s) => s.trim()).filter(Boolean);
    const finalCover = coverImage || images[0] || '';
    const finalImages = images.length > 0 ? images : (finalCover ? [finalCover] : []);

    createBusiness({
      ownerId: currentUser.id,
      name,
      khmerName: khmerName || undefined,
      description,
      category,
      type: (businessType as any) || 'OTHER',
      businessType,
      address,
      city,
      province,
      country: 'Cambodia',
      latitude: 11.5564,
      longitude: 104.9282,
      locationUrl: locationUrl.trim() || undefined,
      mapUrl: locationUrl.trim() || undefined,
      openingHours: '08:00 - 20:00',
      contactPerson: currentUser.name,
      phone,
      email,
      telegram,
      logo: finalCover,
      coverImage: finalCover,
      images: finalImages,
      amenities: amenitiesList,
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'FLEXIBLE',
      },
      verificationDocs: {
        registrationNumber,
        taxNumber,
      },
      bankAccount: {
        bankName,
        accountName,
        accountNumber,
      },
    });

    addToast('Business Submitted', `${name} is submitted for Super Admin verification!`, 'success');
    navigate('/owner/businesses');
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Register New Business Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete the 4-step verification onboarding to list your property or fleet on KampujaGo.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Media & Features' },
          { num: 4, label: 'Payout & Docs' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition ${
              step === s.num
                ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                : step > s.num
                ? 'bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <span>{s.num}. {s.label}</span>
          </div>
        ))}
      </div>

      {/* Wizard Form */}
      <form
        onSubmit={
          step === 4
            ? handleSubmit
            : (e) => {
                e.preventDefault();
                if (step === 3 && images.length === 0) {
                  addToast('Photo Required', 'Please upload at least 1 photo (up to 3 photos) for your listing before proceeding.', 'error');
                  return;
                }
                setStep(step + 1);
              }
        }
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-xs"
      >
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Step 1: Entity Details</h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Name (English)</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Angkor Villa & Spa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Khmer Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. វីឡា រ៉ូយ៉ាល់ អង្គរ"
                value={khmerName}
                onChange={(e) => setKhmerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                >
                  <option value="ACCOMMODATION">Accommodation (Stays)</option>
                  <option value="TRANSPORTATION">Transportation (Vehicles)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Property / Fleet Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                >
                  <option value="HOTEL">Boutique Hotel</option>
                  <option value="RESORT">Luxury Resort</option>
                  <option value="VILLA">Private Villa</option>
                  <option value="HOMESTAY">Local Homestay</option>
                  <option value="VEHICLE_RENTAL">Scooter & Motorbike Rental</option>
                  <option value="TAXI_SERVICE">Private Taxi / Chauffeur Service</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Public Story & Description</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your hospitality experience, tranquil gardens, local breakfast, or safety record..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location & Contact */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Step 2: Location & Contact Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Province</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="e.g. Street 08, Wat Damnak Village, Sala Kamreuk"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Location URL / Map Link
                  <span className="ml-1.5 text-xs font-normal text-slate-400">(Google Maps, Apple Maps, or OpenStreetMap)</span>
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
                  placeholder="e.g. https://maps.google.com/?q=Siem+Reap or https://goo.gl/maps/..."
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  className="w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:border-emerald-500 transition text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Optional: Paste your Google Maps pinpoint or coordinates URL so guests and tourists can easily navigate to your property.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Direct Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Host Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telegram Handle</label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos & Amenities */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Step 3: Media & Amenities</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload showcase photos of your property or fleet directly from your device (maximum 3 photos).
              </p>
            </div>

            {/* Photo Upload Section (Max 3 Images) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">
                  Property / Fleet Photos ({images.length}/3)
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {images.length >= MAX_IMAGES
                    ? 'Maximum 3 photos reached'
                    : `Can upload up to ${MAX_IMAGES - images.length} more`}
                </span>
              </div>

              {/* Hidden file input supporting multiple files of any image type */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.avif,.heic,.heif,.tif,.tiff"
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  e.target.value = ''; // reset so same files can be re-selected if needed
                }}
                className="hidden"
                id="listing-images-upload"
              />

              {images.length < MAX_IMAGES ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      Click to upload or drag & drop photos
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload from your phone or computer (up to 3 photos)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Choose Photos ({images.length}/3)</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Maximum 3 photos reached</p>
                      <p className="text-[11px] text-emerald-700">Remove an image below if you want to replace it.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImages([]);
                      setCoverImage('');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer underline shrink-0 ml-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Gallery of Uploaded Images (Max 3) */}
            {images.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      Uploaded Photos ({images.length}/3)
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      • Click any star to set as Primary Cover Photo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImages([]);
                      setCoverImage('');
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {images.map((img, idx) => {
                    const isCover = (coverImage || images[0]) === img;
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-2xl overflow-hidden border-2 transition-all aspect-4/3 bg-slate-100 ${
                          isCover
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Uploaded photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80';
                          }}
                        />

                        {/* Order badge */}
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white font-bold text-[9px] z-10">
                          #{idx + 1}
                        </div>

                        {/* Cover badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-md z-10">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Cover Photo</span>
                          </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                          <div className="flex items-center justify-between">
                            {/* Reorder buttons */}
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx - 1)}
                                  className="p-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-xs cursor-pointer"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx + 1)}
                                  className="p-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-xs cursor-pointer"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer transition"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex justify-center">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(img)}
                                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition"
                                title="Set as Cover Photo"
                              >
                                <Star className="w-3 h-3" />
                                <span>Make Cover</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>No photos uploaded yet. Please upload at least 1 photo to continue.</span>
              </div>
            )}

            {/* Amenities Section */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block font-bold text-slate-700">
                Amenities & Features
              </label>

              {/* Popular quick tags */}
              <div className="flex flex-wrap gap-1.5">
                {popularAmenities.map((amenity) => {
                  const isSelected = amenityInput
                    .split(',')
                    .map((s) => s.trim())
                    .includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 font-medium mb-1">
                  Custom Amenities (Comma separated):
                </span>
                <textarea
                  rows={3}
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Free High-Speed WiFi, Outdoor Swimming Pool, Airport Shuttle..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Verification & Payout */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Step 4: Government Verification & Payout Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business License / Registration No.</label>
                <input
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tax TIN / Patent Number</label>
                <input
                  type="text"
                  required
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Cambodian Bank Payout Details (ABA / Bakong)
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-emerald-300 bg-white p-2 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full rounded-xl border border-emerald-300 bg-white p-2 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-emerald-300 bg-white p-2 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <span>{step === 4 ? 'Submit for Verification' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

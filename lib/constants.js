export const CITIES = [
  'Bhopal', 'Indore', 'Patna', 'Kota', 'Jaipur', 'Lucknow', 'Varanasi',
  'Noida', 'Delhi/NCR', 'Chandigarh', 'Dehradun', 'Ranchi', 'Nagpur',
  'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Mumbai', 'Ahmedabad', 'Gurgaon'
];

export const CITY_AREAS = {
  'Bhopal': ['MP Nagar Zone-1', 'MP Nagar Zone-2', 'Arera Colony', 'Shahpura', 'Hoshangabad Road', 'Kolar Road', 'Misrod', 'Berasia Road', 'Ayodhya Nagar', 'Govindpura', 'Bairagarh', 'Mandideep', 'Karond', 'Bhopal Old City', 'New Market', 'TT Nagar', 'Habibganj', 'Vijay Nagar', 'Bittan Market', 'Piplani'],
  'Indore': ['Vijay Nagar', 'Palasia', 'Bhawarkuan', 'Rajwada', 'Sapna Sangeeta', 'AB Road', 'MG Road', 'Rau', 'Nipania', 'Scheme 78'],
  'Patna': ['Boring Road', 'Kankarbagh', 'Rajendra Nagar', 'Ashok Rajpath', 'Bailey Road', 'Danapur', 'Patna City', 'Phulwari Sharif'],
  'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park', 'Tonk Road', 'Ajmer Road', 'Jagatpura'],
  'Kota': ['Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar', 'Kunhari', 'Gumanpura', 'Borkhera'],
  'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Aminabad', 'Chowk', 'Alambagh'],
  'Noida': ['Sector 62', 'Sector 18', 'Sector 50', 'Sector 137', 'Greater Noida', 'Sector 76'],
  'Delhi/NCR': ['Connaught Place', 'Dwarka', 'Rohini', 'Saket', 'Lajpat Nagar', 'Karol Bagh', 'Janakpuri'],
  'Pune': ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Wakad', 'Koregaon Park', 'Baner', 'Hadapsar'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'BTM Layout', 'Electronic City', 'Marathahalli'],
  'Mumbai': ['Andheri', 'Bandra', 'Powai', 'Malad', 'Goregaon', 'Thane', 'Dadar'],
  'Hyderabad': ['Madhapur', 'Gachibowli', 'Kondapur', 'Banjara Hills', 'Kukatpally', 'Miyapur'],
  'Chennai': ['Anna Nagar', 'T Nagar', 'Velachery', 'Adyar', 'OMR', 'Tambaram'],
  'Kolkata': ['Salt Lake', 'New Town', 'Park Street', 'Gariahat', 'Howrah', 'Dum Dum'],
};

export const PROPERTY_TYPES = [
  '1RK', '1BHK', '2BHK', '3BHK', '4BHK+', 'PG', 'Hostel', 'Flat', 'Studio',
  'Penthouse', 'Villa', 'Independent House', 'Shop', 'Office', 'Warehouse'
];

export const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

export const AVAILABLE_FOR = ['Boys', 'Girls', 'Family', 'Couples', 'Working Professionals', 'Students', 'Anyone', 'Company'];

export const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'ac', label: 'AC', icon: '❄️' },
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'laundry', label: 'Laundry', icon: '👕' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'gym', label: 'Gym', icon: '💪' },
  { id: 'power_backup', label: 'Power Backup', icon: '🔋' },
  { id: 'water', label: '24/7 Water', icon: '💧' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'cctv', label: 'CCTV', icon: '📹' },
  { id: 'lift', label: 'Lift', icon: '🛗' },
  { id: 'tv', label: 'TV', icon: '📺' },
  { id: 'fridge', label: 'Fridge', icon: '🧊' },
  { id: 'washing_machine', label: 'Washing Machine', icon: '🫧' },
  { id: 'geyser', label: 'Geyser', icon: '🚿' },
  { id: 'balcony', label: 'Balcony', icon: '🌅' },
  { id: 'garden', label: 'Garden', icon: '🌿' },
  { id: 'pet_friendly', label: 'Pet Friendly', icon: '🐾' },
  { id: 'attached_bath', label: 'Attached Bath', icon: '🛁' },
  { id: 'furnished_kitchen', label: 'Modular Kitchen', icon: '🏠' },
];

export const COMING_SOON_SERVICES = [
  { id: 'home-services', name: 'Home Services', icon: '🔧', color: 'blue', description: 'Electricians, Plumbers, AC Repair, Carpenters, Painters & Cleaners at your doorstep', count: 64 },
  { id: 'vehicle-services', name: 'Vehicle Services', icon: '🚗', color: 'purple', description: 'Car & Bike servicing, washing, repairs and emergency roadside assistance', count: 37 },
  { id: 'medical-services', name: 'Medical Services', icon: '🏥', color: 'red', description: 'Doctor consultations, mental health support and medical assistance', count: 14 },
  { id: 'utility-booking', name: 'Utility Booking', icon: '💧', color: 'teal', description: 'Book gas cylinders and water tankers easily', count: 2 },
  { id: 'labour-chowk', name: 'Labour Chowk', icon: '👷', color: 'amber', description: 'Find contractors, labourers and skilled workers for your projects', count: 17 },
];

export const POPULAR_AREAS = [
  { name: 'MP Nagar', city: 'Bhopal' },
  { name: 'Vijay Nagar', city: 'Indore' },
  { name: 'Boring Road', city: 'Patna' },
  { name: 'Malviya Nagar', city: 'Jaipur' },
];

export const FOOD_TYPES = ['Veg', 'Non-Veg', 'Both'];

export const CUISINES = ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Bengali', 'Gujarati', 'Rajasthani', 'Maharashtrian'];

import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URL)
      await client.connect()
    }
    if (!db) {
      db = client.db(process.env.DB_NAME)
    }
    return db
  } catch (err) {
    client = null
    db = null
    throw err
  }
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

function json(data, status = 200) {
  return handleCORS(NextResponse.json(data, { status }))
}

function error(message, status = 400) {
  return handleCORS(NextResponse.json({ error: message }, { status }))
}

// Auth helper - get user from token
async function getUser(request, db) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  const session = await db.collection('sessions').findOne({ token, active: true })
  if (!session) return null
  const user = await db.collection('users').findOne({ id: session.userId })
  return user
}

// Require auth
async function requireAuth(request, db) {
  const user = await getUser(request, db)
  if (!user) throw new Error('Unauthorized')
  return user
}

// Parse params from URL
function getPathSegments(path) {
  return path.split('/').filter(Boolean)
}

function getSearchParams(request) {
  const url = new URL(request.url)
  const params = {}
  url.searchParams.forEach((value, key) => { params[key] = value })
  return params
}

// Sample seed data
const SAMPLE_PROPERTIES = [
  {
    title: 'Spacious 2BHK in MP Nagar Zone-1',
    description: 'Beautifully furnished 2BHK apartment with balcony, near DB Mall. Ideal for working professionals. 24/7 water and security.',
    propertyType: '2BHK', category: 'Residential', availableFor: 'Working Professionals',
    dependency: 'Independent', rent: 15000, deposit: 30000, negotiable: true,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'ac', 'parking', 'water', 'security', 'geyser', 'balcony'],
    address: 'Plot 45, Zone-1, MP Nagar', city: 'Bhopal', area: 'MP Nagar Zone-1', pincode: '462011',
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'],
    verified: true, featured: true, views: 342, status: 'ACTIVE'
  },
  {
    title: 'Affordable PG for Boys in Arera Colony',
    description: 'Clean and hygienic PG with meals. Walking distance from MANIT. WiFi and laundry included.',
    propertyType: 'PG', category: 'Student', availableFor: 'Boys',
    dependency: 'Dependent', rent: 5500, deposit: 5500, negotiable: false,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'laundry', 'water', 'kitchen', 'tv'],
    address: 'E-5, Arera Colony', city: 'Bhopal', area: 'Arera Colony', pincode: '462016',
    photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'],
    verified: true, featured: false, views: 189, status: 'ACTIVE'
  },
  {
    title: 'Modern 1BHK Near Habibganj Station',
    description: 'Newly renovated 1BHK flat, 5 min walk from Habibganj station. Perfect for bachelors and couples.',
    propertyType: '1BHK', category: 'Residential', availableFor: 'Anyone',
    dependency: 'Independent', rent: 9000, deposit: 18000, negotiable: true,
    furnishing: 'Semi Furnished', amenities: ['parking', 'water', 'security', 'lift', 'power_backup'],
    address: '23, Station Road, Habibganj', city: 'Bhopal', area: 'Habibganj', pincode: '462024',
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop'],
    verified: false, featured: false, views: 95, status: 'ACTIVE'
  },
  {
    title: 'Girls Hostel with Meals in Shahpura',
    description: 'Safe and secure girls hostel with home-cooked meals. AC rooms available. Near colleges and coaching centers.',
    propertyType: 'Hostel', category: 'Student', availableFor: 'Girls',
    dependency: 'Dependent', rent: 4500, deposit: 4500, negotiable: false,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'ac', 'water', 'cctv', 'kitchen', 'geyser'],
    address: 'Shahpura Main Road', city: 'Bhopal', area: 'Shahpura', pincode: '462039',
    photos: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop'],
    verified: true, featured: true, views: 256, status: 'ACTIVE'
  },
  {
    title: 'Luxury 3BHK Villa in Hoshangabad Road',
    description: 'Premium 3BHK villa with garden, modular kitchen, and 2 parking spots. Gated community with club house.',
    propertyType: '3BHK', category: 'Residential', availableFor: 'Family',
    dependency: 'Independent', rent: 28000, deposit: 56000, negotiable: true,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'ac', 'parking', 'gym', 'garden', 'lift', 'security', 'cctv', 'power_backup', 'furnished_kitchen'],
    address: 'Green Valley, Hoshangabad Road', city: 'Bhopal', area: 'Hoshangabad Road', pincode: '462026',
    photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop'],
    verified: true, featured: false, views: 178, status: 'ACTIVE'
  },
  {
    title: 'Budget 1RK in Govindpura',
    description: 'Single room kitchen, ideal for students and bachelors. Close to industrial area and bus stop.',
    propertyType: '1RK', category: 'Residential', availableFor: 'Boys',
    dependency: 'Dependent', rent: 4000, deposit: 4000, negotiable: true,
    furnishing: 'Unfurnished', amenities: ['water', 'parking'],
    address: 'Govindpura Main Market', city: 'Bhopal', area: 'Govindpura', pincode: '462023',
    photos: ['https://images.unsplash.com/photo-1598928506311-c55ez5d8aeb?w=600&h=400&fit=crop'],
    verified: false, featured: false, views: 67, status: 'ACTIVE'
  },
  {
    title: 'Premium Studio Apartment Near New Market',
    description: 'Fully furnished studio with kitchenette, AC, and high-speed WiFi. Walking distance from New Market.',
    propertyType: 'Studio', category: 'Residential', availableFor: 'Anyone',
    dependency: 'Independent', rent: 12000, deposit: 24000, negotiable: false,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'ac', 'geyser', 'fridge', 'tv', 'washing_machine', 'attached_bath'],
    address: 'Near New Market, TT Nagar', city: 'Bhopal', area: 'New Market', pincode: '462003',
    photos: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&h=400&fit=crop'],
    verified: true, featured: true, views: 312, status: 'ACTIVE'
  },
  {
    title: 'Cozy 2BHK for Family in Kolar Road',
    description: 'Well-maintained 2BHK in a family-friendly society. Near schools and hospitals. Ample parking.',
    propertyType: '2BHK', category: 'Residential', availableFor: 'Family',
    dependency: 'Independent', rent: 11000, deposit: 22000, negotiable: true,
    furnishing: 'Semi Furnished', amenities: ['parking', 'water', 'security', 'garden', 'power_backup'],
    address: 'Kolar Road, Near AIIMS', city: 'Bhopal', area: 'Kolar Road', pincode: '462042',
    photos: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop'],
    verified: false, featured: false, views: 134, status: 'ACTIVE'
  },
  {
    title: '2BHK Near Vijay Nagar Square - Indore',
    description: 'Spacious 2BHK near Vijay Nagar Square. Close to cafes, restaurants, and metro. Modern interiors.',
    propertyType: '2BHK', category: 'Residential', availableFor: 'Working Professionals',
    dependency: 'Independent', rent: 14000, deposit: 28000, negotiable: true,
    furnishing: 'Semi Furnished', amenities: ['wifi', 'ac', 'parking', 'lift', 'security'],
    address: 'Vijay Nagar Square', city: 'Indore', area: 'Vijay Nagar', pincode: '452010',
    photos: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop'],
    verified: true, featured: false, views: 220, status: 'ACTIVE'
  },
  {
    title: 'PG for Students near Boring Road - Patna',
    description: 'Student PG with all meals, WiFi, and study area. Walking distance from coaching centers.',
    propertyType: 'PG', category: 'Student', availableFor: 'Boys',
    dependency: 'Dependent', rent: 6000, deposit: 6000, negotiable: false,
    furnishing: 'Fully Furnished', amenities: ['wifi', 'kitchen', 'laundry', 'water', 'cctv'],
    address: 'Boring Road', city: 'Patna', area: 'Boring Road', pincode: '800001',
    photos: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'],
    verified: true, featured: true, views: 445, status: 'ACTIVE'
  },
];

const CITY_AREAS_MAP = {
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

const ALL_CITIES = ['Bhopal', 'Indore', 'Patna', 'Kota', 'Jaipur', 'Lucknow', 'Varanasi', 'Noida', 'Delhi/NCR', 'Chandigarh', 'Dehradun', 'Ranchi', 'Nagpur', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Mumbai', 'Ahmedabad', 'Gurgaon'];

// Seed properties once
async function seedData(db) {
  const count = await db.collection('properties').countDocuments();
  if (count === 0) {
    const now = new Date();
    const properties = SAMPLE_PROPERTIES.map((p, i) => ({
      ...p,
      id: uuidv4(),
      ownerId: 'system',
      ownerName: ['Rajesh Kumar', 'Sunita Devi', 'Vikram Singh', 'Neha Gupta', 'Amit Tiwari', 'Priya Sharma', 'Rohit Verma', 'Meena Patel', 'Suresh Yadav', 'Kavita Joshi'][i % 10],
      ownerPhone: `+919${String(8000000 + i).padStart(7, '0')}`,
      createdAt: new Date(now - (i * 86400000)),
      updatedAt: new Date(),
    }));
    await db.collection('properties').insertMany(properties);
  }
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = '/' + path.join('/')
  const method = request.method

  try {
    const db = await connectToMongo()
    await seedData(db)

    // === HEALTH ===
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ message: 'ProjectX API is running', status: 'ok' })
    }

    // === AUTH ROUTES ===
    if (route === '/v1/auth/register' && method === 'POST') {
      const body = await request.json()
      const { name, phone, email, password } = body
      if (!name || !phone || !password) return error('Name, phone, and password are required')
      
      const existing = await db.collection('users').findOne({ phone })
      if (existing) return error('Phone number already registered', 409)
      
      const user = {
        id: uuidv4(), name, phone, email: email || null, password,
        city: null, area: null, interests: [], verified: false,
        createdAt: new Date(), updatedAt: new Date()
      }
      await db.collection('users').insertOne(user)
      // Auto send OTP
      await db.collection('otps').updateOne(
        { phone }, { $set: { phone, otp: '123456', createdAt: new Date() } }, { upsert: true }
      )
      return json({ message: 'Registered successfully. OTP sent.', userId: user.id }, 201)
    }

    if (route === '/v1/auth/send-otp' && method === 'POST') {
      const { phone } = await request.json()
      if (!phone) return error('Phone is required')
      await db.collection('otps').updateOne(
        { phone }, { $set: { phone, otp: '123456', createdAt: new Date() } }, { upsert: true }
      )
      return json({ message: 'OTP sent successfully' })
    }

    if (route === '/v1/auth/verify-otp' && method === 'POST') {
      const { phone, otp } = await request.json()
      if (!phone || !otp) return error('Phone and OTP required')
      const otpDoc = await db.collection('otps').findOne({ phone })
      if (!otpDoc || otpDoc.otp !== otp) return error('Invalid OTP', 401)
      
      await db.collection('users').updateOne({ phone }, { $set: { verified: true } })
      const user = await db.collection('users').findOne({ phone })
      if (!user) return error('User not found', 404)
      
      const token = uuidv4()
      const refreshToken = uuidv4()
      await db.collection('sessions').insertOne({ token, refreshToken, userId: user.id, active: true, createdAt: new Date() })
      await db.collection('otps').deleteOne({ phone })
      
      const { password: _, _id: __, ...safeUser } = user
      return json({ accessToken: token, refreshToken, user: safeUser })
    }

    if (route === '/v1/auth/login/phone' && method === 'POST') {
      const { phone, otp } = await request.json()
      if (!phone || !otp) return error('Phone and OTP required')
      const otpDoc = await db.collection('otps').findOne({ phone })
      if (!otpDoc || otpDoc.otp !== otp) return error('Invalid OTP', 401)
      
      const user = await db.collection('users').findOne({ phone })
      if (!user) return error('User not found. Please register first.', 404)
      
      const token = uuidv4()
      const refreshToken = uuidv4()
      await db.collection('sessions').insertOne({ token, refreshToken, userId: user.id, active: true, createdAt: new Date() })
      await db.collection('otps').deleteOne({ phone })
      
      const { password: _, _id: __, ...safeUser } = user
      return json({ accessToken: token, refreshToken, user: safeUser })
    }

    if (route === '/v1/auth/login/email' && method === 'POST') {
      const { email, password } = await request.json()
      if (!email || !password) return error('Email and password required')
      const user = await db.collection('users').findOne({ email })
      if (!user || user.password !== password) return error('Invalid credentials', 401)
      
      const token = uuidv4()
      const refreshToken = uuidv4()
      await db.collection('sessions').insertOne({ token, refreshToken, userId: user.id, active: true, createdAt: new Date() })
      
      const { password: _, _id: __, ...safeUser } = user
      return json({ accessToken: token, refreshToken, user: safeUser })
    }

    if (route === '/v1/auth/refresh-token' && method === 'POST') {
      const { refreshToken } = await request.json()
      const session = await db.collection('sessions').findOne({ refreshToken, active: true })
      if (!session) return error('Invalid refresh token', 401)
      
      const newToken = uuidv4()
      await db.collection('sessions').updateOne({ refreshToken }, { $set: { token: newToken } })
      return json({ accessToken: newToken })
    }

    if (route === '/v1/auth/logout' && method === 'POST') {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        await db.collection('sessions').updateMany({ token }, { $set: { active: false } })
      }
      return json({ message: 'Logged out' })
    }

    if (route === '/v1/auth/forgot-password' && method === 'POST') {
      const { phone } = await request.json()
      if (!phone) return error('Phone required')
      await db.collection('otps').updateOne(
        { phone }, { $set: { phone, otp: '123456', createdAt: new Date() } }, { upsert: true }
      )
      return json({ message: 'OTP sent for password reset' })
    }

    if (route === '/v1/auth/reset-password' && method === 'POST') {
      const { phone, otp, newPassword } = await request.json()
      if (!phone || !otp || !newPassword) return error('All fields required')
      const otpDoc = await db.collection('otps').findOne({ phone })
      if (!otpDoc || otpDoc.otp !== otp) return error('Invalid OTP', 401)
      await db.collection('users').updateOne({ phone }, { $set: { password: newPassword } })
      await db.collection('otps').deleteOne({ phone })
      return json({ message: 'Password reset successful' })
    }

    // === USER ROUTES ===
    if (route === '/v1/users/me' && method === 'GET') {
      const user = await requireAuth(request, db)
      const { password: _, _id: __, ...safeUser } = user
      return json({ user: safeUser })
    }

    if (route === '/v1/users/profile-setup' && method === 'PUT') {
      const user = await requireAuth(request, db)
      const body = await request.json()
      const { name, city, area, interests } = body
      await db.collection('users').updateOne(
        { id: user.id },
        { $set: { name: name || user.name, city, area, interests: interests || [], updatedAt: new Date() } }
      )
      const updated = await db.collection('users').findOne({ id: user.id })
      const { password: _, _id: __, ...safeUser } = updated
      return json({ user: safeUser })
    }

    if (route === '/v1/users/me' && method === 'PUT') {
      const user = await requireAuth(request, db)
      const body = await request.json()
      const { password: _, _id: __, id: ___, ...updates } = body
      await db.collection('users').updateOne({ id: user.id }, { $set: { ...updates, updatedAt: new Date() } })
      const updated = await db.collection('users').findOne({ id: user.id })
      const { password: p, _id: i, ...safeUser } = updated
      return json({ user: safeUser })
    }

    // === LOCATION ROUTES ===
    if (route === '/v1/location/cities' && method === 'GET') {
      return json({ cities: ALL_CITIES })
    }

    // Match /v1/location/cities/:city/areas
    const cityAreasMatch = route.match(/^\/v1\/location\/cities\/(.+)\/areas$/)
    if (cityAreasMatch && method === 'GET') {
      const city = decodeURIComponent(cityAreasMatch[1])
      const areas = CITY_AREAS_MAP[city] || []
      return json({ city, areas })
    }

    if (route === '/v1/location/detect' && method === 'POST') {
      return json({ city: 'Bhopal', area: 'MP Nagar Zone-1' })
    }

    // === PROPERTY ROUTES ===
    if (route === '/v1/properties' && method === 'GET') {
      const params = getSearchParams(request)
      const filter = { status: 'ACTIVE' }
      if (params.city) filter.city = params.city
      if (params.type) filter.propertyType = params.type
      if (params.area) filter.area = params.area
      if (params.availableFor) filter.availableFor = params.availableFor
      if (params.furnishing) filter.furnishing = params.furnishing
      if (params.verified === 'true') filter.verified = true
      if (params.negotiable === 'true') filter.negotiable = true
      if (params.budgetMin || params.budgetMax) {
        filter.rent = {}
        if (params.budgetMin) filter.rent.$gte = parseInt(params.budgetMin)
        if (params.budgetMax) filter.rent.$lte = parseInt(params.budgetMax)
      }

      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 12
      const skip = (page - 1) * limit

      let sort = { createdAt: -1 }
      if (params.sort === 'price_asc') sort = { rent: 1 }
      if (params.sort === 'price_desc') sort = { rent: -1 }
      if (params.sort === 'newest') sort = { createdAt: -1 }
      if (params.sort === 'popular') sort = { views: -1 }

      const total = await db.collection('properties').countDocuments(filter)
      const properties = await db.collection('properties')
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0, ownerPhone: 0 })
        .toArray()

      return json({ properties, total, page, limit, totalPages: Math.ceil(total / limit) })
    }

    if (route === '/v1/properties' && method === 'POST') {
      const user = await requireAuth(request, db)
      const body = await request.json()
      const property = {
        ...body,
        id: uuidv4(),
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone,
        views: 0,
        verified: false,
        featured: false,
        status: body.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection('properties').insertOne(property)
      const { _id, ...clean } = property
      return json({ property: clean }, 201)
    }

    if (route === '/v1/properties/my-listings' && method === 'GET') {
      const user = await requireAuth(request, db)
      const params = getSearchParams(request)
      const filter = { ownerId: user.id }
      if (params.status) filter.status = params.status
      const properties = await db.collection('properties').find(filter).sort({ createdAt: -1 }).project({ _id: 0 }).toArray()
      return json({ properties })
    }

    if (route === '/v1/properties/saved' && method === 'GET') {
      const user = await requireAuth(request, db)
      const saves = await db.collection('saves').find({ userId: user.id, type: 'PROPERTY' }).toArray()
      const ids = saves.map(s => s.targetId)
      const properties = ids.length ? await db.collection('properties').find({ id: { $in: ids } }).project({ _id: 0, ownerPhone: 0 }).toArray() : []
      return json({ properties })
    }

    // Match /v1/properties/:id
    const propertyIdMatch = route.match(/^\/v1\/properties\/([a-f0-9-]+)$/)
    if (propertyIdMatch && method === 'GET') {
      const id = propertyIdMatch[1]
      const property = await db.collection('properties').findOne({ id }, { projection: { _id: 0 } })
      if (!property) return error('Property not found', 404)
      // increment views
      await db.collection('properties').updateOne({ id }, { $inc: { views: 1 } })
      // check if saved
      let isSaved = false
      const user = await getUser(request, db)
      if (user) {
        const save = await db.collection('saves').findOne({ userId: user.id, targetId: id, type: 'PROPERTY' })
        isSaved = !!save
      }
      return json({ property: { ...property, isSaved, views: (property.views || 0) + 1 } })
    }

    if (propertyIdMatch && method === 'PUT') {
      const user = await requireAuth(request, db)
      const id = propertyIdMatch[1]
      const property = await db.collection('properties').findOne({ id })
      if (!property) return error('Property not found', 404)
      if (property.ownerId !== user.id) return error('Not authorized', 403)
      const body = await request.json()
      const { _id, id: _, ownerId, ...updates } = body
      await db.collection('properties').updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } })
      const updated = await db.collection('properties').findOne({ id }, { projection: { _id: 0 } })
      return json({ property: updated })
    }

    if (propertyIdMatch && method === 'DELETE') {
      const user = await requireAuth(request, db)
      const id = propertyIdMatch[1]
      const property = await db.collection('properties').findOne({ id })
      if (!property) return error('Property not found', 404)
      if (property.ownerId !== user.id) return error('Not authorized', 403)
      await db.collection('properties').deleteOne({ id })
      return json({ message: 'Property deleted' })
    }

    // /v1/properties/:id/save
    const propertySaveMatch = route.match(/^\/v1\/properties\/([a-f0-9-]+)\/save$/)
    if (propertySaveMatch && method === 'POST') {
      const user = await requireAuth(request, db)
      const targetId = propertySaveMatch[1]
      const existing = await db.collection('saves').findOne({ userId: user.id, targetId, type: 'PROPERTY' })
      if (existing) {
        await db.collection('saves').deleteOne({ userId: user.id, targetId, type: 'PROPERTY' })
        return json({ saved: false })
      }
      await db.collection('saves').insertOne({ id: uuidv4(), userId: user.id, targetId, type: 'PROPERTY', createdAt: new Date() })
      return json({ saved: true })
    }

    // /v1/properties/:id/show-number
    const propertyShowMatch = route.match(/^\/v1\/properties\/([a-f0-9-]+)\/show-number$/)
    if (propertyShowMatch && method === 'POST') {
      const user = await requireAuth(request, db)
      const id = propertyShowMatch[1]
      const property = await db.collection('properties').findOne({ id })
      if (!property) return error('Property not found', 404)
      return json({ phone: property.ownerPhone || '+919800000000' })
    }

    // /v1/properties/:id/inquiry
    const propertyInquiryMatch = route.match(/^\/v1\/properties\/([a-f0-9-]+)\/inquiry$/)
    if (propertyInquiryMatch && method === 'POST') {
      const user = await requireAuth(request, db)
      const propertyId = propertyInquiryMatch[1]
      const { message } = await request.json()
      const inquiry = {
        id: uuidv4(), propertyId, userId: user.id, userName: user.name,
        userPhone: user.phone, message: message || 'Interested in this property',
        createdAt: new Date()
      }
      await db.collection('inquiries').insertOne(inquiry)
      return json({ inquiry: { ...inquiry, _id: undefined } }, 201)
    }

    // === COMING SOON ===
    const comingSoonNotifyMatch = route.match(/^\/v1\/coming-soon\/services\/([\w-]+)\/notify$/)
    if (comingSoonNotifyMatch && method === 'POST') {
      const serviceId = comingSoonNotifyMatch[1]
      const body = await request.json()
      await db.collection('coming_soon_notifications').insertOne({
        id: uuidv4(), serviceId, ...body, createdAt: new Date()
      })
      return json({ message: 'You will be notified!' }, 201)
    }

    if (route === '/v1/coming-soon/services' && method === 'GET') {
      const services = [
        { id: 'home-services', name: 'Home Services', count: 1240 },
        { id: 'vehicle-services', name: 'Vehicle Services', count: 890 },
        { id: 'medical-services', name: 'Medical Services', count: 567 },
        { id: 'utility-booking', name: 'Utility Booking', count: 2100 },
        { id: 'labour-chowk', name: 'Labour Chowk', count: 445 },
      ]
      return json({ services })
    }

    // === NOTIFICATIONS ===
    if (route === '/v1/notifications/unread-count' && method === 'GET') {
      return json({ count: 0 })
    }

    if (route === '/v1/notifications' && method === 'GET') {
      return json({ notifications: [] })
    }

    // Route not found
    return error(`Route ${method} ${route} not found`, 404)

  } catch (err) {
    if (err.message === 'Unauthorized') return error('Unauthorized', 401)
    console.error('API Error:', err)
    return error('Internal server error', 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute

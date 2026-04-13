#!/usr/bin/env python3
"""
Backend API Testing for ProjectX Platform
Tests all backend API endpoints as specified in test_result.md
"""

import requests
import json
import sys
import time
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "https://1b509116-625e-4890-a759-6772cd55c354.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.refresh_token = None
        self.user_id = None
        self.test_results = []
        self.property_id = None
        
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{API_BASE}{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        
        if headers:
            req_headers.update(headers)
            
        if self.access_token and 'Authorization' not in req_headers:
            req_headers['Authorization'] = f'Bearer {self.access_token}'
            
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=req_headers, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=req_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
            
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.make_request('GET', '/')
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'ok':
                    self.log_result("Health Check", True, "API is running")
                else:
                    self.log_result("Health Check", False, f"Unexpected response: {data}")
            else:
                self.log_result("Health Check", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")
            
    def test_auth_register(self):
        """Test user registration"""
        try:
            data = {
                "name": "Rajesh Kumar",
                "phone": "+919876543210",
                "password": "test123"
            }
            response = self.make_request('POST', '/v1/auth/register', data)
            
            if response.status_code == 201:
                result = response.json()
                if 'userId' in result:
                    self.user_id = result['userId']
                    self.log_result("Auth Register", True, "User registered successfully")
                else:
                    self.log_result("Auth Register", False, f"Missing userId in response: {result}")
            elif response.status_code == 409:
                # User already exists, that's fine for testing
                self.log_result("Auth Register", True, "User already exists (expected for repeat tests)")
            else:
                self.log_result("Auth Register", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Register", False, f"Exception: {str(e)}")
            
    def test_auth_send_otp(self):
        """Test send OTP"""
        try:
            data = {"phone": "+919876543210"}
            response = self.make_request('POST', '/v1/auth/send-otp', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'message' in result and 'sent' in result['message'].lower():
                    self.log_result("Auth Send OTP", True, "OTP sent successfully")
                else:
                    self.log_result("Auth Send OTP", False, f"Unexpected response: {result}")
            else:
                self.log_result("Auth Send OTP", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Send OTP", False, f"Exception: {str(e)}")
            
    def test_auth_verify_otp(self):
        """Test OTP verification"""
        try:
            data = {
                "phone": "+919876543210",
                "otp": "123456"
            }
            response = self.make_request('POST', '/v1/auth/verify-otp', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'accessToken' in result and 'user' in result:
                    self.access_token = result['accessToken']
                    self.refresh_token = result.get('refreshToken')
                    self.user_id = result['user']['id']
                    self.log_result("Auth Verify OTP", True, "OTP verified, tokens received")
                else:
                    self.log_result("Auth Verify OTP", False, f"Missing tokens in response: {result}")
            else:
                self.log_result("Auth Verify OTP", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Verify OTP", False, f"Exception: {str(e)}")
            
    def test_auth_login_phone(self):
        """Test phone login"""
        try:
            # First send OTP
            self.make_request('POST', '/v1/auth/send-otp', {"phone": "+919876543210"})
            time.sleep(1)  # Brief delay
            
            data = {
                "phone": "+919876543210",
                "otp": "123456"
            }
            response = self.make_request('POST', '/v1/auth/login/phone', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'accessToken' in result and 'user' in result:
                    self.access_token = result['accessToken']
                    self.refresh_token = result.get('refreshToken')
                    self.log_result("Auth Login Phone", True, "Phone login successful")
                else:
                    self.log_result("Auth Login Phone", False, f"Missing tokens in response: {result}")
            else:
                self.log_result("Auth Login Phone", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Login Phone", False, f"Exception: {str(e)}")
            
    def test_auth_refresh_token(self):
        """Test refresh token"""
        if not self.refresh_token:
            self.log_result("Auth Refresh Token", False, "No refresh token available")
            return
            
        try:
            data = {"refreshToken": self.refresh_token}
            response = self.make_request('POST', '/v1/auth/refresh-token', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'accessToken' in result:
                    self.access_token = result['accessToken']
                    self.log_result("Auth Refresh Token", True, "Token refreshed successfully")
                else:
                    self.log_result("Auth Refresh Token", False, f"Missing accessToken: {result}")
            else:
                self.log_result("Auth Refresh Token", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Refresh Token", False, f"Exception: {str(e)}")
            
    def test_user_me(self):
        """Test get user profile"""
        if not self.access_token:
            self.log_result("User Get Me", False, "No access token available")
            return
            
        try:
            response = self.make_request('GET', '/v1/users/me')
            
            if response.status_code == 200:
                result = response.json()
                if 'user' in result and 'id' in result['user']:
                    self.log_result("User Get Me", True, "User profile retrieved successfully")
                else:
                    self.log_result("User Get Me", False, f"Invalid user data: {result}")
            else:
                self.log_result("User Get Me", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("User Get Me", False, f"Exception: {str(e)}")
            
    def test_user_profile_setup(self):
        """Test profile setup"""
        if not self.access_token:
            self.log_result("User Profile Setup", False, "No access token available")
            return
            
        try:
            data = {
                "name": "Rajesh Kumar",
                "city": "Bhopal",
                "area": "MP Nagar Zone-1",
                "interests": ["FIND_ROOM"]
            }
            response = self.make_request('PUT', '/v1/users/profile-setup', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'user' in result and result['user'].get('city') == 'Bhopal':
                    self.log_result("User Profile Setup", True, "Profile setup successful")
                else:
                    self.log_result("User Profile Setup", False, f"Profile not updated properly: {result}")
            else:
                self.log_result("User Profile Setup", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("User Profile Setup", False, f"Exception: {str(e)}")
            
    def test_location_cities(self):
        """Test get cities"""
        try:
            response = self.make_request('GET', '/v1/location/cities')
            
            if response.status_code == 200:
                result = response.json()
                if 'cities' in result and len(result['cities']) >= 20:
                    self.log_result("Location Cities", True, f"Retrieved {len(result['cities'])} cities")
                else:
                    self.log_result("Location Cities", False, f"Expected 21+ cities, got: {result}")
            else:
                self.log_result("Location Cities", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Location Cities", False, f"Exception: {str(e)}")
            
    def test_location_areas(self):
        """Test get areas for a city"""
        try:
            response = self.make_request('GET', '/v1/location/cities/Bhopal/areas')
            
            if response.status_code == 200:
                result = response.json()
                if 'areas' in result and len(result['areas']) >= 15:
                    self.log_result("Location Areas", True, f"Retrieved {len(result['areas'])} areas for Bhopal")
                else:
                    self.log_result("Location Areas", False, f"Expected 20 areas, got: {result}")
            else:
                self.log_result("Location Areas", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Location Areas", False, f"Exception: {str(e)}")
            
    def test_location_detect(self):
        """Test location detection"""
        try:
            data = {"lat": 23.2599, "lng": 77.4126}
            response = self.make_request('POST', '/v1/location/detect', data)
            
            if response.status_code == 200:
                result = response.json()
                if 'city' in result and 'area' in result:
                    self.log_result("Location Detect", True, f"Detected: {result['city']}, {result['area']}")
                else:
                    self.log_result("Location Detect", False, f"Missing location data: {result}")
            else:
                self.log_result("Location Detect", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Location Detect", False, f"Exception: {str(e)}")
            
    def test_properties_list(self):
        """Test get properties list"""
        try:
            response = self.make_request('GET', '/v1/properties')
            
            if response.status_code == 200:
                result = response.json()
                if 'properties' in result and len(result['properties']) > 0:
                    self.property_id = result['properties'][0]['id']  # Store for later tests
                    self.log_result("Properties List", True, f"Retrieved {len(result['properties'])} properties")
                else:
                    self.log_result("Properties List", False, f"No properties found: {result}")
            else:
                self.log_result("Properties List", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Properties List", False, f"Exception: {str(e)}")
            
    def test_properties_filter_city(self):
        """Test properties filter by city"""
        try:
            response = self.make_request('GET', '/v1/properties?city=Bhopal')
            
            if response.status_code == 200:
                result = response.json()
                if 'properties' in result:
                    bhopal_count = len([p for p in result['properties'] if p.get('city') == 'Bhopal'])
                    self.log_result("Properties Filter City", True, f"Found {bhopal_count} properties in Bhopal")
                else:
                    self.log_result("Properties Filter City", False, f"No properties data: {result}")
            else:
                self.log_result("Properties Filter City", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Properties Filter City", False, f"Exception: {str(e)}")
            
    def test_properties_filter_type(self):
        """Test properties filter by type"""
        try:
            response = self.make_request('GET', '/v1/properties?type=2BHK')
            
            if response.status_code == 200:
                result = response.json()
                if 'properties' in result:
                    bhk_count = len([p for p in result['properties'] if p.get('propertyType') == '2BHK'])
                    self.log_result("Properties Filter Type", True, f"Found {bhk_count} 2BHK properties")
                else:
                    self.log_result("Properties Filter Type", False, f"No properties data: {result}")
            else:
                self.log_result("Properties Filter Type", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Properties Filter Type", False, f"Exception: {str(e)}")
            
    def test_properties_filter_budget(self):
        """Test properties filter by budget"""
        try:
            response = self.make_request('GET', '/v1/properties?budgetMin=5000&budgetMax=15000')
            
            if response.status_code == 200:
                result = response.json()
                if 'properties' in result:
                    in_budget = len([p for p in result['properties'] if 5000 <= p.get('rent', 0) <= 15000])
                    self.log_result("Properties Filter Budget", True, f"Found {in_budget} properties in budget range")
                else:
                    self.log_result("Properties Filter Budget", False, f"No properties data: {result}")
            else:
                self.log_result("Properties Filter Budget", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Properties Filter Budget", False, f"Exception: {str(e)}")
            
    def test_property_create(self):
        """Test create property"""
        if not self.access_token:
            self.log_result("Property Create", False, "No access token available")
            return
            
        try:
            data = {
                "title": "Test Property for API",
                "description": "This is a test property created via API testing",
                "propertyType": "1BHK",
                "category": "Residential",
                "availableFor": "Anyone",
                "dependency": "Independent",
                "rent": 8000,
                "deposit": 16000,
                "negotiable": True,
                "furnishing": "Semi Furnished",
                "amenities": ["wifi", "parking", "water"],
                "address": "Test Address, Bhopal",
                "city": "Bhopal",
                "area": "MP Nagar Zone-1",
                "pincode": "462011",
                "photos": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"]
            }
            response = self.make_request('POST', '/v1/properties', data)
            
            if response.status_code == 201:
                result = response.json()
                if 'property' in result and 'id' in result['property']:
                    self.property_id = result['property']['id']
                    self.log_result("Property Create", True, "Property created successfully")
                else:
                    self.log_result("Property Create", False, f"Invalid property data: {result}")
            else:
                self.log_result("Property Create", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Property Create", False, f"Exception: {str(e)}")
            
    def test_property_get_by_id(self):
        """Test get property by ID"""
        if not self.property_id:
            self.log_result("Property Get By ID", False, "No property ID available")
            return
            
        try:
            response = self.make_request('GET', f'/v1/properties/{self.property_id}')
            
            if response.status_code == 200:
                result = response.json()
                if 'property' in result and result['property']['id'] == self.property_id:
                    self.log_result("Property Get By ID", True, "Property retrieved successfully")
                else:
                    self.log_result("Property Get By ID", False, f"Invalid property data: {result}")
            else:
                self.log_result("Property Get By ID", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Property Get By ID", False, f"Exception: {str(e)}")
            
    def test_property_save(self):
        """Test save/unsave property"""
        if not self.access_token or not self.property_id:
            self.log_result("Property Save", False, "No access token or property ID available")
            return
            
        try:
            response = self.make_request('POST', f'/v1/properties/{self.property_id}/save')
            
            if response.status_code == 200:
                result = response.json()
                if 'saved' in result:
                    self.log_result("Property Save", True, f"Property save toggled: {result['saved']}")
                else:
                    self.log_result("Property Save", False, f"Invalid response: {result}")
            else:
                self.log_result("Property Save", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Property Save", False, f"Exception: {str(e)}")
            
    def test_property_show_number(self):
        """Test show owner number"""
        if not self.access_token or not self.property_id:
            self.log_result("Property Show Number", False, "No access token or property ID available")
            return
            
        try:
            response = self.make_request('POST', f'/v1/properties/{self.property_id}/show-number')
            
            if response.status_code == 200:
                result = response.json()
                if 'phone' in result:
                    self.log_result("Property Show Number", True, f"Owner phone revealed: {result['phone']}")
                else:
                    self.log_result("Property Show Number", False, f"No phone in response: {result}")
            else:
                self.log_result("Property Show Number", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Property Show Number", False, f"Exception: {str(e)}")
            
    def test_coming_soon_notify(self):
        """Test coming soon notification"""
        try:
            data = {"phone": "+919876543210"}
            response = self.make_request('POST', '/v1/coming-soon/services/home-services/notify', data)
            
            if response.status_code == 201:
                result = response.json()
                if 'message' in result and 'notified' in result['message'].lower():
                    self.log_result("Coming Soon Notify", True, "Notification registered successfully")
                else:
                    self.log_result("Coming Soon Notify", False, f"Unexpected response: {result}")
            else:
                self.log_result("Coming Soon Notify", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Coming Soon Notify", False, f"Exception: {str(e)}")
            
    def test_coming_soon_services(self):
        """Test get coming soon services"""
        try:
            response = self.make_request('GET', '/v1/coming-soon/services')
            
            if response.status_code == 200:
                result = response.json()
                if 'services' in result and len(result['services']) > 0:
                    self.log_result("Coming Soon Services", True, f"Retrieved {len(result['services'])} services")
                else:
                    self.log_result("Coming Soon Services", False, f"No services found: {result}")
            else:
                self.log_result("Coming Soon Services", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Coming Soon Services", False, f"Exception: {str(e)}")
            
    def test_notifications_unread_count(self):
        """Test notifications unread count"""
        try:
            response = self.make_request('GET', '/v1/notifications/unread-count')
            
            if response.status_code == 200:
                result = response.json()
                if 'count' in result:
                    self.log_result("Notifications Unread Count", True, f"Unread count: {result['count']}")
                else:
                    self.log_result("Notifications Unread Count", False, f"No count in response: {result}")
            else:
                self.log_result("Notifications Unread Count", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Notifications Unread Count", False, f"Exception: {str(e)}")
            
    def test_auth_logout(self):
        """Test logout"""
        if not self.access_token:
            self.log_result("Auth Logout", False, "No access token available")
            return
            
        try:
            response = self.make_request('POST', '/v1/auth/logout')
            
            if response.status_code == 200:
                result = response.json()
                if 'message' in result and 'logged out' in result['message'].lower():
                    self.log_result("Auth Logout", True, "Logout successful")
                    self.access_token = None  # Clear token
                else:
                    self.log_result("Auth Logout", False, f"Unexpected response: {result}")
            else:
                self.log_result("Auth Logout", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Auth Logout", False, f"Exception: {str(e)}")
            
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting ProjectX Backend API Tests")
        print(f"📍 Base URL: {BASE_URL}")
        print("=" * 60)
        
        # Health check first
        self.test_health_check()
        
        # Auth flow tests (most important)
        print("\n🔐 Testing Authentication Flow...")
        self.test_auth_register()
        self.test_auth_send_otp()
        self.test_auth_verify_otp()
        self.test_auth_login_phone()
        self.test_auth_refresh_token()
        
        # User API tests
        print("\n👤 Testing User APIs...")
        self.test_user_me()
        self.test_user_profile_setup()
        
        # Location API tests
        print("\n📍 Testing Location APIs...")
        self.test_location_cities()
        self.test_location_areas()
        self.test_location_detect()
        
        # Property API tests
        print("\n🏠 Testing Property APIs...")
        self.test_properties_list()
        self.test_properties_filter_city()
        self.test_properties_filter_type()
        self.test_properties_filter_budget()
        self.test_property_create()
        self.test_property_get_by_id()
        self.test_property_save()
        self.test_property_show_number()
        
        # Coming Soon API tests
        print("\n🔜 Testing Coming Soon APIs...")
        self.test_coming_soon_notify()
        self.test_coming_soon_services()
        
        # Notification API tests
        print("\n🔔 Testing Notification APIs...")
        self.test_notifications_unread_count()
        
        # Logout test (last)
        print("\n🚪 Testing Logout...")
        self.test_auth_logout()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.test_results if r['success'])
        failed = len(self.test_results) - passed
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
                    
        return passed, failed

def main():
    """Main test runner"""
    tester = APITester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
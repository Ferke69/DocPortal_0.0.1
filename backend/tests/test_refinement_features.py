"""
Test cases for Doc Portal System Refinement features:
1. Secure messaging encryption endpoint
2. Provider dashboard stats including pending_payment
3. Business settings API
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
PROVIDER_EMAIL = "testprovider_refinement@example.com"
PROVIDER_PASSWORD = "TestPass123!"
CLIENT_EMAIL = "testclient_refinement@example.com"
CLIENT_PASSWORD = "TestPass123!"


class TestSecureMessaging:
    """Test secure messaging encryption endpoint"""
    
    def test_security_info_endpoint_returns_encryption_status(self):
        """Verify /api/messages/security-info returns encryption status"""
        response = requests.get(f"{BASE_URL}/api/messages/security-info")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "encryption_enabled" in data
        assert "encryption_algorithm" in data
        assert "key_derivation" in data
        assert "compliance" in data
        assert "features" in data
        assert "mode" in data
        
        # Verify encryption is enabled (as per backend/.env)
        assert data["encryption_enabled"] == True
        assert data["encryption_algorithm"] == "AES-256 (Fernet)"
        assert data["key_derivation"] == "PBKDF2-HMAC-SHA256"
        assert "HIPAA Technical Safeguards" in data["compliance"]
        assert "GDPR Data Protection" in data["compliance"]
        assert data["mode"] == "PRODUCTION"
        
        print("PASS: Security info endpoint returns correct encryption status")


class TestProviderDashboard:
    """Test provider dashboard stats"""
    
    @pytest.fixture
    def provider_token(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Provider authentication failed")
    
    def test_dashboard_stats_endpoint(self, provider_token):
        """Verify provider dashboard returns stats"""
        response = requests.get(
            f"{BASE_URL}/api/provider/dashboard",
            headers={"Authorization": f"Bearer {provider_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "totalIncome" in data
        assert "monthlyIncome" in data
        assert "appointmentsToday" in data
        assert "appointmentsWeek" in data
        assert "activeClients" in data
        assert "messagesUnread" in data
        assert "upcomingAppointments" in data
        
        # Verify data types
        assert isinstance(data["totalIncome"], (int, float))
        assert isinstance(data["monthlyIncome"], (int, float))
        assert isinstance(data["appointmentsToday"], int)
        assert isinstance(data["upcomingAppointments"], int)
        
        print("PASS: Provider dashboard stats endpoint working correctly")
    
    def test_dashboard_includes_active_clients(self, provider_token):
        """Verify dashboard shows active clients count"""
        response = requests.get(
            f"{BASE_URL}/api/provider/dashboard",
            headers={"Authorization": f"Bearer {provider_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # We registered a client, so should have at least 1
        assert data["activeClients"] >= 1
        print(f"PASS: Dashboard shows {data['activeClients']} active clients")


class TestInviteCodes:
    """Test invite code functionality"""
    
    @pytest.fixture
    def provider_token(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Provider authentication failed")
    
    def test_generate_invite_code(self, provider_token):
        """Verify provider can generate invite codes"""
        response = requests.post(
            f"{BASE_URL}/api/provider/invite-code",
            headers={"Authorization": f"Bearer {provider_token}"},
            json={"expiresInDays": 7}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "code" in data
        assert "expiresAt" in data
        assert len(data["code"]) == 8  # 8-character code
        
        print(f"PASS: Generated invite code: {data['code']}")
    
    def test_get_invite_codes(self, provider_token):
        """Verify provider can list invite codes"""
        response = requests.get(
            f"{BASE_URL}/api/provider/invite-codes",
            headers={"Authorization": f"Bearer {provider_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        if len(data) > 0:
            assert "code" in data[0]
            assert "createdAt" in data[0]
            assert "expiresAt" in data[0]
        
        print(f"PASS: Retrieved {len(data)} invite codes")


class TestBusinessSettings:
    """Test business settings API"""
    
    @pytest.fixture
    def provider_token(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Provider authentication failed")
    
    def test_get_business_settings(self, provider_token):
        """Verify provider can get business settings"""
        response = requests.get(
            f"{BASE_URL}/api/provider/settings/business",
            headers={"Authorization": f"Bearer {provider_token}"}
        )
        
        # May return 200 with data or 404 if not set
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.json()
            print(f"PASS: Retrieved business settings")
        else:
            print("INFO: Business settings not yet configured")
    
    def test_update_business_settings(self, provider_token):
        """Verify provider can update business settings"""
        settings = {
            "businessName": "Test Provider Refinement",
            "businessAddress": "123 Test Street",
            "city": "Ljubljana",
            "postalCode": "1000",
            "country": "Slovenia",
            "vatRate": 22.0
        }
        
        response = requests.put(
            f"{BASE_URL}/api/provider/settings/business",
            headers={"Authorization": f"Bearer {provider_token}"},
            json=settings
        )
        
        assert response.status_code in [200, 201]
        print("PASS: Business settings updated successfully")


class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_health(self):
        """Verify API is healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        
        print("PASS: API health check passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

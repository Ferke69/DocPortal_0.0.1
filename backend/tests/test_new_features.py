"""
Test Suite for New Features: Legal Pages, GDPR Compliance, Video Consultation
Tests: Terms of Service, Privacy Policy, GDPR data export/delete, Video providers
"""

import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
CLIENT_EMAIL = "testclient_1769486748@example.com"
CLIENT_PASSWORD = "TestPass123!"


class TestHealthAndBasicEndpoints:
    """Basic health and endpoint tests"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "database" in data
        print(f"✓ API health check passed: {data}")
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        print(f"✓ API root check passed: {data}")


class TestVideoProviders:
    """Video consultation provider tests"""
    
    def test_video_providers_endpoint(self):
        """Test video providers list endpoint"""
        response = requests.get(f"{BASE_URL}/api/video/providers")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "providers" in data
        assert "default" in data
        assert data["default"] == "jitsi"
        
        # Verify Jitsi is in providers
        providers = data["providers"]
        jitsi_provider = next((p for p in providers if p["id"] == "jitsi"), None)
        assert jitsi_provider is not None
        assert jitsi_provider["name"] == "Jitsi Meet"
        assert jitsi_provider["requires_api_key"] == False
        assert jitsi_provider["recommended"] == True
        
        # Verify Google Meet is in providers
        google_provider = next((p for p in providers if p["id"] == "google_meet"), None)
        assert google_provider is not None
        assert google_provider["requires_api_key"] == True
        
        print(f"✓ Video providers endpoint passed: {len(providers)} providers, default={data['default']}")


class TestGDPREndpoints:
    """GDPR compliance endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for client"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    
    def test_gdpr_export_requires_auth(self):
        """Test that GDPR export requires authentication"""
        response = requests.get(f"{BASE_URL}/api/gdpr/export-data")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ GDPR export correctly requires authentication")
    
    def test_gdpr_delete_requires_auth(self):
        """Test that GDPR delete request requires authentication"""
        response = requests.post(f"{BASE_URL}/api/gdpr/delete-request")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ GDPR delete request correctly requires authentication")
    
    def test_gdpr_deletion_status_requires_auth(self):
        """Test that GDPR deletion status requires authentication"""
        response = requests.get(f"{BASE_URL}/api/gdpr/deletion-status")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ GDPR deletion status correctly requires authentication")
    
    def test_gdpr_export_with_auth(self, auth_token):
        """Test GDPR data export with valid authentication"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/gdpr/export-data", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify export structure
        assert "export_info" in data
        assert "profile" in data
        assert "appointments" in data
        assert "messages" in data
        assert "invoices" in data
        
        # Verify export_info
        export_info = data["export_info"]
        assert "exported_at" in export_info
        assert "user_id" in export_info
        assert export_info["data_controller"] == "DocPortal"
        
        print(f"✓ GDPR export passed: profile={bool(data['profile'])}, appointments={len(data['appointments'])}, messages={len(data['messages'])}")
    
    def test_gdpr_deletion_status_with_auth(self, auth_token):
        """Test GDPR deletion status with valid authentication"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/gdpr/deletion-status", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "deletion_requested" in data
        assert "status" in data
        
        print(f"✓ GDPR deletion status passed: deletion_requested={data['deletion_requested']}, status={data['status']}")


class TestVideoLinkEndpoints:
    """Video link generation endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for client"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    
    def test_video_link_requires_auth(self):
        """Test that video link generation requires authentication"""
        response = requests.post(f"{BASE_URL}/api/video/generate/test-appointment-id")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ Video link generation correctly requires authentication")
    
    def test_video_link_get_requires_auth(self):
        """Test that getting video link requires authentication"""
        response = requests.get(f"{BASE_URL}/api/video/link/test-appointment-id")
        assert response.status_code == 401 or response.status_code == 403
        print("✓ Video link retrieval correctly requires authentication")
    
    def test_video_link_nonexistent_appointment(self, auth_token):
        """Test video link for non-existent appointment"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/video/link/nonexistent-appointment-id", headers=headers)
        
        # Should return 404 for non-existent appointment
        assert response.status_code == 404
        print("✓ Video link correctly returns 404 for non-existent appointment")


class TestLegalPagesRoutes:
    """Test that legal page routes are accessible"""
    
    def test_terms_page_accessible(self):
        """Test Terms of Service page is accessible"""
        response = requests.get(f"{BASE_URL}/terms", allow_redirects=True)
        # Frontend routes return 200 with HTML
        assert response.status_code == 200
        print("✓ Terms of Service page route accessible")
    
    def test_privacy_page_accessible(self):
        """Test Privacy Policy page is accessible"""
        response = requests.get(f"{BASE_URL}/privacy", allow_redirects=True)
        # Frontend routes return 200 with HTML
        assert response.status_code == 200
        print("✓ Privacy Policy page route accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

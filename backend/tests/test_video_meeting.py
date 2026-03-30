"""
Test Video Meeting and Appointment System
Tests:
- Appointment creation generates Jitsi video link
- Video link format validation
- Appointment retrieval with video link
- Video providers endpoint
"""

import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials - using existing test accounts
PROVIDER_EMAIL = "testprovider_refinement@example.com"
PROVIDER_PASSWORD = "TestPass123!"
CLIENT_EMAIL = "testclient_refinement@example.com"
CLIENT_PASSWORD = "TestPass123!"


class TestVideoProviders:
    """Test video providers endpoint"""
    
    def test_video_providers_endpoint(self):
        """Test /api/video/providers returns supported providers"""
        response = requests.get(f"{BASE_URL}/api/video/providers")
        assert response.status_code == 200
        
        data = response.json()
        assert "providers" in data
        assert "default" in data
        assert data["default"] == "jitsi"
        
        # Check Jitsi is in providers
        jitsi = next((p for p in data["providers"] if p["id"] == "jitsi"), None)
        assert jitsi is not None
        assert jitsi["recommended"] == True
        assert jitsi["requires_api_key"] == False
        print("PASS: Video providers endpoint returns Jitsi as default")


class TestAppointmentVideoLink:
    """Test appointment creation with video link generation"""
    
    @pytest.fixture
    def client_auth(self):
        """Get client authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Client login failed: {response.text}")
        return response.json()
    
    @pytest.fixture
    def provider_auth(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Provider login failed: {response.text}")
        return response.json()
    
    def test_client_login(self):
        """Test client can login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["userType"] == "client"
        print(f"PASS: Client login successful - {data['user']['email']}")
        return data
    
    def test_provider_login(self):
        """Test provider can login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["userType"] == "provider"
        print(f"PASS: Provider login successful - {data['user']['email']}")
        return data
    
    def test_appointment_creation_generates_video_link(self, client_auth, provider_auth):
        """Test that creating an appointment generates a Jitsi video link"""
        client_token = client_auth["token"]
        client_id = client_auth["user"]["user_id"]
        provider_id = provider_auth["user"]["user_id"]
        
        # Create appointment for 5 minutes from now (to test video button)
        now = datetime.now()
        appointment_time = now + timedelta(minutes=5)
        appointment_date = appointment_time.strftime("%Y-%m-%d")
        appointment_time_str = appointment_time.strftime("%H:%M")
        
        headers = {"Authorization": f"Bearer {client_token}"}
        appointment_data = {
            "clientId": client_id,
            "providerId": provider_id,
            "date": appointment_date,
            "time": appointment_time_str,
            "type": "Video Consultation",
            "duration": 30,
            "amount": 50.0,
            "notes": "Test appointment for video meeting"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/appointments",
            json=appointment_data,
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed to create appointment: {response.text}"
        data = response.json()
        
        # Verify video link is generated
        assert "videoLink" in data, "Video link not returned in appointment creation response"
        assert data["videoLink"].startswith("https://meet.jit.si/"), f"Invalid Jitsi link format: {data['videoLink']}"
        assert "docportal-" in data["videoLink"], "Video link should contain 'docportal-' prefix"
        
        print(f"PASS: Appointment created with video link: {data['videoLink']}")
        return data
    
    def test_get_appointment_includes_video_link(self, client_auth, provider_auth):
        """Test that fetching an appointment includes the video link"""
        client_token = client_auth["token"]
        client_id = client_auth["user"]["user_id"]
        provider_id = provider_auth["user"]["user_id"]
        
        # First create an appointment
        now = datetime.now()
        appointment_time = now + timedelta(minutes=10)
        appointment_date = appointment_time.strftime("%Y-%m-%d")
        appointment_time_str = appointment_time.strftime("%H:%M")
        
        headers = {"Authorization": f"Bearer {client_token}"}
        appointment_data = {
            "clientId": client_id,
            "providerId": provider_id,
            "date": appointment_date,
            "time": appointment_time_str,
            "type": "Follow-up Consultation",
            "duration": 30,
            "amount": 50.0
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/appointments",
            json=appointment_data,
            headers=headers
        )
        assert create_response.status_code == 200
        appointment_id = create_response.json()["id"]
        
        # Now fetch the appointment
        get_response = requests.get(
            f"{BASE_URL}/api/appointments/{appointment_id}",
            headers=headers
        )
        assert get_response.status_code == 200
        
        appointment = get_response.json()
        assert "videoLink" in appointment, "Video link not in appointment details"
        assert appointment["videoLink"].startswith("https://meet.jit.si/")
        assert appointment.get("videoProvider") == "jitsi"
        
        print(f"PASS: Appointment GET includes video link: {appointment['videoLink']}")
    
    def test_join_appointment_returns_video_link(self, client_auth, provider_auth):
        """Test the join appointment endpoint returns video link"""
        client_token = client_auth["token"]
        client_id = client_auth["user"]["user_id"]
        provider_id = provider_auth["user"]["user_id"]
        
        # Create appointment
        now = datetime.now()
        appointment_time = now + timedelta(minutes=15)
        appointment_date = appointment_time.strftime("%Y-%m-%d")
        appointment_time_str = appointment_time.strftime("%H:%M")
        
        headers = {"Authorization": f"Bearer {client_token}"}
        appointment_data = {
            "clientId": client_id,
            "providerId": provider_id,
            "date": appointment_date,
            "time": appointment_time_str,
            "type": "Initial Consultation",
            "duration": 45,
            "amount": 75.0
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/appointments",
            json=appointment_data,
            headers=headers
        )
        assert create_response.status_code == 200
        appointment_id = create_response.json()["id"]
        
        # Test join endpoint
        join_response = requests.post(
            f"{BASE_URL}/api/appointments/{appointment_id}/join",
            headers=headers
        )
        assert join_response.status_code == 200
        
        join_data = join_response.json()
        assert "videoLink" in join_data
        assert join_data["videoLink"].startswith("https://meet.jit.si/")
        assert join_data["appointmentId"] == appointment_id
        
        print(f"PASS: Join endpoint returns video link: {join_data['videoLink']}")


class TestProviderAppointments:
    """Test provider can see appointments with video links"""
    
    @pytest.fixture
    def provider_auth(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Provider login failed: {response.text}")
        return response.json()
    
    def test_provider_today_appointments(self, provider_auth):
        """Test provider can get today's appointments"""
        token = provider_auth["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        today = datetime.now().strftime("%Y-%m-%d")
        response = requests.get(
            f"{BASE_URL}/api/provider/appointments?date={today}",
            headers=headers
        )
        
        assert response.status_code == 200
        appointments = response.json()
        
        # Check if any appointments have video links
        for apt in appointments:
            if apt.get("videoLink"):
                assert apt["videoLink"].startswith("https://meet.jit.si/")
                print(f"PASS: Provider appointment has video link: {apt['videoLink']}")
                break
        else:
            print("INFO: No appointments with video links found for today (may be expected)")
        
        print(f"PASS: Provider can fetch today's appointments ({len(appointments)} found)")


class TestClientAppointments:
    """Test client can see appointments with video links"""
    
    @pytest.fixture
    def client_auth(self):
        """Get client authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Client login failed: {response.text}")
        return response.json()
    
    def test_client_appointments_list(self, client_auth):
        """Test client can get their appointments"""
        token = client_auth["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get pending appointments
        response = requests.get(
            f"{BASE_URL}/api/client/appointments?status=pending",
            headers=headers
        )
        
        assert response.status_code == 200
        appointments = response.json()
        
        # Check if any appointments have video links
        for apt in appointments:
            if apt.get("videoLink"):
                assert apt["videoLink"].startswith("https://meet.jit.si/")
                print(f"PASS: Client appointment has video link: {apt['videoLink']}")
                break
        
        print(f"PASS: Client can fetch appointments ({len(appointments)} pending)")
    
    def test_client_confirmed_appointments(self, client_auth):
        """Test client can get confirmed appointments"""
        token = client_auth["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/client/appointments?status=confirmed",
            headers=headers
        )
        
        assert response.status_code == 200
        appointments = response.json()
        print(f"PASS: Client can fetch confirmed appointments ({len(appointments)} found)")


class TestVideoLinkFormat:
    """Test video link format and uniqueness"""
    
    @pytest.fixture
    def client_auth(self):
        """Get client authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Client login failed: {response.text}")
        return response.json()
    
    @pytest.fixture
    def provider_auth(self):
        """Get provider authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": PROVIDER_EMAIL,
            "password": PROVIDER_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Provider login failed: {response.text}")
        return response.json()
    
    def test_different_appointments_get_different_links(self, client_auth, provider_auth):
        """Test that different appointments get unique video links"""
        client_token = client_auth["token"]
        client_id = client_auth["user"]["user_id"]
        provider_id = provider_auth["user"]["user_id"]
        
        headers = {"Authorization": f"Bearer {client_token}"}
        video_links = []
        
        # Create 3 appointments with different times
        for i in range(3):
            now = datetime.now()
            appointment_time = now + timedelta(hours=i+1)
            appointment_date = appointment_time.strftime("%Y-%m-%d")
            appointment_time_str = appointment_time.strftime("%H:%M")
            
            appointment_data = {
                "clientId": client_id,
                "providerId": provider_id,
                "date": appointment_date,
                "time": appointment_time_str,
                "type": f"Test Appointment {i+1}",
                "duration": 30,
                "amount": 50.0
            }
            
            response = requests.post(
                f"{BASE_URL}/api/appointments",
                json=appointment_data,
                headers=headers
            )
            assert response.status_code == 200
            video_links.append(response.json()["videoLink"])
        
        # Verify all links are unique
        assert len(video_links) == len(set(video_links)), "Video links should be unique for different appointments"
        print(f"PASS: {len(video_links)} appointments created with unique video links")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

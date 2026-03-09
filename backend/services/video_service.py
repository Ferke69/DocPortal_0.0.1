"""
Video Consultation Service
Handles video meeting link generation for appointments.

Currently supports:
- Unique meeting room generation (using provider-specific rooms)
- Integration with Jitsi Meet (free, no API key required)
- Placeholder for future Google Meet API integration
"""

import hashlib
import os
from datetime import datetime, timezone
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Configuration
VIDEO_PROVIDER = os.environ.get("VIDEO_PROVIDER", "jitsi")  # Options: jitsi, google_meet
JITSI_DOMAIN = os.environ.get("JITSI_DOMAIN", "meet.jit.si")


def generate_room_id(provider_id: str, appointment_id: str, date: str) -> str:
    """
    Generate a unique, deterministic room ID for an appointment.
    Same inputs will always generate the same room ID.
    """
    # Create a unique hash from the inputs
    unique_string = f"{provider_id}-{appointment_id}-{date}"
    hash_object = hashlib.sha256(unique_string.encode())
    short_hash = hash_object.hexdigest()[:12]
    
    # Format as readable room name
    return f"docportal-{short_hash}"


def generate_jitsi_link(room_id: str, appointment_type: str = None) -> dict:
    """
    Generate a Jitsi Meet link.
    Jitsi is free and requires no API key.
    """
    # Clean room name (replace spaces, special chars)
    clean_room = room_id.replace(" ", "-").lower()
    
    meeting_url = f"https://{JITSI_DOMAIN}/{clean_room}"
    
    return {
        "provider": "jitsi",
        "url": meeting_url,
        "room_id": clean_room,
        "features": {
            "video": True,
            "audio": True,
            "screen_share": True,
            "chat": True,
            "recording": False  # Jitsi free doesn't include cloud recording
        },
        "instructions": {
            "en": "Click the link to join the video call. No account required.",
            "sl": "Kliknite povezavo za pridružitev video klicu. Račun ni potreben."
        }
    }


def generate_google_meet_placeholder(room_id: str) -> dict:
    """
    Generate a placeholder Google Meet-style link.
    
    Note: Full Google Meet API integration requires:
    1. Google Cloud project with Meet API enabled
    2. OAuth 2.0 credentials
    3. User consent flow
    
    For now, this generates a placeholder that can be replaced
    with a real meeting link by the provider.
    """
    # Generate Google Meet-style room code (xxx-xxxx-xxx format)
    hash_obj = hashlib.md5(room_id.encode())
    hash_hex = hash_obj.hexdigest()
    
    meet_code = f"{hash_hex[:3]}-{hash_hex[3:7]}-{hash_hex[7:10]}"
    
    return {
        "provider": "google_meet",
        "url": f"https://meet.google.com/{meet_code}",
        "room_id": meet_code,
        "is_placeholder": True,
        "note": "This is a placeholder link. Provider should create actual Google Meet and update.",
        "features": {
            "video": True,
            "audio": True,
            "screen_share": True,
            "chat": True,
            "recording": True
        },
        "instructions": {
            "en": "Provider will share the Google Meet link before the appointment.",
            "sl": "Ponudnik bo delil Google Meet povezavo pred terminom."
        }
    }


def generate_video_link(
    provider_id: str,
    appointment_id: str,
    date: str,
    appointment_type: str = None,
    preferred_provider: str = None
) -> dict:
    """
    Generate a video consultation link for an appointment.
    
    Args:
        provider_id: The healthcare provider's ID
        appointment_id: The appointment ID
        date: Appointment date (YYYY-MM-DD)
        appointment_type: Optional type of appointment
        preferred_provider: Force a specific video provider
    
    Returns:
        dict with video link details
    """
    room_id = generate_room_id(provider_id, appointment_id, date)
    
    video_provider = preferred_provider or VIDEO_PROVIDER
    
    if video_provider == "google_meet":
        result = generate_google_meet_placeholder(room_id)
    else:
        # Default to Jitsi (free, works immediately)
        result = generate_jitsi_link(room_id, appointment_type)
    
    # Add common metadata
    result["appointment_id"] = appointment_id
    result["generated_at"] = datetime.now(timezone.utc).isoformat()
    
    logger.info(f"Generated video link for appointment {appointment_id}: {result['url']}")
    
    return result


def get_supported_providers() -> list:
    """Get list of supported video providers"""
    return [
        {
            "id": "jitsi",
            "name": "Jitsi Meet",
            "description": "Free, open-source video conferencing. No account required.",
            "requires_api_key": False,
            "recommended": True
        },
        {
            "id": "google_meet",
            "name": "Google Meet",
            "description": "Google's video conferencing. Requires Google account.",
            "requires_api_key": True,
            "recommended": False,
            "note": "Placeholder links generated. Provider must create actual meeting."
        }
    ]


# For backward compatibility
def create_video_consultation(appointment_data: dict) -> str:
    """
    Create video consultation link for an appointment.
    Returns just the URL string for simple integration.
    """
    result = generate_video_link(
        provider_id=appointment_data.get("providerId", ""),
        appointment_id=appointment_data.get("id", appointment_data.get("_id", "")),
        date=appointment_data.get("date", ""),
        appointment_type=appointment_data.get("type")
    )
    return result["url"]

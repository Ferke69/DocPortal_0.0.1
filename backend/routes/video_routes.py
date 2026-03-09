"""
Video Consultation Routes
Handles video meeting creation and management for appointments.
"""

from fastapi import APIRouter, HTTPException, Depends
from auth import get_current_user
from database import appointments_collection, log_audit
from services.video_service import (
    generate_video_link, 
    get_supported_providers,
    create_video_consultation
)
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/video", tags=["Video Consultations"])


@router.get("/providers")
async def list_video_providers():
    """Get list of supported video providers"""
    return {
        "providers": get_supported_providers(),
        "default": "jitsi"
    }


@router.post("/generate/{appointment_id}")
async def generate_meeting_link(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate or retrieve video meeting link for an appointment.
    Only the provider or client of the appointment can access this.
    """
    user_id = current_user["userId"]
    
    # Find the appointment
    appointment = await appointments_collection.find_one(
        {"id": appointment_id}
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is part of this appointment
    if user_id not in [appointment.get("providerId"), appointment.get("clientId")]:
        raise HTTPException(status_code=403, detail="Not authorized to access this appointment")
    
    # Check if video link already exists
    existing_link = appointment.get("videoLink")
    if existing_link:
        return {
            "status": "existing",
            "video_link": existing_link,
            "message": "Video link already generated"
        }
    
    # Generate new video link
    video_data = generate_video_link(
        provider_id=appointment["providerId"],
        appointment_id=appointment_id,
        date=appointment.get("date", ""),
        appointment_type=appointment.get("type")
    )
    
    # Save video link to appointment
    await appointments_collection.update_one(
        {"id": appointment_id},
        {
            "$set": {
                "videoLink": video_data["url"],
                "videoProvider": video_data["provider"],
                "videoRoomId": video_data["room_id"],
                "videoGeneratedAt": datetime.now(timezone.utc)
            }
        }
    )
    
    await log_audit(user_id, "create", "video_link", appointment_id)
    
    return {
        "status": "created",
        "video_link": video_data["url"],
        "provider": video_data["provider"],
        "room_id": video_data["room_id"],
        "instructions": video_data.get("instructions", {}),
        "features": video_data.get("features", {})
    }


@router.get("/link/{appointment_id}")
async def get_meeting_link(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get the video meeting link for an appointment.
    """
    user_id = current_user["userId"]
    
    appointment = await appointments_collection.find_one(
        {"id": appointment_id},
        {"_id": 0, "videoLink": 1, "videoProvider": 1, "providerId": 1, "clientId": 1, 
         "date": 1, "time": 1, "type": 1, "status": 1}
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is part of this appointment
    if user_id not in [appointment.get("providerId"), appointment.get("clientId")]:
        raise HTTPException(status_code=403, detail="Not authorized to access this appointment")
    
    video_link = appointment.get("videoLink")
    
    if not video_link:
        return {
            "has_video": False,
            "message": "No video link generated yet. Provider can generate one."
        }
    
    return {
        "has_video": True,
        "video_link": video_link,
        "provider": appointment.get("videoProvider", "jitsi"),
        "appointment": {
            "date": appointment.get("date"),
            "time": appointment.get("time"),
            "type": appointment.get("type"),
            "status": appointment.get("status")
        }
    }


@router.put("/update/{appointment_id}")
async def update_meeting_link(
    appointment_id: str,
    video_url: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Manually update the video meeting link (for providers who want to use their own Google Meet).
    Only providers can update the link.
    """
    user_id = current_user["userId"]
    user_role = current_user.get("role", "client")
    
    if user_role != "provider":
        raise HTTPException(status_code=403, detail="Only providers can update video links")
    
    appointment = await appointments_collection.find_one({"id": appointment_id})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment.get("providerId") != user_id:
        raise HTTPException(status_code=403, detail="Not your appointment")
    
    # Determine provider from URL
    provider = "custom"
    if "meet.google.com" in video_url:
        provider = "google_meet"
    elif "jit.si" in video_url or "jitsi" in video_url:
        provider = "jitsi"
    elif "zoom.us" in video_url:
        provider = "zoom"
    elif "teams.microsoft.com" in video_url:
        provider = "teams"
    
    await appointments_collection.update_one(
        {"id": appointment_id},
        {
            "$set": {
                "videoLink": video_url,
                "videoProvider": provider,
                "videoUpdatedAt": datetime.now(timezone.utc),
                "videoUpdatedBy": user_id
            }
        }
    )
    
    await log_audit(user_id, "update", "video_link", appointment_id, {"provider": provider})
    
    return {
        "status": "updated",
        "video_link": video_url,
        "provider": provider
    }

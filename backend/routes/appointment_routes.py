from fastapi import APIRouter, HTTPException, Depends
from auth import get_current_user
from database import appointments_collection, users_collection, log_audit
from models import AppointmentCreate, AppointmentUpdate
from services.video_service import create_video_consultation
from datetime import datetime, timezone, date
import uuid

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("")
async def create_appointment(
    appointment: AppointmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Book new appointment (client action)"""
    # Verify client is booking for themselves
    if current_user["userType"] == "client" and appointment.clientId != current_user["userId"]:
        raise HTTPException(status_code=403, detail="Can only book appointments for yourself")
    
    # Verify provider exists
    provider = await users_collection.find_one({"user_id": appointment.providerId})
    if not provider or provider["userType"] != "provider":
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Create appointment first to get ID
    appointment_dict = appointment.model_dump()
    appointment_id = str(uuid.uuid4())
    
    # Convert date to string for MongoDB storage
    if isinstance(appointment_dict.get("date"), date):
        appointment_dict["date"] = appointment_dict["date"].isoformat()
    
    # Generate video link using the video service
    video_link = create_video_consultation({
        "id": appointment_id,
        "providerId": appointment.providerId,
        "date": appointment_dict["date"],
        "type": appointment_dict.get("type", "")
    })
    
    appointment_dict.update({
        "_id": appointment_id,
        "id": appointment_id,
        "status": "pending",
        "videoLink": video_link,
        "videoProvider": "jitsi",
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    })
    
    await appointments_collection.insert_one(appointment_dict)
    await log_audit(current_user["userId"], "create", "appointment", appointment_id)
    
    return {
        "message": "Appointment created successfully",
        "id": appointment_id,
        "videoLink": video_link,
        "status": "pending"
    }

@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get appointment details"""
    appointment = await appointments_collection.find_one(
        {"_id": appointment_id},
        {"_id": 0}
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is involved in appointment
    if current_user["userId"] not in [appointment["clientId"], appointment["providerId"]]:
        raise HTTPException(status_code=403, detail="Not authorized to view this appointment")
    
    await log_audit(current_user["userId"], "view", "appointment", appointment_id)
    return appointment

@router.patch("/{appointment_id}")
async def update_appointment(
    appointment_id: str,
    update: AppointmentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update appointment (reschedule, change status)"""
    appointment = await appointments_collection.find_one({"_id": appointment_id})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is involved in appointment
    if current_user["userId"] not in [appointment["clientId"], appointment["providerId"]]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Build update dict
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    
    # Convert date to string for MongoDB storage
    if isinstance(update_dict.get("date"), date):
        update_dict["date"] = update_dict["date"].isoformat()
    
    update_dict["updatedAt"] = datetime.now(timezone.utc)
    
    # Update appointment
    await appointments_collection.update_one(
        {"_id": appointment_id},
        {"$set": update_dict}
    )
    
    await log_audit(current_user["userId"], "update", "appointment", appointment_id, update_dict)
    
    return {"message": "Appointment updated successfully"}

@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Cancel appointment"""
    appointment = await appointments_collection.find_one({"_id": appointment_id})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is involved in appointment
    if current_user["userId"] not in [appointment["clientId"], appointment["providerId"]]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update status to cancelled
    await appointments_collection.update_one(
        {"_id": appointment_id},
        {"$set": {"status": "cancelled", "updatedAt": datetime.now(timezone.utc)}}
    )
    
    await log_audit(current_user["userId"], "delete", "appointment", appointment_id)
    
    return {"message": "Appointment cancelled successfully"}

@router.post("/{appointment_id}/join")
async def join_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get video link for appointment"""
    appointment = await appointments_collection.find_one({"_id": appointment_id})
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify user is involved in appointment
    if current_user["userId"] not in [appointment["clientId"], appointment["providerId"]]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Return video link (generate one if missing)
    video_link = appointment.get("videoLink")
    if not video_link:
        video_link = create_video_consultation({
            "id": appointment_id,
            "providerId": appointment.get("providerId", ""),
            "date": appointment.get("date", ""),
            "type": appointment.get("type", "")
        })
    
    return {
        "videoLink": video_link,
        "appointmentId": appointment_id,
        "status": appointment["status"]
    }

"""
Background task scheduler for appointment reminders.
Runs every hour to check for appointments happening in ~24 hours.
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta
from database import appointments_collection, users_collection
from services.email_service import send_appointment_reminder, is_email_configured

logger = logging.getLogger(__name__)

# Track sent reminders to avoid duplicates (in-memory, resets on restart)
sent_reminders = set()

# Track last check time for debugging
last_check_time = None
reminders_sent_total = 0


async def check_and_send_reminders():
    """
    Check for appointments happening in approximately 24 hours
    and send reminder emails.
    """
    global last_check_time, reminders_sent_total
    
    try:
        now = datetime.now(timezone.utc)
        last_check_time = now
        
        # Look for appointments between 23-25 hours from now
        target_date = (now + timedelta(hours=24)).strftime("%Y-%m-%d")
        
        logger.info(f"[REMINDER] Checking for appointments on {target_date}...")
        
        # Find confirmed appointments for tomorrow
        appointments = await appointments_collection.find({
            "date": target_date,
            "status": {"$in": ["confirmed", "pending"]}
        }).to_list(100)
        
        logger.info(f"[REMINDER] Found {len(appointments)} appointments for {target_date}")
        
        reminders_sent = 0
        
        for apt in appointments:
            apt_id = str(apt.get("_id", apt.get("id", "")))
            
            # Skip if reminder already sent
            if apt_id in sent_reminders:
                logger.debug(f"[REMINDER] Skipping {apt_id} - already sent")
                continue
            
            try:
                # Get client info
                client = await users_collection.find_one(
                    {"user_id": apt["clientId"]},
                    {"_id": 0, "password": 0}
                )
                
                # Get provider info
                provider = await users_collection.find_one(
                    {"user_id": apt["providerId"]},
                    {"_id": 0, "password": 0}
                )
                
                if client and client.get("email"):
                    result = await send_appointment_reminder(
                        client_email=client["email"],
                        client_name=client.get("name", "Patient"),
                        provider_name=provider.get("name", "Provider") if provider else "Provider",
                        appointment_type=apt.get("type", "Appointment"),
                        appointment_date=apt.get("date", ""),
                        appointment_time=apt.get("time", ""),
                        video_link=apt.get("videoLink")
                    )
                    
                    sent_reminders.add(apt_id)
                    reminders_sent += 1
                    reminders_sent_total += 1
                    logger.info(f"[REMINDER] Sent for appointment {apt_id} to {client['email']}")
                else:
                    logger.warning(f"[REMINDER] No client email found for appointment {apt_id}")
                    
            except Exception as e:
                logger.error(f"[REMINDER] Failed to send for appointment {apt_id}: {str(e)}")
        
        if reminders_sent > 0:
            logger.info(f"[REMINDER] Sent {reminders_sent} reminders this cycle")
        else:
            logger.info(f"[REMINDER] No reminders to send (0 appointments need reminders)")
            
        return {
            "checked_date": target_date,
            "appointments_found": len(appointments),
            "reminders_sent": reminders_sent,
            "total_sent": reminders_sent_total
        }
            
    except Exception as e:
        logger.error(f"[REMINDER] Error in check: {str(e)}")
        return {"error": str(e)}


async def get_scheduler_status():
    """Get current status of the reminder scheduler."""
    return {
        "status": "running",
        "last_check": last_check_time.isoformat() if last_check_time else None,
        "reminders_sent_total": reminders_sent_total,
        "reminders_in_memory": len(sent_reminders),
        "email_configured": is_email_configured()
    }


async def reminder_scheduler():
    """
    Background task that runs every hour to check for appointments
    and send reminders.
    """
    logger.info("[REMINDER] Scheduler started - will run every hour")
    
    # Run initial check on startup
    await check_and_send_reminders()
    
    while True:
        try:
            # Wait 1 hour before next check
            await asyncio.sleep(3600)
            await check_and_send_reminders()
        except Exception as e:
            logger.error(f"[REMINDER] Scheduler error: {str(e)}")


def start_reminder_scheduler():
    """
    Start the reminder scheduler as a background task.
    Call this from server startup.
    """
    asyncio.create_task(reminder_scheduler())
    logger.info("[REMINDER] Scheduler task created")

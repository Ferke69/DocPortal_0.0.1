"""
GDPR Compliance Routes
Handles data export and deletion requests as required by EU GDPR regulations.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from auth import get_current_user
from database import (
    users_collection, appointments_collection, messages_collection,
    invoices_collection, provider_settings_collection, log_audit
)
from services.secure_messaging import decrypt_message
from services.email_service import send_email, is_email_configured
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gdpr", tags=["GDPR"])


@router.get("/export-data")
async def export_user_data(current_user: dict = Depends(get_current_user)):
    """
    Export all user data as JSON (GDPR Article 20 - Right to data portability)
    """
    user_id = current_user["userId"]
    user_role = current_user.get("role", "client")
    
    try:
        # Get user profile
        user_data = await users_collection.find_one(
            {"user_id": user_id},
            {"_id": 0, "password": 0}  # Exclude sensitive fields
        )
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get appointments
        appointments = await appointments_collection.find(
            {"$or": [{"clientId": user_id}, {"providerId": user_id}]},
            {"_id": 0}
        ).to_list(1000)
        
        # Get messages (decrypted)
        messages_raw = await messages_collection.find(
            {"$or": [{"senderId": user_id}, {"receiverId": user_id}]},
            {"_id": 0}
        ).to_list(1000)
        
        # Decrypt messages for export
        messages = []
        for msg in messages_raw:
            decrypted_msg = msg.copy()
            if msg.get("encrypted") and msg.get("message"):
                decrypted_msg["message"] = decrypt_message(
                    msg["message"],
                    msg.get("messageHash")
                )
            messages.append(decrypted_msg)
        
        # Get billing/invoices
        invoices = await invoices_collection.find(
            {"$or": [{"clientId": user_id}, {"providerId": user_id}]},
            {"_id": 0}
        ).to_list(1000)
        
        # For providers, include business settings and client list
        business_settings = None
        clients = []
        if user_role == "provider":
            business_settings = await provider_settings_collection.find_one(
                {"providerId": user_id},
                {"_id": 0}
            )
            
            # Get list of clients
            client_list = await users_collection.find(
                {"providerId": user_id, "role": "client"},
                {"_id": 0, "password": 0, "user_id": 1, "name": 1, "email": 1, "createdAt": 1}
            ).to_list(1000)
            clients = client_list
        
        # Build export object
        export_data = {
            "export_info": {
                "exported_at": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id,
                "user_role": user_role,
                "data_controller": "DocPortal",
                "contact": "privacy@docportal.com"
            },
            "profile": user_data,
            "appointments": appointments,
            "messages": messages,
            "invoices": invoices
        }
        
        if user_role == "provider":
            export_data["business_settings"] = business_settings
            export_data["clients"] = clients
        
        # Log the export action
        await log_audit(user_id, "export", "gdpr_data", user_id, {
            "appointments_count": len(appointments),
            "messages_count": len(messages),
            "invoices_count": len(invoices)
        })
        
        logger.info(f"GDPR data export completed for user {user_id}")
        return export_data
        
    except Exception as e:
        logger.error(f"GDPR export error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export data")


@router.post("/delete-request")
async def request_account_deletion(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Request account deletion (GDPR Article 17 - Right to erasure)
    Account will be marked for deletion and removed within 30 days.
    """
    user_id = current_user["userId"]
    user_email = current_user.get("email", "")
    user_name = current_user.get("name", "User")
    
    try:
        # Mark account for deletion
        deletion_date = datetime.now(timezone.utc)
        
        await users_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "deletionRequested": True,
                    "deletionRequestedAt": deletion_date,
                    "status": "pending_deletion"
                }
            }
        )
        
        # Log the deletion request
        await log_audit(user_id, "delete_request", "account", user_id, {
            "requested_at": deletion_date.isoformat()
        })
        
        # Send confirmation email (if configured)
        if is_email_configured() and user_email:
            background_tasks.add_task(
                send_deletion_confirmation_email,
                user_email,
                user_name
            )
        else:
            logger.info(f"[DEMO] Deletion confirmation would be sent to: {user_email}")
        
        logger.info(f"GDPR deletion request submitted for user {user_id}")
        
        return {
            "status": "success",
            "message": "Deletion request submitted. Your account will be deleted within 30 days.",
            "deletion_requested_at": deletion_date.isoformat()
        }
        
    except Exception as e:
        logger.error(f"GDPR deletion request error for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit deletion request")


async def send_deletion_confirmation_email(email: str, name: str):
    """Send email confirming deletion request"""
    subject = "Account Deletion Request Confirmed - DocPortal"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
                <td style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #2563eb;">DocPortal</h1>
                    
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #3f3f46;">
                        Hi {name.split()[0] if name else 'there'},
                    </p>
                    
                    <p style="margin: 0 0 24px 0; font-size: 16px; color: #3f3f46;">
                        We have received your request to delete your DocPortal account.
                    </p>
                    
                    <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 14px; color: #92400e;">
                            <strong>What happens next:</strong><br><br>
                            • Your account will be permanently deleted within 30 days<br>
                            • All your personal data, messages, and appointment history will be removed<br>
                            • Invoice records may be retained for legal compliance (up to 10 years)<br>
                            • This action cannot be undone
                        </p>
                    </div>
                    
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #71717a;">
                        If you did not request this deletion, please contact us immediately at privacy@docportal.com
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
                    
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                        This is an automated message from DocPortal regarding your GDPR rights.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    await send_email(email, subject, html_content)


@router.get("/deletion-status")
async def get_deletion_status(current_user: dict = Depends(get_current_user)):
    """Check if account has a pending deletion request"""
    user_id = current_user["userId"]
    
    # First check if user exists (without projection to avoid empty dict issue)
    user_exists = await users_collection.find_one(
        {"user_id": user_id},
        {"_id": 0, "user_id": 1}
    )
    
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get deletion-related fields
    user = await users_collection.find_one(
        {"user_id": user_id},
        {"_id": 0, "deletionRequested": 1, "deletionRequestedAt": 1, "status": 1}
    )
    
    return {
        "deletion_requested": user.get("deletionRequested", False) if user else False,
        "deletion_requested_at": user.get("deletionRequestedAt") if user else None,
        "status": user.get("status", "active") if user else "active"
    }

import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import api from '../services/api';

const DataPrivacySettings = () => {
  const { user, logout } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const response = await api.get('/gdpr/export-data');
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `docportal-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error.response?.data?.detail || "Could not export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast({
        title: "Confirmation required",
        description: "Please type 'DELETE MY ACCOUNT' to confirm.",
        variant: "destructive"
      });
      return;
    }

    setDeleteLoading(true);
    try {
      await api.post('/gdpr/delete-request');
      
      toast({
        title: "Deletion request submitted",
        description: "Your account will be deleted within 30 days. You will receive a confirmation email.",
      });

      // Log out after deletion request
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (error) {
      toast({
        title: "Request failed",
        description: error.response?.data?.detail || "Could not submit deletion request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* GDPR Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-200">Your Data Rights (GDPR)</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
              Under EU law, you have the right to access, export, and delete your personal data at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Download className="h-5 w-5 mr-2 text-green-600" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Download a copy of all your personal data stored in DocPortal. This includes your profile 
            information, appointments, messages, and billing history.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">What's included:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Account information (name, email, preferences)</li>
              <li>• Appointment history</li>
              <li>• Message history (decrypted)</li>
              <li>• Billing and invoice records</li>
              {user?.role === 'provider' && <li>• Business settings and client list</li>}
            </ul>
          </div>
          <Button 
            onClick={handleExportData} 
            disabled={exportLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {exportLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Preparing export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download My Data (JSON)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-200">Warning: This action is irreversible</h4>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  Deleting your account will permanently remove all your data from DocPortal within 30 days. 
                  This includes your profile, appointments, messages, and billing history.
                </p>
              </div>
            </div>
          </div>

          {user?.role === 'provider' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note for providers:</strong> Deleting your account will remove access for all your 
                patients. Please ensure you have notified them and provided alternative care arrangements.
              </p>
            </div>
          )}

          {!showDeleteConfirm ? (
            <Button 
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Request Account Deletion
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="confirmDelete" className="text-gray-700 dark:text-gray-300">
                  Type <strong>DELETE MY ACCOUNT</strong> to confirm:
                </Label>
                <Input
                  id="confirmDelete"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteRequest}
                  disabled={deleteLoading || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Processing Info */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Data Processing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Data Controller:</strong> DocPortal<br />
              <strong>Contact:</strong> privacy@docportal.com
            </p>
            <p>
              <strong>Legal Basis for Processing:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contract performance (providing our service to you)</li>
              <li>Legal obligation (invoice retention requirements)</li>
              <li>Legitimate interest (service improvement, security)</li>
            </ul>
            <p className="mt-4">
              For more information, see our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacySettings;

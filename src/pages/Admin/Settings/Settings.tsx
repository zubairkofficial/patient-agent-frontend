import { useState } from "react";
import { Settings as SettingsIcon, Bell, Lock, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { toast } from "sonner";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    preferences: {
      language: "en",
      timezone: "UTC",
      theme: "light",
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
  });

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePreferenceChange = (
    key: keyof typeof settings.preferences,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const handleSecurityChange = (
    key: keyof typeof settings.security,
    value: boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Call API to save settings
      // await settingsService.saveSettings(settings);
      
      // Save to localStorage as fallback
      localStorage.setItem("userSettings", JSON.stringify(settings));
      
      toast.success("Settings saved successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save settings";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Notifications
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email Notifications
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("email")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${settings.notifications.email ? "bg-primary" : "bg-muted"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.notifications.email ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Push Notifications
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("push")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${settings.notifications.push ? "bg-primary" : "bg-muted"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.notifications.push ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    SMS Notifications
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange("sms")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${settings.notifications.sms ? "bg-primary" : "bg-muted"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.notifications.sms ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Preferences
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange("language", e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={settings.preferences.timezone}
                  onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Theme
                </label>
                <select
                  id="theme"
                  value={settings.preferences.theme}
                  onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Security
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Two-Factor Authentication
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={() => handleSecurityChange("twoFactor", !settings.security.twoFactor)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${settings.security.twoFactor ? "bg-primary" : "bg-muted"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.security.twoFactor ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div>
                <label
                  htmlFor="sessionTimeout"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  id="sessionTimeout"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSecurityChange("sessionTimeout", parseInt(e.target.value) || 30)
                  }
                  min="5"
                  max="120"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              size="medium"
              text={isSaving ? "Saving..." : "Save Settings"}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

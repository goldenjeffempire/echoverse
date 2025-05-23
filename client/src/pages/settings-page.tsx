// client/src/pages/settings-page.tsx
import React, { useState, useEffect, FormEvent } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Switch,
} from "@/components/ui";

import { useToast } from "@/lib/toast";

import {
  Loader2,
  User,
  Shield,
  Bell,
  Lock,
  LogOut,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

// Backend API simulation functions
async function apiLogout(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function apiRegenerateKey(): Promise<string> {
  return new Promise((resolve) =>
    setTimeout(() => resolve("NEW-API-KEY-XYZ-1234567890"), 1500)
  );
}

type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
};

type NotificationsSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
};

type ApiUsage = {
  used: number;
  limit: number;
};

export default function SettingsPage() {
  // States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [notifications, setNotifications] = useState<NotificationsSettings>({
    emailNotifications: true,
    smsNotifications: false,
  });
  const [notifSaving, setNotifSaving] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyRegenerating, setApiKeyRegenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [apiUsage, setApiUsage] = useState<ApiUsage>({ used: 0, limit: 1000 });
  const [apiUsageLoading, setApiUsageLoading] = useState(true);

  const [logoutLoading, setLogoutLoading] = useState(false);

  // Fetch profile, API key & usage on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingProfile(true);
        setApiKeyLoading(true);
        setApiUsageLoading(true);

        // Replace these with actual backend calls
        const fetchedUser: UserProfile = {
          username: "jeffery_dev",
          email: "jeff@example.com",
          firstName: "Jeffery",
          lastName: "Smith",
          bio: "Hard working and love being the best out of all in my work.",
        };
        setUser(fetchedUser);

        setApiKey("1234-5678-ABCD-EFGH");

        setApiUsage({ used: 250, limit: 1000 });
      } catch {
        setErrorProfile("Failed to load profile data.");
      } finally {
        setLoadingProfile(false);
        setApiKeyLoading(false);
        setApiUsageLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update profile handler
  async function handleUpdateProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setUpdatingProfile(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Backend update call here (replace with actual API call)

      setUser((prev) => ({
        ...(prev as UserProfile),
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        bio: formData.get("bio") as string,
      }));

      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  }

  // Change password handler
  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError("");
    setChangingPassword(true);

    const form = e.currentTarget;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setChangingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      setChangingPassword(false);
      return;
    }

    try {
      // Call backend API to change password here

      await new Promise((r) => setTimeout(r, 1000)); // Simulate delay

      toast.success("Password changed successfully.");
      form.reset();
    } catch {
      setPasswordError("Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  }

  // Toggle notifications
  async function handleToggleNotification(key: keyof NotificationsSettings) {
    setNotifSaving(true);
    try {
      const newValue = !notifications[key];
      setNotifications((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      await new Promise((r) => setTimeout(r, 500)); // Simulate save delay

      toast.success(`Notification setting updated: ${key}`);
    } catch {
      toast.error("Failed to update notification setting.");
    } finally {
      setNotifSaving(false);
    }
  }

  // Copy API key
  function handleCopyApiKey() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }

  // Regenerate API key
  async function handleRegenerateApiKey() {
    setApiKeyRegenerating(true);
    try {
      const newKey = await apiRegenerateKey();
      setApiKey(newKey);
      toast.success("API key regenerated.");
    } catch {
      toast.error("Failed to regenerate API key.");
    } finally {
      setApiKeyRegenerating(false);
    }
  }

  // Logout
  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await apiLogout();
      toast.success("Logged out successfully.");
      // TODO: Add redirect or state clearing logic here
    } catch {
      toast.error("Failed to log out.");
    } finally {
      setLogoutLoading(false);
    }
  }

  // Loading & error states
  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertCircle size={32} className="mx-auto mb-4" />
        <p>{errorProfile}</p>
      </div>
    );
  }

  // Main UI render
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" icon={<User size={16} />}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" icon={<Shield size={16} />}>
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={<Bell size={16} />}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" icon={<Lock size={16} />}>
            API
          </TabsTrigger>
          <TabsTrigger value="logout" icon={<LogOut size={16} />}>
            Logout
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal info.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username (read-only)</Label>
                  <Input
                    id="username"
                    type="text"
                    value={user?.username}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      defaultValue={user?.firstName}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      defaultValue={user?.lastName}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    defaultValue={user?.bio || ""}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <CardFooter>
                  <Button type="submit" disabled={updatingProfile}>
                    {updatingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="At least 8 characters"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    required
                    autoComplete="new-password"
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}

                <CardFooter>
                  <Button type="submit" disabled={changingPassword}>
                    {changingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={() =>
                    handleToggleNotification("emailNotifications")
                  }
                  disabled={notifSaving}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <Switch
                  id="smsNotifications"
                  checked={notifications.smsNotifications}
                  onCheckedChange={() =>
                    handleToggleNotification("smsNotifications")
                  }
                  disabled={notifSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API key and usage.</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeyLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1"
                    aria-label="API Key"
                  />
                  <Button variant="outline" onClick={handleCopyApiKey} size="sm">
                    {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                  <Button
                    onClick={handleRegenerateApiKey}
                    disabled={apiKeyRegenerating}
                    size="sm"
                  >
                    {apiKeyRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <Label>API Usage</Label>
                {apiUsageLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <div className="text-sm text-gray-600">
                    {apiUsage.used} of {apiUsage.limit} requests used
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOGOUT */}
        <TabsContent value="logout">
          <Card>
            <CardHeader>
              <CardTitle>Logout</CardTitle>
              <CardDescription>Sign out from your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Ready to end your session? Click below to logout securely.
              </p>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

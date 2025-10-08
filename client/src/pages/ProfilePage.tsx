import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-1">John Doe</h1>
              <p className="text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses" data-testid="tab-addresses">Addresses</TabsTrigger>
              <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" data-testid="input-first-name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" data-testid="input-last-name" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" data-testid="input-email" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="(555) 123-4567" data-testid="input-phone" />
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue="1990-01-01" data-testid="input-dob" />
                  </div>

                  <Button type="submit" data-testid="button-save-profile">Save Changes</Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Button data-testid="button-add-new-address">Add New</Button>
                </div>

                <div className="space-y-4">
                  <Card className="p-4 hover-elevate">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium mb-1">Home</div>
                        <p className="text-sm text-muted-foreground">
                          123 Main Street, Apt 4B<br />
                          New York, NY 10001<br />
                          Phone: (555) 123-4567
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" data-testid="button-edit-address-1">Edit</Button>
                        <Button variant="ghost" size="sm" data-testid="button-delete-address-1">Delete</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover-elevate">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium mb-1">Office</div>
                        <p className="text-sm text-muted-foreground">
                          456 Business Ave, Suite 200<br />
                          New York, NY 10002<br />
                          Phone: (555) 987-6543
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" data-testid="button-edit-address-2">Edit</Button>
                        <Button variant="ghost" size="sm" data-testid="button-delete-address-2">Delete</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <form className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" data-testid="input-current-password" />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" data-testid="input-new-password" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" data-testid="input-confirm-password" />
                  </div>

                  <Button type="submit" data-testid="button-change-password">Update Password</Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

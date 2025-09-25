import { useEffect } from 'react';

import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';

import { useProfileStore } from '@/stores/profileStore';

function SettingsPage() {
  const { profile, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">Settings</h1>
      </CardHeader>
      <CardBody>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Spinner label="Loading profile..." />
          </div>
        )}
        {error && (
          <div className="text-danger p-4 bg-danger-50 rounded-md">
            <p className="font-semibold">Error loading profile:</p>
            <p>{error}</p>
          </div>
        )}
        {profile && !isLoading && !error && (
          <div className="space-y-4">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Display Currency:</strong>{' '}
              <Chip color="primary" variant="flat">
                {profile.display_currency}
              </Chip>
            </p>
          </div>
        )}{' '}
      </CardBody>
    </Card>
  );
}

export default SettingsPage;

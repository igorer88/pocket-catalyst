import { Card, CardBody, CardHeader } from '@heroui/react';

function HomePage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
      </CardHeader>
      <CardBody>
        <p>Welcome to your budget manager dashboard!</p>
        <p>More summary information will be displayed here soon.</p>
      </CardBody>
    </Card>
  );
}

export default HomePage;

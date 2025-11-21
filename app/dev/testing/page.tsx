import { redirect } from 'next/navigation';
import DevTestingTool from '@/components/dev/DevTestingTool';

export default function DevTestingPage() {
  // Only accessible in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DevTestingTool />
    </div>
  );
}
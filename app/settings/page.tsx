import { redirect } from 'next/navigation';

export default function SettingsPage() {
    // Redirect to company settings
    redirect('/company/settings');
}

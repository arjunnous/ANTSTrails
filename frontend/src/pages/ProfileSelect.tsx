import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Layout } from '../components/Layout';
import { Badge } from '../components/ui/badge';

interface Profile {
  id: number;
  name: string;
  description: string;
  min_weeks: number;
  max_weeks: number;
}

export default function ProfileSelect() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/profile/list').then((res) => setProfiles(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!selected) return;
    await api.post('/profile/select', { profile_id: selected });
    navigate('/roadmap');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="bg-white p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Choose a profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Select your learning path</h1>
            </div>
            <Badge variant="secondary">Step 1</Badge>
          </div>
          <p className="mt-4 text-slate-600">Pick the profile that matches your goals and start the roadmap instantly.</p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`cursor-pointer transition duration-300 ${
                selected === profile.id ? 'border-sky-500 shadow-sky-100' : 'border-slate-200'
              } border bg-white`}
              onClick={() => setSelected(profile.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{profile.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{profile.description}</p>
                </div>
                {selected === profile.id ? (
                  <Badge variant="secondary">Selected</Badge>
                ) : (
                  <Badge variant="default">Profile</Badge>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>Duration</span>
                <span>{profile.min_weeks}-{profile.max_weeks} weeks</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selected}>
            Continue to roadmap
          </Button>
        </div>
      </div>
    </Layout>
  );
}

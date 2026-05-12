import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { DropdownMenu } from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';

interface ModuleItem {
  id: number;
  title: string;
  category: string;
  resource_name: string;
  resource_link: string;
  estimated_time: string;
  progress_state: string;
  percentage: number;
}

interface RoadmapData {
  profile_name: string;
  overall_percentage: number;
  modules: ModuleItem[];
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/roadmap/');
      setRoadmap(res.data);
    } catch {
      alert('No roadmap found, please select profile first');
      navigate('/select-profile');
    }
  };

  const updateProgress = async (moduleId: number, newState: string) => {
    await api.put('/progress/update', {
      module_id: moduleId,
      progress_state: newState,
    });
    fetchRoadmap();
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center">
          <p className="text-slate-600">Loading your roadmap…</p>
        </Card>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="bg-white p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active roadmap</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{roadmap.profile_name}</h1>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p>Overall progress: {roadmap.overall_percentage}%</p>
              <Progress value={roadmap.overall_percentage} />
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          {roadmap.modules.map((mod) => (
            <Card key={mod.id} className="bg-white p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <h2 className="text-xl font-semibold text-slate-900">{mod.title}</h2>
                    <Badge variant="secondary">{mod.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">Resource: {mod.resource_name}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <a
                      href={mod.resource_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Open resource
                    </a>
                    <span className="text-sm text-slate-500">Est: {mod.estimated_time}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[220px]">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Progress</p>
                    <Progress value={mod.percentage} />
                    <p className="mt-2 text-sm text-slate-500">{mod.percentage}% complete</p>
                  </div>

                  <DropdownMenu
                    label="Update status"
                    value={mod.progress_state}
                    options={[
                      { value: 'not_started', label: 'Not Started' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'completed', label: 'Completed' },
                    ]}
                    onChange={(value) => updateProgress(mod.id, value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

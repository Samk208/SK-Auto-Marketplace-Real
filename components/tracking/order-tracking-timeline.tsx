'use client';

import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Anchor, CheckCircle2, Clock, FileText, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrackingStage {
    id: string;
    stage_type: 'payment' | 'documentation' | 'shipping' | 'customs' | 'delivery';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completed_at: string | null;
    notes: string | null;
    location_name: string | null;
    eta: string | null;
}

interface OrderTrackingTimelineProps {
    escrowId: string;
}

const STAGE_CONFIG = {
    payment: { icon: FileText, label: 'Payment Secured' },
    documentation: { icon: FileText, label: 'Export Documents' },
    shipping: { icon: Anchor, label: 'Ocean Freight' },
    customs: { icon: CheckCircle2, label: 'Customs Clearance' },
    delivery: { icon: Truck, label: 'Final Delivery' }
};

export function OrderTrackingTimeline({ escrowId }: OrderTrackingTimelineProps) {
    const [stages, setStages] = useState<TrackingStage[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchStages = async () => {
            const { data, error } = await supabase
                .from('order_tracking_stages')
                .select('*')
                .eq('escrow_id', escrowId);

            if (data) {
                // Sort by logical order (this simple sort assumes the array is returned in some consistent order or we map it)
                // Better to rely on a map since stage_type is the key.
                const ORDER = ['payment', 'documentation', 'shipping', 'customs', 'delivery'];
                const sorted = data.sort((a, b) => ORDER.indexOf(a.stage_type) - ORDER.indexOf(b.stage_type));
                setStages(sorted as TrackingStage[]);
            }
        };

        fetchStages();

        // Subscribe to changes
        const channel = supabase
            .channel(`order_tracking:${escrowId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'order_tracking_stages',
                filter: `escrow_id=eq.${escrowId}`
            }, () => {
                fetchStages();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [escrowId, supabase]);

    if (stages.length === 0) return <div>Loading tracking info...</div>;

    return (
        <div className="space-y-6">
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
                {stages.map((stage, index) => {
                    const Config = STAGE_CONFIG[stage.stage_type];
                    const Icon = Config.icon;
                    const isCompleted = stage.status === 'completed';
                    const isInProgress = stage.status === 'in_progress';

                    return (
                        <div key={stage.id} className="relative pl-8">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 
                ${isCompleted ? 'bg-green-500 border-green-500' :
                                    isInProgress ? 'bg-blue-500 border-blue-500' : 'bg-slate-100 border-slate-300'}`}
                            />

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold ${isCompleted || isInProgress ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>
                                        {Config.label}
                                    </h3>
                                    {stage.status === 'completed' && <Badge variant="default" className="bg-green-600">Completed</Badge>}
                                    {stage.status === 'in_progress' && <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>}
                                </div>

                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {stage.notes}
                                </div>

                                {stage.location_name && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Truck className="h-3 w-3" /> Location: {stage.location_name}
                                    </div>
                                )}

                                {stage.eta && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Clock className="h-3 w-3" /> ETA: {new Date(stage.eta).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

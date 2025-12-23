'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

// Common interface for flags
export interface AIConditionFlag {
  severity: "info" | "warning" | "critical";
  category: string;
  description: string;
  confidence: number;
}

interface ConditionReport {
  id: string;
  overall_score: number;
  condition_grade: 'excellent' | 'good' | 'fair' | 'poor';
  summary: string;
  flags: AIConditionFlag[];
  created_at: string;
}

interface AIConditionReportProps {
  listingId: string;
  // Optional props to maintain backward compatibility if needed, but we prefer listingId
  images?: string[];
  vehicleInfo?: any;
  isAuthenticated?: boolean; // We'll make this optional and default to true for now or handle inside
}

export function AIConditionReport({ listingId }: AIConditionReportProps) {
  const [report, setReport] = useState<ConditionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/listings/${listingId}/analyze`, {
        method: 'POST'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'fair': return 'bg-yellow-500 text-black';
      case 'poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full mt-8 border-blue-100 dark:border-blue-900 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-blue-900 dark:text-blue-100">AI Inspector</CardTitle>
          </div>
          {report && (
            <Badge className={`${getGradeColor(report.condition_grade)} capitalize text-base px-3 py-1`}>
              Grade: {report.condition_grade}
            </Badge>
          )}
        </div>
        <CardDescription>
          Automated visual condition assessment by Google Gemini
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {!report && !loading && (
          <div className="text-center py-6">
            <p className="text-slate-600 mb-4">
              Request a detailed AI analysis of the vehicle photos to detect dents, scratches, and verify condition.
            </p>
            <Button onClick={handleAnalyze} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Sparkles className="h-4 w-4" />
              Analyze Condition
            </Button>
            {error && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded">{error}</p>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-500 animate-pulse">Analyzing vehicle images... please wait...</p>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Summary Score */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Overall Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{report.overall_score}/100</p>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex-[3]">
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{report.summary}"</p>
              </div>
            </div>

            {/* Findings */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Key Findings</h4>
              {report.flags.length === 0 ? (
                <p className="text-slate-500 italic">No significant issues detected.</p>
              ) : (
                report.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-3 rounded-md border ${flag.severity === 'critical' ? 'bg-red-50 border-red-100 dark:bg-red-950/20' :
                        flag.severity === 'warning' ? 'bg-yellow-50 border-yellow-100 dark:bg-yellow-950/20' :
                          'bg-green-50 border-green-100 dark:bg-green-950/20'
                      }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getSeverityIcon(flag.severity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize text-slate-900 dark:text-slate-100">{flag.category}</span>
                        <Badge variant="outline" className="text-xs">{flag.confidence}% Conf</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{flag.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

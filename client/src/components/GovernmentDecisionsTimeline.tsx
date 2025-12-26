import { AlertTriangle, TrendingDown, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GovernmentDecision {
  id: number;
  country: string;
  year: number;
  month: number;
  decisionType: string;
  title: string;
  description: string;
  officialPromise: string;
  actualOutcome: string;
  impactScore: number;
  economicImpact: string | null;
  socialImpact: string | null;
}

interface GovernmentDecisionsTimelineProps {
  decisions: GovernmentDecision[];
  country?: string;
}

export function GovernmentDecisionsTimeline({ decisions, country }: GovernmentDecisionsTimelineProps) {
  const filteredDecisions = country 
    ? decisions.filter(d => d.country === country)
    : decisions;

  const sortedDecisions = [...filteredDecisions].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const getImpactColor = (score: number) => {
    if (score >= 0) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (score >= -40) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    if (score >= -60) return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    return "bg-rose-500/20 text-rose-300 border-rose-500/30";
  };

  const getDecisionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      immigration_policy: "Иммиграционная политика",
      welfare_reform: "Реформа соцобеспечения",
      housing_policy: "Жилищная политика",
      tax_reform: "Налоговая реформа",
      labor_policy: "Трудовая политика",
    };
    return labels[type] || type;
  };

  const formatDate = (year: number, month: number) => {
    const months = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    return `${months[month - 1]} ${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-500/10 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Решения правительства</h2>
          <p className="text-sm text-gray-400">Обещания vs Реальность</p>
        </div>
      </div>

      {sortedDecisions.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Нет данных о решениях правительства</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500/50 via-orange-500/50 to-transparent" />

          <div className="space-y-6">
            {sortedDecisions.map((decision, index) => (
              <div key={decision.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-rose-500 border-4 border-gray-950 shadow-lg shadow-rose-500/50" />

                <Card className="bg-gray-900/80 border-gray-800 hover:border-rose-500/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{formatDate(decision.year, decision.month)}</span>
                          <Badge variant="outline" className="text-xs">
                            {getDecisionTypeLabel(decision.decisionType)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-white">{decision.title}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{decision.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getImpactColor(decision.impactScore)} flex items-center gap-1 px-3 py-1`}
                      >
                        <TrendingDown className="w-3 h-3" />
                        {decision.impactScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Promise vs Reality */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-500" />
                          <h4 className="text-sm font-semibold text-cyan-400">Обещали</h4>
                        </div>
                        <p className="text-sm text-gray-300 pl-4 border-l-2 border-cyan-500/30">
                          {decision.officialPromise}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <h4 className="text-sm font-semibold text-rose-400">Получили</h4>
                        </div>
                        <p className="text-sm text-gray-300 pl-4 border-l-2 border-rose-500/30">
                          {decision.actualOutcome}
                        </p>
                      </div>
                    </div>

                    {/* Impact Details */}
                    {(decision.economicImpact || decision.socialImpact) && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                        {decision.economicImpact && (
                          <div className="space-y-1">
                            <h5 className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                              Экономические последствия
                            </h5>
                            <p className="text-sm text-gray-400">{decision.economicImpact}</p>
                          </div>
                        )}
                        {decision.socialImpact && (
                          <div className="space-y-1">
                            <h5 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                              Социальные последствия
                            </h5>
                            <p className="text-sm text-gray-400">{decision.socialImpact}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {sortedDecisions.length > 0 && (
        <Card className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border-rose-500/30">
          <CardContent className="py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sortedDecisions.length}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Решений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-400">
                  {sortedDecisions.filter(d => d.impactScore < 0).length}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Негативных</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {Math.round(sortedDecisions.reduce((sum, d) => sum + Math.abs(d.impactScore), 0) / sortedDecisions.length)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Средний импакт</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {new Set(sortedDecisions.map(d => d.year)).size}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Лет</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

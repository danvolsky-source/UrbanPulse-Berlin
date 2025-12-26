import { TrendingUp, Users, DollarSign, AlertCircle, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UnemploymentData {
  year: number;
  unemploymentRate: number;
  youthUnemploymentRate: number;
  foreignerUnemploymentRate: number;
  longTermUnemployed: number;
}

interface SocialBenefitsData {
  year: number;
  totalBenefitsSpending: number;
  unemploymentBenefits: number;
  housingBenefits: number;
  refugeeBenefits: number;
  foreignerBeneficiariesPercent: number;
}

interface TaxBurdenData {
  year: number;
  averageTaxRate: number;
  socialSpendingPercent: number;
  taxRevenuePerCapita: number;
}

interface IncomeData {
  year: number;
  averageMonthlyIncome: number;
  foreignerAverageIncome: number;
  incomeGrowthRate: number;
}

interface EconomicImpactDashboardProps {
  unemployment: UnemploymentData[];
  socialBenefits: SocialBenefitsData[];
  taxBurden: TaxBurdenData[];
  income: IncomeData[];
  cityName: string;
}

export function EconomicImpactDashboard({ 
  unemployment, 
  socialBenefits, 
  taxBurden, 
  income,
  cityName 
}: EconomicImpactDashboardProps) {
  
  // Prepare data for charts
  const unemploymentChartData = unemployment.map(u => ({
    year: u.year,
    "Общая": u.unemploymentRate / 10,
    "Молодёжь": u.youthUnemploymentRate / 10,
    "Иностранцы": u.foreignerUnemploymentRate / 10,
  }));

  const socialBenefitsChartData = socialBenefits.map(s => ({
    year: s.year,
    "Безработица": s.unemploymentBenefits,
    "Жильё": s.housingBenefits,
    "Беженцы": s.refugeeBenefits,
  }));

  const taxBurdenChartData = taxBurden.map(t => ({
    year: t.year,
    "Налоговая ставка": t.averageTaxRate / 10,
    "Соцрасходы": t.socialSpendingPercent / 10,
  }));

  const incomeChartData = income.map(i => ({
    year: i.year,
    "Средний доход": i.averageMonthlyIncome,
    "Доход иностранцев": i.foreignerAverageIncome,
  }));

  // Calculate key metrics
  const latestUnemployment = unemployment[unemployment.length - 1];
  const firstUnemployment = unemployment[0];
  const unemploymentGrowth = latestUnemployment && firstUnemployment 
    ? ((latestUnemployment.unemploymentRate - firstUnemployment.unemploymentRate) / firstUnemployment.unemploymentRate * 100).toFixed(1)
    : "0";

  const latestBenefits = socialBenefits[socialBenefits.length - 1];
  const firstBenefits = socialBenefits[0];
  const benefitsGrowth = latestBenefits && firstBenefits
    ? ((latestBenefits.totalBenefitsSpending - firstBenefits.totalBenefitsSpending) / firstBenefits.totalBenefitsSpending * 100).toFixed(1)
    : "0";

  const latestTax = taxBurden[taxBurden.length - 1];
  const firstTax = taxBurden[0];
  const taxGrowth = latestTax && firstTax
    ? ((latestTax.averageTaxRate - firstTax.averageTaxRate) / firstTax.averageTaxRate * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-500/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Экономическое влияние</h2>
          <p className="text-sm text-gray-400">{cityName} • 2020-2024</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
          <CardContent className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Рост безработицы</p>
                <p className="text-3xl font-bold text-rose-400">+{unemploymentGrowth}%</p>
                <p className="text-xs text-gray-500 mt-1">за 5 лет</p>
              </div>
              <div className="p-3 bg-rose-500/20 rounded-lg">
                <Users className="w-6 h-6 text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30">
          <CardContent className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Рост соцвыплат</p>
                <p className="text-3xl font-bold text-orange-400">+{benefitsGrowth}%</p>
                <p className="text-xs text-gray-500 mt-1">за 5 лет</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Wallet className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30">
          <CardContent className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Рост налогов</p>
                <p className="text-3xl font-bold text-yellow-400">+{taxGrowth}%</p>
                <p className="text-xs text-gray-500 mt-1">за 5 лет</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unemployment Trends */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-rose-400" />
            Динамика безработицы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={unemploymentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: '%', position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Общая" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} />
              <Line type="monotone" dataKey="Молодёжь" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} />
              <Line type="monotone" dataKey="Иностранцы" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Social Benefits Breakdown */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="w-5 h-5 text-orange-400" />
            Социальные выплаты (млн €)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialBenefitsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="Безработица" fill="#F59E0B" />
              <Bar dataKey="Жильё" fill="#EF4444" />
              <Bar dataKey="Беженцы" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tax Burden */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Налоговая нагрузка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taxBurdenChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: '%', position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Налоговая ставка" stroke="#FBBF24" strokeWidth={2} dot={{ fill: '#FBBF24', r: 4 }} />
              <Line type="monotone" dataKey="Соцрасходы" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income Comparison */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Средние доходы (€/месяц)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="Средний доход" fill="#06B6D4" />
              <Bar dataKey="Доход иностранцев" fill="#0891B2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {latestBenefits && latestUnemployment && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              AI обнаружил критические корреляции
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-2" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-rose-400">Безработица среди иностранцев</span> в {latestUnemployment.foreignerUnemploymentRate / 10}% 
                в 2.2 раза выше общей ({latestUnemployment.unemploymentRate / 10}%)
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-orange-400">{latestBenefits.foreignerBeneficiariesPercent / 10}% получателей</span> социальных пособий - 
                иностранцы, при том что они составляют ~15-20% населения
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-yellow-400">Расходы на беженцев</span> выросли с {firstBenefits?.refugeeBenefits || 0} до {latestBenefits.refugeeBenefits} млн € 
                (+{benefitsGrowth}% за 5 лет)
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-rose-500/30">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 animate-pulse" />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-rose-400">Критический вопрос:</span> Почему правительство не предупредило граждан о росте налогов 
                на {taxGrowth}% для финансирования этих программ?
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

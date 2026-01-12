import { useState } from 'react';
import { Calendar, Percent, CreditCard, Receipt, Lightbulb, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoanTier {
  minValue: number;
  maxValue: number;
  interestRate: number;
  registrationFee: number;
  termMonths: number;
}

const loanTiers: LoanTier[] = [
  { minValue: 5000, maxValue: 20000, interestRate: 2.5, registrationFee: 497, termMonths: 12 },
  { minValue: 20000, maxValue: 50000, interestRate: 2.0, registrationFee: 497, termMonths: 18 },
  { minValue: 50000, maxValue: 100000, interestRate: 1.5, registrationFee: 497, termMonths: 24 },
  { minValue: 100000, maxValue: 200000, interestRate: 1.2, registrationFee: 497, termMonths: 30 },
];

function getLoanDetails(amount: number) {
  const tier = loanTiers.find(t => amount >= t.minValue && amount <= t.maxValue) || loanTiers[0];

  const monthlyInterestRate = tier.interestRate / 100;
  const principal = amount;
  const months = tier.termMonths;

  const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
    (Math.pow(1 + monthlyInterestRate, months) - 1);

  return {
    monthlyPayment: Math.round(monthlyPayment),
    interestRate: tier.interestRate,
    registrationFee: tier.registrationFee,
    termMonths: tier.termMonths,
  };
}

export default function LoanSimulator() {
  const [loanAmount, setLoanAmount] = useState(20000);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const details = getLoanDetails(loanAmount);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value));
  };

  const handleSolicitar = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/solicitar');
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-MZ');
  };

  const sliderPercentage = ((loanAmount - 5000) / (200000 - 5000)) * 100;

  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <span className="bg-orange-100 text-orange-500 text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wide inline-flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            SIMULAÇÃO AUTOMÁTICA
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
          Veja quanto você paga por mês
        </h2>

        <p className="text-gray-600 text-center text-lg mb-16">
          Selecione o valor desejado e veja imediatamente as condições do seu empréstimo
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-12">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 text-sm">5.000 MT</span>
              <span className="text-4xl md:text-5xl font-bold text-orange-500">
                {formatCurrency(loanAmount)} MT
              </span>
              <span className="text-gray-600 text-sm">200.000 MT</span>
            </div>

            <div className="relative">
              <input
                type="range"
                min="5000"
                max="200000"
                step="1000"
                value={loanAmount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`
                }}
              />
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              Arraste para selecionar o valor desejado
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{details.termMonths}</div>
              <div className="text-gray-600 text-sm">meses de prazo</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Percent className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{details.interestRate}%</div>
              <div className="text-gray-600 text-sm">juros mensais</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 text-center border-2 border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ~{formatCurrency(details.monthlyPayment)} MT
              </div>
              <div className="text-gray-700 text-sm font-medium">parcela estimada/mês</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(details.registrationFee)} MT
              </div>
              <div className="text-gray-600 text-sm">taxa de inscrição</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 mb-8 border border-orange-100">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Dica:</span> Na Moz Txeneca, quanto maior o valor solicitado,
                menores são os juros aplicados.
              </p>
            </div>
          </div>

          <button
            onClick={handleSolicitar}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold text-lg px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Solicitar Este Valor
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs mt-6">
            Valores estimados. As condições finais são confirmadas após inscrição e análise dos dados.
          </p>
        </div>
      </div>
    </section>
  );
}

function Calculator(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function ArrowRight(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

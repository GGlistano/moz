import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

const API_CONFIG = {
  url: "https://ejfdfllxdbkkhxrmmhkw.supabase.co/functions/v1/create-ticket",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZmRmbGx4ZGJra2h4cm1taGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzMzNDUsImV4cCI6MjA4NDQwOTM0NX0.ffnuENnSmSL-0o_l6EWYqBS0jm-UAq4P8wPPwUTEpXo",
  funnelSlug: "emprestimo",
  chatBaseUrl: "https://whatsapp-lead-funnel-lst8.bolt.host"
};

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

function getLoanDetails(amountStr: string) {
  const amount = parseInt(amountStr.replace(/[^\d]/g, '')) || 0;
  if (amount === 0) return null;

  const tier = loanTiers.find(t => amount >= t.minValue && amount <= t.maxValue) || loanTiers[0];

  const monthlyInterestRate = tier.interestRate / 100;
  const principal = amount;
  const months = tier.termMonths;

  const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
    (Math.pow(1 + monthlyInterestRate, months) - 1);

  return {
    amount,
    monthlyPayment: Math.round(monthlyPayment),
    interestRate: tier.interestRate,
    registrationFee: tier.registrationFee,
    termMonths: tier.termMonths,
  };
}

export default function LoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    province: '',
    neighborhood: '',
    block: '',
    houseNumber: '',
    workSector: '',
    loanAmount: '',
    monthlyIncome: '',
  });

  const provinces = [
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa'
  ];

  const workSectors = [
    'Funcionário Público',
    'Sector Privado',
    'Conta Própria',
    'Agricultura',
    'Comércio',
    'Construção',
    'Educação',
    'Finanças',
    'Saúde',
    'Serviços',
    'Tecnologia',
    'Transporte',
    'Turismo',
    'Outro'
  ];

  const loanAmounts = Array.from({ length: 40 }, (_, i) => {
    const amount = (i + 1) * 5000;
    return `${amount.toLocaleString('pt-MZ')} MT`;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 6) {
      newErrors.password = 'A palavra-passe deve ter no mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As palavras-passe não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCurrentStep(4);
  };

  const handleAgentContact = async () => {
    const loanDetails = getLoanDetails(formData.loanAmount);
    if (!loanDetails) return;

    setIsSubmitting(true);
    setApiError('');

    const dadosDoLead = {
      nome: formData.fullName,
      contacto: formData.phoneNumber,
      provincia: formData.province,
      bairro: formData.neighborhood,
      quarteirao: formData.block,
      numero_casa: formData.houseNumber,
      sector_trabalho: formData.workSector,
      valor_solicitado: `${loanDetails.amount.toLocaleString('pt-MZ')} MT`,
      taxa_inscricao: `${loanDetails.registrationFee.toLocaleString('pt-MZ')} MT`,
      juros_mensais: `${loanDetails.interestRate}%`,
      prazo: `${loanDetails.termMonths} meses`,
      parcela_estimada: `~${loanDetails.monthlyPayment.toLocaleString('pt-MZ')} MT/mês`,
      forma_pagamento: 'Mensal',
    };

    // Ler dados de tracking do localStorage
    let trackingData = {};
    try {
      const storedAttribution = localStorage.getItem('leadAttribution');
      if (storedAttribution) {
        trackingData = JSON.parse(storedAttribution);
        console.log('📊 Dados de tracking encontrados:', trackingData);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao ler dados de tracking:', error);
    }

    const requestBody = {
      funnel_slug: API_CONFIG.funnelSlug,
      lead_data: dadosDoLead,
      expiration_hours: 24,
      ...trackingData
    };

    console.log('📤 Enviando dados para API:', requestBody);

    try {
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'apikey': API_CONFIG.key
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const resultado = await response.json();

      console.log('✅ Resposta completa da API:', resultado);

      if (resultado.success && resultado.ticket_code) {
        // Construir a URL do chat localmente
        const chatUrl = `${API_CONFIG.chatBaseUrl}/chat/${API_CONFIG.funnelSlug}?ticket=${resultado.ticket_code}`;
        console.log('🔗 Redirecionando para:', chatUrl);
        console.log('🎫 Ticket:', resultado.ticket_code);
        console.log('⏰ Expira em:', resultado.expires_at);
        window.location.href = chatUrl;
      } else {
        const mensagemErro = resultado.error || 'Resposta da API não contém ticket_code válido';
        console.error('❌ Erro na resposta:', mensagemErro);
        setApiError(mensagemErro);
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('❌ Erro ao conectar com API:', error);
      const mensagemErro = error instanceof Error
        ? error.message
        : 'Erro desconhecido ao conectar com o sistema';
      setApiError(`Erro: ${mensagemErro}. Verifique sua internet e tente novamente.`);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-900 font-semibold text-xl">Moz</span>
                <span className="text-orange-500 font-semibold text-xl">Txeneca</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/#inicio" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Início
              </Link>
              <Link to="/#como-funciona" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Como Funciona
              </Link>
              <Link to="/#vantagens" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Vantagens
              </Link>
              <Link to="/#faq" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                FAQ
              </Link>
              <Link to="/solicitar" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
                Solicitar Empréstimo
              </Link>
              <Link to="/#area-cliente" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Área do Cliente
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Time Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-orange-100 text-orange-500 text-sm font-medium px-5 py-2 rounded-full inline-flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Leva menos de 2 minutos
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Formulário de Solicitação
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Preencha corretamente. O número informado será utilizado para contato, validação e recebimento do empréstimo.
        </p>

        {/* Step Indicators */}
        {currentStep < 4 && (
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                currentStep > 1
                  ? 'bg-green-500 text-white'
                  : currentStep === 1
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check className="w-6 h-6" /> : '1'}
              </div>
            </div>
            <div className={`w-16 h-1 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                currentStep === 2
                  ? 'bg-orange-500 text-white'
                  : currentStep > 2
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 2 ? <Check className="w-6 h-6" /> : '2'}
              </div>
            </div>
            <div className={`w-16 h-1 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                currentStep === 3
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          {currentStep === 1 && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados de Acesso</h2>
                <p className="text-gray-600 text-sm">Crie sua conta para continuar</p>
              </div>

              <form onSubmit={handleStep1Continue} className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Número de Telefone (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contacto"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+258 84 123 4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="text-red-500">📌</span>
                    Mesmo número usado para pagamento da taxa
                  </p>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Palavra-passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Confirmar Palavra-passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme sua palavra-passe"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg"
                >
                  Continuar
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Preencha todos os campos para continuar
                </p>
              </form>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Pessoais</h2>
                <p className="text-gray-600 text-sm">Dados de moradia e trabalho</p>
              </div>

              <form onSubmit={handleStep2Continue} className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Província <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="provincia"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Selecione a província</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Nome do bairro"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Quarteirão <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="quarteirao"
                      name="block"
                      value={formData.block}
                      onChange={handleInputChange}
                      placeholder="Nº"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Nº Casa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="numero_casa"
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleInputChange}
                      placeholder="Nº"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Sector de Trabalho <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sector_trabalho"
                    name="workSector"
                    value={formData.workSector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Selecione o sector</option>
                    {workSectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold text-lg py-4 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg"
                  >
                    Continuar
                  </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Preencha todos os campos para continuar
                </p>
              </form>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Valor do Empréstimo</h2>
                <p className="text-gray-600 text-sm">Selecione o valor e informe sua renda mensal</p>
              </div>

              <form onSubmit={handleStep3Submit} className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Valor do Empréstimo <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="valor_solicitado"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Selecione o valor</option>
                    {loanAmounts.map((amount) => (
                      <option key={amount} value={amount}>
                        {amount}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.loanAmount && getLoanDetails(formData.loanAmount) && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b border-orange-200">
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-orange-700 text-sm">
                        <span className="font-semibold">Na Moz Txeneca</span>, quanto maior o valor solicitado,
                        menores são os juros.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-xs mb-1">Valor Solicitado</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {getLoanDetails(formData.loanAmount)!.amount.toLocaleString('pt-MZ')} MT
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs mb-1">Prazo</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {getLoanDetails(formData.loanAmount)!.termMonths} meses
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs mb-1">Juros Mensais</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {getLoanDetails(formData.loanAmount)!.interestRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs mb-1">Parcela Estimada</p>
                        <p className="text-gray-900 font-bold text-lg">
                          ~{getLoanDetails(formData.loanAmount)!.monthlyPayment.toLocaleString('pt-MZ')} MT/mês
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-orange-200">
                      <p className="text-gray-600 text-xs mb-1">Taxa de Inscrição</p>
                      <p className="text-orange-600 font-bold text-2xl">
                        {getLoanDetails(formData.loanAmount)!.registrationFee.toLocaleString('pt-MZ')} MT
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-900 font-medium mb-4">
                    Renda Mensal Atual <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, monthlyIncome: '5000-10000' }))}
                      className={`p-6 rounded-xl border-2 transition-all font-semibold text-center ${
                        formData.monthlyIncome === '5000-10000'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
                      }`}
                    >
                      <div className="text-lg">5.000 MT</div>
                      <div className="text-sm opacity-90">a 10.000 MT</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, monthlyIncome: '10000-50000' }))}
                      className={`p-6 rounded-xl border-2 transition-all font-semibold text-center ${
                        formData.monthlyIncome === '10000-50000'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
                      }`}
                    >
                      <div className="text-lg">10.000 MT</div>
                      <div className="text-sm opacity-90">a 50.000 MT</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, monthlyIncome: '50000-100000' }))}
                      className={`p-6 rounded-xl border-2 transition-all font-semibold text-center ${
                        formData.monthlyIncome === '50000-100000'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
                      }`}
                    >
                      <div className="text-lg">50.000 MT</div>
                      <div className="text-sm opacity-90">a 100.000 MT</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, monthlyIncome: '100000+' }))}
                      className={`p-6 rounded-xl border-2 transition-all font-semibold text-center ${
                        formData.monthlyIncome === '100000+'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
                      }`}
                    >
                      <div className="text-lg">Mais de</div>
                      <div className="text-sm opacity-90">100.000 MT</div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold text-lg py-4 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-lg"
                  >
                    VER RESUMO E FALAR COM AGENTE
                  </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Preencha todos os campos para continuar
                </p>
              </form>
            </>
          )}

          {currentStep === 4 && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>

              {/* Success Banner */}
              <div className="bg-orange-500 rounded-2xl p-8 text-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Seu pedido está pronto para análise
                </h2>
                <p className="text-orange-100">
                  Revise seus dados e fale com um agente
                </p>
              </div>

              <div className="space-y-6">
                {/* Dados de Contacto */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-orange-500 text-sm">👤</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Dados de Contacto</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-gray-600 text-xs">Nome Completo</p>
                      <p className="text-gray-900 font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Telefone (WhatsApp)</p>
                      <p className="text-gray-900 font-medium">{formData.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Morada */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-orange-500 text-sm">📍</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Morada</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-xs">Província</p>
                        <p className="text-gray-900 font-medium">{formData.province}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Bairro</p>
                        <p className="text-gray-900 font-medium">{formData.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Quarteirão</p>
                        <p className="text-gray-900 font-medium">{formData.block}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Nº Casa</p>
                        <p className="text-gray-900 font-medium">{formData.houseNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Empréstimo */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-orange-500 text-sm">📋</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Detalhes do Empréstimo</h3>
                  </div>
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                    <div className="text-center mb-4 pb-4 border-b border-orange-200">
                      <p className="text-gray-600 text-sm mb-1">Valor Solicitado</p>
                      <p className="text-orange-600 font-bold text-3xl">
                        {getLoanDetails(formData.loanAmount)?.amount.toLocaleString('pt-MZ')} MT
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-xs">Prazo</p>
                        <p className="text-gray-900 font-bold">{getLoanDetails(formData.loanAmount)?.termMonths} meses</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Juros</p>
                        <p className="text-gray-900 font-bold">{getLoanDetails(formData.loanAmount)?.interestRate}%/mês</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Parcela Estimada</p>
                        <p className="text-gray-900 font-bold">~{getLoanDetails(formData.loanAmount)?.monthlyPayment.toLocaleString('pt-MZ')} MT/mês</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Taxa de Inscrição</p>
                        <p className="text-orange-600 font-bold">{getLoanDetails(formData.loanAmount)?.registrationFee.toLocaleString('pt-MZ')} MT</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Próximos Passos */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-orange-500 text-lg">⚠️</span>
                    <h3 className="font-bold text-orange-900">Próximos passos</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">📌</span>
                      <span>O agente irá orientar o pagamento da taxa de inscrição</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">📌</span>
                      <span>O pagamento deve ser feito com o mesmo número informado</span>
                    </li>
                  </ul>
                </div>

                {/* Error Message */}
                {apiError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{apiError}</p>
                  </div>
                )}

                {/* Agent Contact Button */}
                <button
                  onClick={handleAgentContact}
                  disabled={isSubmitting}
                  className={`w-full font-bold text-lg py-4 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      CONECTANDO AO CHAT...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      FALAR COM UM AGENTE
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

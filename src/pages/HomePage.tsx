import { CheckCircle2, ArrowRight, Mail, MapPin, MessageSquare, FileText, Calculator, CheckCircle, Pin, Percent, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import LoanSimulator from '../components/LoanSimulator';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSolicitar = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/solicitar');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-900 font-semibold text-xl">Moz</span>
                <span className="text-orange-500 font-semibold text-xl">Txeneca</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#inicio" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
                Início
              </a>
              <a href="#como-funciona" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Como Funciona
              </a>
              <a href="#vantagens" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Vantagens
              </a>
              <a href="#faq" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                FAQ
              </a>
              <Link to="/solicitar" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Solicitar Empréstimo
              </Link>
              <a href="#area-cliente" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Área do Cliente
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8" id="inicio">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Dinheiro rápido com</span>
            <br />
            <span className="text-orange-500">parcelas acessíveis.</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Solicite seu empréstimo de 5.000 a 200.000 MT, com simulação
            automática, prazos flexíveis e atendimento direto via WhatsApp.
          </p>

          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <span className="text-gray-800 text-lg">Solicitação 100% online</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <span className="text-gray-800 text-lg">Parcelas mensais ajustadas ao valor</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <span className="text-gray-800 text-lg">Processo simples e organizado</span>
            </div>
          </div>

          <button
            onClick={handleSolicitar}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold text-lg px-8 py-4 rounded-lg inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                SOLICITAR EMPRÉSTIMO AGORA
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Success Cases Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 px-8">
            <h2 className="text-center text-gray-600 text-sm font-medium tracking-wider uppercase mb-16">
              CASOS DE SUCESSO
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">1.300+</div>
                <div className="text-gray-600">Solicitações recebidas</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">11</div>
                <div className="text-gray-600">Províncias atendidas</div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600">Atendimento WhatsApp</div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Todos os pedidos passam por inscrição e análise.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Veja o que nossos clientes dizem
          </h3>
          <p className="text-gray-600 text-center text-lg mb-12">
            Depoimentos reais de quem já conquistou seus objetivos com a Moz Txeneca
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                <iframe
                  src="https://player.vimeo.com/video/1149738212?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Depoimento 1"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                <iframe
                  src="https://player.vimeo.com/video/1149738310?badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="Depoimento 2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8" id="como-funciona">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <span className="bg-orange-100 text-orange-500 text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wide">
              PROCESSO SIMPLES
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Aqui o processo é claro desde o início
          </h2>

          <p className="text-gray-600 text-center text-lg mb-16 max-w-3xl mx-auto">
            Na Moz Txeneca, qualquer pessoa pode solicitar um empréstimo em 4 passos simples
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Preencha o formulário
              </h3>
              <p className="text-gray-600">
                Dados pessoais e de contacto
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Selecione o valor
              </h3>
              <p className="text-gray-600">
                De 5.000 MT a 200.000 MT
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Veja as condições
              </h3>
              <p className="text-gray-600">
                Parcelas, juros e taxa automáticos
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fale com um agente
              </h3>
              <p className="text-gray-600">
                Damos seguimento via WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Pin className="w-4 h-4 text-orange-500" />
            <p>O número informado será utilizado para contato e validação do pedido.</p>
          </div>
        </div>
      </section>

      {/* Loan Simulator Section */}
      <LoanSimulator />

      {/* CTA Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 md:p-16 text-center shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para realizar seus sonhos?
            </h2>
            <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-95">
              Solicite agora seu empréstimo e dê o primeiro passo para alcançar seus objetivos financeiros.
            </p>
            <button
              onClick={handleSolicitar}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-orange-600 font-bold text-lg px-10 py-4 rounded-xl inline-flex items-center gap-2 transition-all shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Solicitar Empréstimo
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Interest Rates Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8" id="vantagens">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <span className="bg-orange-100 text-orange-500 text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wide inline-flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              JUROS DECRESCENTES
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Quanto maior o valor, menos juros você paga
          </h2>

          <p className="text-gray-600 text-center text-lg mb-16">
            Oferecemos taxas acessíveis e competitivas para todos os valores
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Percent className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-orange-500 mb-3">2,5%</div>
              <div className="text-gray-600 text-sm mb-4">ao mês</div>
              <div className="text-gray-700 font-medium text-sm">Até 20.000 MT</div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Percent className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-orange-500 mb-3">2,0%</div>
              <div className="text-gray-600 text-sm mb-4">ao mês</div>
              <div className="text-gray-700 font-medium text-sm">21.000 a 50.000 MT</div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Percent className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-orange-500 mb-3">1,5%</div>
              <div className="text-gray-600 text-sm mb-4">ao mês</div>
              <div className="text-gray-700 font-medium text-sm">51.000 a 100.000 MT</div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Percent className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-orange-500 mb-3">1,2%</div>
              <div className="text-gray-600 text-sm mb-4">ao mês</div>
              <div className="text-gray-700 font-medium text-sm">101.000 a 200.000 MT</div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Taxas válidas para empréstimos com pagamento regular
          </p>
        </div>
      </section>

      {/* Registration Fee Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Taxa única de inscrição
          </h2>

          <p className="text-gray-600 text-center text-lg mb-12">
            A taxa é necessária para ativação e análise do pedido
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
              <div className="px-8 py-4 font-bold text-gray-900 text-left">Valor Solicitado</div>
              <div className="px-8 py-4 font-bold text-gray-900 text-right">Taxa de Inscrição</div>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="px-8 py-6 text-gray-700">5.000 – 20.000 MT</div>
              <div className="px-8 py-6 text-right font-bold text-gray-900">497 MT</div>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="px-8 py-6 text-gray-700">21.000 – 50.000 MT</div>
              <div className="px-8 py-6 text-right font-bold text-gray-900">497 MT</div>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="px-8 py-6 text-gray-700">51.000 – 100.000 MT</div>
              <div className="px-8 py-6 text-right font-bold text-gray-900">497 MT</div>
            </div>

            <div className="grid grid-cols-2 hover:bg-gray-50 transition-colors">
              <div className="px-8 py-6 text-gray-700">101.000 – 200.000 MT</div>
              <div className="px-8 py-6 text-right font-bold text-gray-900">497 MT</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 mt-8 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Importante</h3>
                <p className="text-gray-700 text-sm">
                  O pagamento da taxa deve ser realizado com o <span className="font-semibold">mesmo número</span> informado no formulário para validação do pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}

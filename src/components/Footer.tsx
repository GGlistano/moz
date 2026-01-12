import { Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="bg-gray-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-yellow-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm text-center">
              <span className="font-bold">AVISO IMPORTANTE:</span> A solicitação do empréstimo não garante
              liberação automática. As condições finais dependem da inscrição e análise dos dados enviados.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-semibold text-xl">Moz</span>
                <span className="text-orange-500 font-semibold text-xl">Txeneca</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empréstimos rápidos com parcelas acessíveis para realizar seus objetivos.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contactos</h3>
            <div className="space-y-3">
              <a
                href="tel:+258856576690"
                className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+258 85 657 6690</span>
              </a>
              <a
                href="mailto:info@moztxeneca.co.mz"
                className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@moztxeneca.co.mz</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Localização</h3>
            <div className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
              <span>Maputo, Moçambique</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Moz Txeneca. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

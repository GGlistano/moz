import { useState } from 'react';
import { ChevronDown, HelpCircle, AlertTriangle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Quem pode solicitar um empréstimo na Moz Txeneca?',
    answer: 'Qualquer pessoa maior de idade, residente em Moçambique, pode solicitar um empréstimo. Trabalhadores formais e informais podem se inscrever normalmente. A liberação depende da inscrição e da análise dos dados enviados.',
  },
  {
    question: 'Quais valores posso solicitar?',
    answer: 'Você pode solicitar valores entre 5.000 MT e 200.000 MT. As condições de juros, parcelas e prazos são ajustadas automaticamente conforme o valor selecionado.',
  },
  {
    question: 'Como funcionam as parcelas mensais?',
    answer: 'As parcelas são calculadas automaticamente no momento da simulação, com base em: Valor solicitado, Prazo de pagamento e Juros aplicados. As parcelas exibidas no site são estimativas.',
  },
  {
    question: 'Quais são os prazos de pagamento disponíveis?',
    answer: 'Os prazos variam conforme o valor solicitado: 5.000 – 20.000 MT → até 12 meses | 21.000 – 50.000 MT → até 18 meses | 51.000 – 100.000 MT → até 24 meses | 101.000 – 200.000 MT → até 30 meses',
  },
  {
    question: 'Por que preciso pagar uma taxa de inscrição?',
    answer: 'O pagamento da taxa serve para validar o número informado, confirmar a identidade do solicitante e ativar o pedido para análise prioritária. O pagamento deve ser feito com o mesmo número que irá receber o empréstimo, garantindo que o pedido é real e pertence ao solicitante. Pedidos pagos com números diferentes não são validados.',
  },
  {
    question: 'Qual é a diferença entre quem paga a taxa e quem não paga?',
    answer: 'Quem não paga a taxa: Fica apenas na etapa inicial, não tem o pedido ativado e não avança no processo. Quem paga a taxa: Comprova que o número a receber o empréstimo é credível, tem o pedido validado, entra em análise prioritária, avança para as etapas finais e recebe acompanhamento direto de um agente. O pagamento da taxa é o que permite que o pedido siga adiante.',
  },
  {
    question: 'O pagamento da taxa garante que vou receber o empréstimo?',
    answer: 'O pagamento da taxa não garante liberação automática, mas é obrigatório para que o pedido seja validado, analisado e tenha seguimento. Em resumo: Sem taxa = Número a receber o Empréstimo não confirmado | Com taxa = Número a receber o Empréstimo confirmado e pedido ativo e avançando.',
  },
  {
    question: 'Por que o pagamento da taxa deve ser feito com o mesmo número informado no formulário?',
    answer: 'Porque o número informado é utilizado para: Validação do pedido, Contato com o agente e Recebimento do valor, em caso de liberação. Pagamentos feitos com números diferentes invalidam o pedido.',
  },
  {
    question: 'Depois de pagar a taxa, o que acontece?',
    answer: 'Após o pagamento da taxa: 1️⃣ O pedido é validado | 2️⃣ O número a receber o Empréstimo é validado | 3️⃣ Os dados entram em análise prioritária | 4️⃣ Um agente acompanha o processo | 5️⃣ O pedido segue para a etapa final. O cliente é informado pelo WhatsApp sobre o andamento.',
  },
  {
    question: 'Preciso enviar documentos?',
    answer: 'Sim. É obrigatório o envio do BI frente e verso para validação dos dados. Pedidos com documentação incompleta não avançam.',
  },
  {
    question: 'Quanto tempo demora o processo?',
    answer: 'Após a inscrição e o pagamento da taxa, o pedido entra em análise. O tempo pode variar conforme a validação das informações, mas o atendimento é feito via WhatsApp para dar seguimento ao processo.',
  },
  {
    question: 'Como recebo o dinheiro, caso seja liberado?',
    answer: 'O valor é enviado para o mesmo número informado no formulário, utilizado durante todo o processo de validação.',
  },
  {
    question: 'Posso falar com um agente antes de concluir o pedido?',
    answer: 'Sim. Após revisar as informações, você poderá falar diretamente com um agente via WhatsApp para tirar dúvidas e dar seguimento ao processo.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const formatAnswer = (answer: string) => {
    return answer.split('|').map((part, index) => (
      <span key={index}>
        {part.trim()}
        {index < answer.split('|').length - 1 && <><br /><br /></>}
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-900 text-base pr-4">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && item.answer && (
        <div className="px-6 pb-5 pt-2">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{formatAnswer(item.answer)}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <span className="bg-orange-100 text-orange-500 text-sm font-bold px-6 py-2 rounded-full uppercase tracking-wide inline-flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            TIRE SUAS DÚVIDAS
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
          Perguntas Frequentes
        </h2>

        <p className="text-gray-600 text-center text-lg mb-16">
          Encontre respostas para as dúvidas mais comuns sobre o processo de empréstimo
        </p>

        <div className="space-y-3 mb-12">
          {faqItems.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Aviso Importante</h3>
              <p className="text-gray-700 text-sm">
                A solicitação do empréstimo não garante liberação automática. As condições finais dependem da
                inscrição, validação e análise dos dados enviados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

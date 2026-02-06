# Scripts de Rastreamento UTM Cross-Domain

Estes scripts permitem rastrear parâmetros UTM entre dois domínios diferentes.

## Estrutura

- `capture-utm.js` - Coloque no **primeiro domínio** (origem dos leads)
- `read-utm.js` - Coloque no **segundo domínio** (onde o formulário/chat estão)

## Instruções de Implementação

### 1. No Primeiro Domínio (Origem)

Adicione este código no `<head>` ou antes do `</body>`:

```html
<script src="path/para/capture-utm.js"></script>
```

**O que faz:**
- Captura todos os parâmetros UTM da URL atual
- Captura a referência (document.referrer)
- Armazena na sessão
- Redireciona para o segundo domínio com os UTMs na URL

### 2. No Segundo Domínio (Destino)

Adicione este código no `<head>` ou antes do `</body>`:

```html
<script src="path/para/read-utm.js"></script>
```

**O que faz:**
- Captura os parâmetros UTM da URL
- Salva automaticamente no `localStorage`
- O chat/formulário pode acessar via `localStorage.getItem('leadAttribution')`

## Exemplo de localStorage

Depois de implementar, o chat terá acesso a:

```javascript
// Acessar no chat/edge function
const attribution = JSON.parse(localStorage.getItem('leadAttribution') || '{}');

console.log(attribution);
// {
//   utm_source: "google",
//   utm_medium: "cpc",
//   utm_campaign: "summer-sale",
//   utm_content: "banner",
//   utm_term: "loan",
//   referrer: "https://...",
//   timestamp: 1707184680000
// }
```

## Parâmetros Capturados

- `utm_source` - Origem do tráfego
- `utm_medium` - Meio (cpc, organic, social, etc)
- `utm_campaign` - Campanha
- `utm_content` - Variação criativa
- `utm_term` - Palavra-chave
- `referrer` - Página que originou o clique
- `timestamp` - Data/hora do acesso

## Integração com o Chat

No seu código do chat (edge function ou frontend), faça:

```javascript
const attribution = JSON.parse(localStorage.getItem('leadAttribution') || '{}');

// Enviar para Supabase com os dados do lead
await supabase
  .from('leads')
  .insert({
    ...otherData,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    // ... outros campos
  });
```

## URLs de Exemplo

**Primeiro domínio:**
```
https://seu-site-origem.com?utm_source=google&utm_medium=cpc&utm_campaign=summer-sale
```

**Segundo domínio (para onde redireciona automaticamente):**
```
https://seu-site-destino.com?utm_source=google&utm_medium=cpc&utm_campaign=summer-sale
```

## Customização

### Alterar o domínio de destino

Edite `capture-utm.js` na linha onde está `window.location.href`:

```javascript
// Mude "seu-site-destino.com" para seu domínio
window.location.href = `https://seu-site-destino.com?${params}`;
```

### Alterar a chave no localStorage

Edite `read-utm.js` na linha onde está `leadAttribution`:

```javascript
// Mude para a chave que preferir
localStorage.setItem('minhaChavePersonalizada', JSON.stringify(attribution));
```

## Troubleshooting

**UTMs não aparecem no segundo domínio:**
- Verifique se o script está carregando (abra DevTools > Console)
- Confirme que os parâmetros estão na URL
- Verifique se não há bloqueadores de cookies/localStorage

**localStorage está vazio:**
- Abra DevTools > Application > LocalStorage
- Procure pela chave `leadAttribution`
- Se não existir, o script do primeiro domínio pode não ter executado

**Chat não consegue ler o valor:**
- Use `console.log(localStorage.getItem('leadAttribution'))` no console
- Confirme que está no mesmo domínio do script `read-utm.js`

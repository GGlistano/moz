# Deploy para GitHub Pages

## Configuração Inicial

### 1. Criar Repositório no GitHub
1. Vá para [GitHub](https://github.com) e crie um novo repositório
2. **NÃO** inicialize com README, .gitignore ou license

### 2. Fazer Push do Código

```bash
# Inicializar repositório local (se ainda não foi feito)
git init

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit"

# Fazer push
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Acesse seu repositório no GitHub
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source** (Fonte), selecione:
   - Source: **GitHub Actions**
5. Salve as configurações

### 4. Configurar Domínio Customizado (Cloudflare)

1. No Cloudflare, crie um registro CNAME:
   - **Type**: CNAME
   - **Name**: site (ou o subdomínio que você quer)
   - **Target**: SEU_USUARIO.github.io
   - **Proxy status**: Proxied (laranja)

2. No GitHub Pages (Settings > Pages):
   - Em **Custom domain**, digite: `site.moztxeneca.online`
   - Marque a opção **Enforce HTTPS**

**Nota**: O CNAME já está configurado no projeto (`public/CNAME`), então o domínio será aplicado automaticamente no deploy.

### 5. Deploy Automático

Toda vez que você fizer push para a branch `main`, o GitHub Actions vai:
1. Instalar as dependências
2. Fazer o build do projeto
3. Fazer o deploy no GitHub Pages

### 6. Variáveis de Ambiente

As variáveis de ambiente do Supabase já estão configuradas no arquivo `.env`.

**IMPORTANTE**: Para produção, você deve configurar as variáveis de ambiente no GitHub:

1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Clique em **New repository secret**
3. Adicione as seguintes secrets:
   - `VITE_SUPABASE_URL`: Sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase

Depois, atualize o workflow em `.github/workflows/deploy.yml` para usar essas secrets:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## Verificar Deploy

Após o push, você pode verificar o progresso do deploy:

1. Vá na aba **Actions** do seu repositório
2. Clique no workflow mais recente
3. Acompanhe o progresso do build e deploy

O site estará disponível em: `https://site.moztxeneca.online`

## Comandos Úteis

```bash
# Fazer build local para testar
npm run build

# Testar o build localmente
npm run preview
```

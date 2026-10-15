# TERA — Frontend

Frontend do sistema TERA: site institucional (Home, Sobre, Newsletter, Contato) + dashboard administrativo (login, gestão de clientes e colaboradores, recuperação de senha).

## Stack

- React 19 + TypeScript
- Vite
- react-router-dom
- axios
- lucide-react (ícones)

## Pré-requisitos

- Node.js 22+
- O [backend do TERA](https://github.com/Gui-SBarbosa/BackEnd-Tera) rodando (local ou publicado), com a URL dele em mãos

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto:
   ```
   PORT=3000
   VITE_API_URL=http://localhost:3001
   ```
   - `PORT` — porta em que o servidor de desenvolvimento do Vite roda localmente.
   - `VITE_API_URL` — URL base do backend (sem barra `/` no final). Duas opções, dependendo do que você quer rodar:
     - **Backend rodando na sua máquina** (veja o [repositório do backend](https://github.com/Gui-SBarbosa/BackEnd-Tera)): `http://localhost:3001` (porta padrão configurada lá).
     - **Só o front, contra o backend já publicado**: use a URL pública do ambiente em questão (peça pra quem administra o backend).

## Rodando em desenvolvimento

```
npm run dev
```

Abre em `http://localhost:5173` (ou na porta configurada em `PORT`).

## Build de produção

```
npm run build
```

Gera os arquivos estáticos finais em `dist/`. Roda `tsc -b` antes (checagem de tipos) — se houver erro de tipo, o build para ali antes de chamar o `vite build`.

Para conferir o resultado do build localmente sem subir em lugar nenhum:
```
npm run preview
```

## Rodando com Docker

O projeto já tem um `Dockerfile` (multi-stage: build com Node + serve com nginx) e `nginx.conf` configurado para rotas de SPA (React Router).

**Importante:** `VITE_API_URL` é "cozido" no código durante o build (o Vite substitui essa variável pelo valor real nesse momento) — por isso ela precisa ser passada como `--build-arg`, não como variável de ambiente do container em tempo de execução.

```
docker build --build-arg VITE_API_URL=http://localhost:3001 -t tera-front .
docker run -p 8080:80 tera-front
```

Acessa em `http://localhost:8080`.

## Estrutura de rotas

| Rota | Página | Observação |
|---|---|---|
| `/` | Home | Site público |
| `/sobre` | Sobre | Site público |
| `/newsletter` | Newsletter | Site público |
| `/contato` | Contato | Site público |
| `/auth` | Login | |
| `/forgot-password` | Esqueci minha senha | Solicita o email de recuperação |
| `/reset-password?token=...` | Redefinir senha | Link recebido por email; valida o token antes de mostrar o formulário |
| `/dashboard` | Dashboard | Requer login; aba "Colaboradores" visível somente para usuários `ADMIN` |

## Testes

Testes de unidade e de componente com Jest + React Testing Library. Cobrem os fluxos principais: Login, Esqueci senha, Redefinir senha, Clientes, Colaboradores, ContactForm e os formatadores de CPF/CNPJ/telefone.

```
npm test             # roda a suíte uma vez
npm run test:watch   # modo observador, re-roda ao salvar
npm run test:coverage # roda com relatório de cobertura
```

A API é sempre simulada (`fetch`/`axios` mockados) — os testes nunca dependem do backend real nem de rede.

## Qualidade (checagens antes de commitar/abrir PR)

```
npm run lint        # padrões de código
npm run typecheck   # checagem de tipos TypeScript
npm test             # testes
npm run build        # build de produção
```

# Lista de Compras

> **Proof of Concept** — Projeto experimental de lista de compras com entrada por voz via Web Speech API (Google Speech-to-Text). Desenvolvido como avaliação da ferramenta [Claude Code](https://claude.ai/code) e para uso pessoal.

## Visão Geral

Aplicação web full-stack para gerenciamento de listas de compras, com suporte a controle de orçamento e entrada de dados por reconhecimento de voz.

## Funcionalidades

- Criação e gerenciamento de múltiplas listas de compras
- Adição de itens com nome, quantidade e preço
- Reconhecimento de voz para nome e preço dos produtos
- Controle de orçamento por lista com alertas visuais (80% / 100%)
- Persistência local (SQLite) e em nuvem (Turso)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Banco de dados | SQLite (dev) / Turso (produção) |
| ORM | Drizzle ORM |
| UI | Tailwind CSS + shadcn/ui |
| Estado | TanStack Query |
| Voz | Web Speech API (nativa) |

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Aplicar migrações do banco
npm run db:migrate

# Abrir visualizador do banco
npm run db:studio
```

## Variáveis de Ambiente

Para produção com Turso, configure:

```env
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
```

Em desenvolvimento, um arquivo `shopping.db` local é criado automaticamente.

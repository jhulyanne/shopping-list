# Lista de Compras

> **Proof of Concept** — Projeto experimental de lista de compras com entrada por voz via Web Speech API (Google Speech-to-Text). Desenvolvido como avaliação da ferramenta [Claude Code](https://claude.ai/code) e para uso pessoal.

## Visão Geral

Aplicação web para gerenciamento de listas de compras, com suporte a controle de orçamento, entrada de dados por reconhecimento de voz e exportação em PDF. Todos os dados são salvos no `localStorage` do navegador — sem banco de dados, sem variáveis de ambiente.

## Funcionalidades

- Criação e gerenciamento de múltiplas listas de compras
- Adição de itens com nome, quantidade e preço
- Reconhecimento de voz para nome e preço dos produtos
- Controle de orçamento por lista com alertas visuais (80% / 100%)
- Exportação de lista em PDF via impressão nativa do navegador
- Persistência automática no `localStorage` (sem servidor de banco de dados)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js (App Router) |
| Persistência | localStorage (navegador) |
| UI | Tailwind CSS + shadcn/ui |
| Estado | TanStack Query |
| Voz | Web Speech API (nativa) |

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

Nenhuma variável de ambiente necessária.

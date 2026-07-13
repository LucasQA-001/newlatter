# Reserve — Mural de Novidades em React

Conversão do HTML original para um app React com Vite.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar no GitHub Pages

Este projeto inclui um workflow em `.github/workflows/deploy-pages.yml`.

Depois de enviar para um repositório GitHub:

1. Acesse `Settings` → `Pages`.
2. Em `Build and deployment`, selecione `GitHub Actions`.
3. Faça push na branch `main`.

## Estrutura

- `src/App.jsx`: componentes, estado do painel e dados das notícias.
- `src/App.css`: estilos migrados do HTML original.
- `src/assets/cni-hero.png`: imagem extraída do base64 original.

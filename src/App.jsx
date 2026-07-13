import React, { useEffect, useRef, useState } from "react";
import cniHero from "./assets/cni-hero.png";

const ARTICLES = {
  cni: {
    id: "cni",
    tag: "NOVA FUNCIONALIDADE",
    tagTone: "gold",
    title: "Selecione o cartão certo automaticamente por Atividade",
    listTitle: "Cartão certo, na hora certa: vincule cartões por Atividade",
    summary: "Chega de procurar qual cartão usar. Veja como configurar em 3 passos.",
    date: "13 de julho de 2026",
    hero: cniHero,
    caption: "Aba Cartão Parcial, com o novo campo Atividades destacado.",
    paragraphs: [
      <>
        Agora é possível <strong>vincular cartões de crédito a Atividades</strong> específicas
        — e usar esse vínculo direto no fluxo de criação de pedidos.
      </>,
      <>
        Chega de escolher o cartão errado ou perder tempo procurando qual usar em cada projeto.
        Com o vínculo por Atividade, o Reserve já sugere o cartão certo assim que a forma de
        pagamento é selecionada.
      </>,
    ],
    stepsTitle: "Como vincular um cartão a uma Atividade",
    steps: [
      <>
        Acesse <strong>Cadastros → Cartões</strong> e abra o cartão que deseja configurar (ou crie
        um novo).
      </>,
      <>
        No campo <strong>Atividades</strong>, selecione uma ou mais atividades que devem usar esse
        cartão.
      </>,
      <>Salve as alterações.</>,
      <>
        Pronto: na próxima criação de pedido para essa Atividade, o cartão vinculado já aparece
        pré-selecionado na forma de pagamento.
      </>,
    ],
    callout:
      "💡 Um cartão pode estar vinculado a mais de uma Atividade, e cada Atividade aceita múltiplos cartões — o Reserve sempre prioriza o vínculo mais específico na hora de sugerir.",
    unread: true,
    thumb: "card",
  },
  welcome: {
    id: "welcome",
    tag: "NOVIDADE",
    title: "Chegou o Mural de Novidades do Reserve",
    listTitle: "Chegou o Mural de Novidades do Reserve",
    summary: "Um cantinho novo para acompanhar tudo o que lançamos, direto na sua Home.",
    date: "13 de julho de 2026",
    paragraphs: [
      <>A partir de agora, toda melhoria, ajuste ou novo recurso do Reserve passa por aqui antes de qualquer outro lugar.</>,
      <>
        Basta clicar no ícone de jornal no topo da tela sempre que quiser saber o que mudou — sem
        precisar sair da Home ou perguntar para o suporte.
      </>,
    ],
    callout: "📌 Itens não lidos aparecem com uma marcação dourada na lista. Fique de olho!",
    unread: false,
    thumb: "news",
    heroKind: "newspaper",
  },
};

const ARTICLE_ORDER = ["cni", "welcome"];

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const detailRef = useRef(null);

  const selectedArticle = selectedArticleId ? ARTICLES[selectedArticleId] : null;

  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0 });
  }, [selectedArticleId]);

  function openPanel() {
    setPanelOpen(true);
    setHasUnread(false);
  }

  function closePanel() {
    setPanelOpen(false);
    setSelectedArticleId(null);
  }

  function backToList() {
    setSelectedArticleId(null);
  }

  return (
    <div className="stage">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <span className="brand-name">Reserve</span>
            <span className="brand-sub">Bem-vindo, Master (Admin)</span>
          </div>
        </div>

        <div className="top-right">
          <span className="flags" aria-label="Idiomas disponíveis">
            🇬🇧🇪🇸🇵🇹
          </span>
          <span className="top-link">Suporte</span>
          <span className="top-link">Status Online</span>

          <button className="news-trigger" type="button" aria-label="Abrir mural de novidades" onClick={openPanel}>
            <MuralNewspaper variant="trigger" />
            {hasUnread && <span className="news-dot" />}
          </button>

          <span className="top-link">Menu ▾</span>
        </div>
      </header>

      <nav className="nav" aria-label="Menu principal">
        <span>⌂</span>
        <span>Pedidos</span>
        <span className="active">Gerência</span>
        <span>Cadastros</span>
        <span>Relatórios</span>
        <span>Ajuda</span>
      </nav>

      <main className="content">
        <section className="welcome">
          <div className="welcome-left">
            <div className="welcome-icon">R</div>
            <div>
              <h1>Bem-vindo, Master.</h1>
              <p>Fila de atendimento do consultor · Campinas / Viracopos, SP</p>
            </div>
          </div>
          <div className="pill-row">
            <span className="pill">✓ Ver pedidos</span>
            <span className="pill">＋ Criar uma FIRE</span>
            <span className="pill">↗ Monitor SLA</span>
          </div>
        </section>

        <div className="hint">
          <InfoIcon />
          Clique no ícone de jornal no topo da tela para ver as novidades do Reserve.
        </div>
      </main>

      <button
        className={`overlay ${panelOpen ? "open" : ""}`}
        type="button"
        aria-label="Fechar mural de novidades"
        onClick={closePanel}
      />

      <aside className={`panel ${panelOpen ? "open" : ""}`} aria-label="Mural de novidades" aria-hidden={!panelOpen}>
        <div className="panel-head">
          <button
            className={`icon-btn back-button ${selectedArticle ? "" : "is-hidden"}`}
            type="button"
            aria-label="Voltar"
            onClick={backToList}
          >
            <BackIcon />
          </button>

          <MuralNewspaper variant="panel" />

          <div className="panel-title">
            Mural de Novidades
            <small>Fique por dentro do que mudou no Reserve</small>
          </div>

          <button className="icon-btn" type="button" aria-label="Fechar" onClick={closePanel}>
            <CloseIcon />
          </button>
        </div>

        <div className={`panel-body ${selectedArticle ? "show-detail" : ""}`}>
          <div className="view list-view">
            {ARTICLE_ORDER.map((articleId) => (
              <NewsCard
                article={ARTICLES[articleId]}
                key={articleId}
                onSelect={() => setSelectedArticleId(articleId)}
              />
            ))}
          </div>

          <div className="view detail-view" ref={detailRef}>
            {selectedArticle && <ArticleDetail article={selectedArticle} />}
          </div>
        </div>
      </aside>
    </div>
  );
}

function NewsCard({ article, onSelect }) {
  return (
    <button className="news-card" type="button" onClick={onSelect}>
      <span className={`thumb ${article.thumb === "news" ? "newspaper-thumb" : ""}`}>
        {article.thumb === "card" ? <CreditCardIcon /> : <MuralNewspaper variant="card" />}
      </span>

      <span className="card-body">
        <span className={`card-tag ${article.tagTone || ""}`}>{article.tag}</span>
        <strong>{article.listTitle}</strong>
        <span>{article.summary}</span>
        <small>{article.date}</small>
      </span>

      {article.unread && <span className="unread-mark" />}
    </button>
  );
}

function ArticleDetail({ article }) {
  return (
    <>
      {article.hero && (
        <div className="detail-hero">
          <img src={article.hero} alt="" />
        </div>
      )}

      {article.heroKind === "newspaper" && (
        <div className="detail-newspaper-hero" aria-hidden="true">
          <MuralNewspaper variant="hero" />
        </div>
      )}

      <div className="detail-pad">
        <span className="detail-tag">{article.tag}</span>
        <h2>{article.title}</h2>
        <span className="detail-date">{article.date}</span>

        {article.paragraphs.map((paragraph, index) => (
          <p key={`paragraph-${index}`}>{paragraph}</p>
        ))}

        {article.steps?.length > 0 && (
          <>
            <div className="steps-title">{article.stepsTitle}</div>
            <ol className="steps">
              {article.steps.map((step, index) => (
                <li key={`step-${index}`}>
                  <span className="step-num">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {article.callout && <div className="callout">{article.callout}</div>}
        {article.caption && <p className="caption">{article.caption}</p>}
      </div>
    </>
  );
}

function MuralNewspaper({ variant = "default" }) {
  return (
    <span className={`mural-newspaper mural-newspaper-${variant}`} aria-hidden="true">
      <svg className="newspaper-icon" viewBox="0 0 96 96" fill="none">
        <path className="newspaper-shadow" d="M18 25 69 12c5-1 10 2 11 7l12 48c1 5-2 10-7 11L34 91c-5 1-10-2-11-7L11 36c-1-5 2-10 7-11Z" />
        <path className="newspaper-page" d="M16 18 67 5c5-1 10 2 11 7l12 48c1 5-2 10-7 11L32 84c-5 1-10-2-11-7L9 29c-1-5 2-10 7-11Z" />
        <path className="newspaper-edge" d="m74 18 6 25 5-1-6-25c-1-5-5-8-10-7l-4 1c4 0 8 3 9 7Z" />
        <path className="newspaper-fold" d="m70 6 8 32 8-2-6-24c-1-5-5-8-10-6Z" />
        <rect className="newspaper-main-block" x="26" y="19" width="34" height="20" rx="2" transform="rotate(-14 26 19)" />
        <path className="newspaper-ribbon" d="m38 19 12-3 3 11-5-2-4 4-3-11Z" />
        <path className="newspaper-line thick" d="m23 47 44-11" />
        <path className="newspaper-line" d="m25 56 36-9" />
        <path className="newspaper-line" d="m27 65 29-7" />
        <path className="newspaper-alert" d="m68 45 5 19" />
        <path className="newspaper-alert-dot" d="m75 70 .01 0" />
        <g className="newspaper-neural">
          <path d="M24 28 18 33l3 7 8 1 6-5-3-7-8-1Z" />
          <path d="m18 33-6-4M21 40l-4 6M35 36l6 3M32 29l4-5" />
          <circle cx="12" cy="29" r="2" />
          <circle cx="17" cy="46" r="2" />
          <circle cx="41" cy="39" r="2" />
          <circle cx="36" cy="24" r="2" />
        </g>
        <text className="newspaper-r-mark" x="61" y="29" transform="rotate(-14 61 29)">R</text>
      </svg>
    </span>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h13a3 3 0 0 1 3 3v12a1 1 0 0 1-1.6.8L17 19H6a2 2 0 0 1-2-2V4Z" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8v4M12 16h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

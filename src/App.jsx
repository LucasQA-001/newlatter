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
      <span className="newspaper-sheet">
        <span className="newspaper-fold" />
        <span className="newspaper-brand">
          <NeuralMapIcon />
          <span className="newspaper-r">R</span>
        </span>
        <span className="newspaper-title">Reserve News</span>
        <span className="newspaper-rule" />
        <span className="newspaper-lines">
          <span />
          <span />
          <span />
        </span>
      </span>
    </span>
  );
}

function NeuralMapIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M18 8 9 14v11l9 6 10-6V14L18 8Z" />
      <path d="M31 5 25 9M36 16l-8-2M34 31l-6-6M23 38l-5-7M10 31l8-11M6 21l12 10" />
      <circle cx="31" cy="5" r="3" />
      <circle cx="39" cy="17" r="3" />
      <circle cx="37" cy="33" r="3" />
      <circle cx="23" cy="41" r="3" />
      <circle cx="8" cy="32" r="3" />
      <circle cx="5" cy="20" r="3" />
    </svg>
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

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
const DEFAULT_HTML_MESSAGE = `<h2>Nova mensagem do Reserve</h2>
<p>Escreva aqui o conteúdo que vai aparecer no mural.</p>
<ul>
  <li><strong>Destaque:</strong> use HTML para formatar a mensagem.</li>
  <li>Listas, links e blocos simples são aceitos.</li>
</ul>
<div class="callout">Mensagem criada pelo editor HTML.</div>`;

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [htmlInput, setHtmlInput] = useState(DEFAULT_HTML_MESSAGE);
  const [formData, setFormData] = useState({
    tag: "NOVA FUNCIONALIDADE",
    title: "Cartão certo, na hora certa: vincule cartões por Atividade",
    summary: "Chega de procurar qual cartão usar. Veja como configurar em 3 passos.",
    date: formatDate(new Date()),
    coverImage: "",
    coverName: "",
  });
  const [customArticles, setCustomArticles] = useState([]);
  const detailRef = useRef(null);

  const htmlPreview = sanitizeHtml(htmlInput);
  const articleList = [
    ...customArticles,
    ...ARTICLE_ORDER.map((articleId) => ARTICLES[articleId]),
  ];
  const selectedArticle = selectedArticleId
    ? articleList.find((article) => article.id === selectedArticleId)
    : null;

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

  function addHtmlArticle() {
    const htmlBody = sanitizeHtml(htmlInput);

    if (!htmlBody.trim()) {
      return;
    }

    const title = formData.title.trim() || extractHtmlTitle(htmlBody) || "Mensagem criada por HTML";
    const article = {
      id: `html-${Date.now()}`,
      tag: formData.tag,
      tagTone: formData.tag === "NOVA FUNCIONALIDADE" ? "gold" : "",
      title,
      listTitle: title,
      summary: formData.summary.trim() || extractPlainText(htmlBody) || "Conteúdo personalizado inserido por HTML.",
      date: formData.date.trim() || formatDate(new Date()),
      hero: formData.coverImage,
      coverName: formData.coverName,
      htmlBody,
      unread: true,
      thumb: formData.coverImage ? "image" : "news",
      heroKind: "newspaper",
    };

    setCustomArticles((articles) => [article, ...articles]);
    setSelectedArticleId(article.id);
    setHasUnread(true);
    setPanelOpen(true);
  }

  function updateFormField(field, value) {
    setFormData((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleCoverImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((currentForm) => ({
        ...currentForm,
        coverImage: reader.result,
        coverName: file.name,
      }));
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  }

  function handleInlineImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageHtml = `<figure>
  <img src="${reader.result}" alt="${escapeHtmlAttribute(file.name)}">
  <figcaption>${escapeHtml(file.name)}</figcaption>
</figure>`;

      setHtmlInput((currentHtml) => `${currentHtml.trim()}\n\n${imageHtml}`);
      event.target.value = "";
    };

    reader.readAsDataURL(file);
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

        <section className="html-editor" aria-label="Editor HTML da mensagem">
          <div className="html-editor-input">
            <div className="section-title">
              <h2>Insert do mural</h2>
              <span>Preencha como o card e a mensagem devem aparecer</span>
            </div>
            <div className="editor-grid">
              <label>
                Tag
                <select value={formData.tag} onChange={(event) => updateFormField("tag", event.target.value)}>
                  <option>NOVA FUNCIONALIDADE</option>
                  <option>NOVIDADE</option>
                  <option>COMUNICADO</option>
                  <option>MELHORIA</option>
                </select>
              </label>
              <label>
                Data
                <input value={formData.date} onChange={(event) => updateFormField("date", event.target.value)} />
              </label>
            </div>
            <label className="field-block">
              Título da mensagem
              <input value={formData.title} onChange={(event) => updateFormField("title", event.target.value)} />
            </label>
            <label className="field-block">
              Resumo do card
              <textarea
                className="summary-input"
                value={formData.summary}
                onChange={(event) => updateFormField("summary", event.target.value)}
              />
            </label>
            <label className="cover-upload">
              <span>Imagem de capa</span>
              <strong>{formData.coverName || "Selecionar imagem da máquina"}</strong>
              <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
            </label>
            <textarea
              className="html-input"
              value={htmlInput}
              onChange={(event) => setHtmlInput(event.target.value)}
              spellCheck="false"
              aria-label="HTML da mensagem"
            />
            <div className="editor-actions">
              <label className="image-action">
                Imagem no corpo
                <input type="file" accept="image/*" onChange={handleInlineImageUpload} />
              </label>
              <button type="button" className="primary-action" onClick={addHtmlArticle}>
                Adicionar ao mural
              </button>
              <button type="button" className="secondary-action" onClick={openPanel}>
                Abrir mural
              </button>
            </div>
          </div>

          <div className="html-preview">
            <div className="preview-header">
              <MuralNewspaper variant="panel" />
              <span>Prévia</span>
            </div>
            <div className="insert-preview">
              <div className="insert-card-preview">
                <span className="thumb image-preview-thumb">
                  {formData.coverImage ? <img src={formData.coverImage} alt="" /> : <MuralNewspaper variant="card" />}
                </span>
                <span className="card-body">
                  <span className={`card-tag ${formData.tag === "NOVA FUNCIONALIDADE" ? "gold" : ""}`}>{formData.tag}</span>
                  <strong>{formData.title || "Título da mensagem"}</strong>
                  <span>{formData.summary || "Resumo do card"}</span>
                  <small>{formData.date}</small>
                </span>
              </div>
              {formData.coverImage && <img className="insert-hero-preview" src={formData.coverImage} alt="" />}
              <div className="html-message" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
            </div>
          </div>
        </section>
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
            {articleList.map((article) => (
              <NewsCard
                article={article}
                key={article.id}
                onSelect={() => setSelectedArticleId(article.id)}
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
      <span className={`thumb ${article.thumb === "news" ? "newspaper-thumb" : ""} ${article.thumb === "image" ? "image-thumb" : ""}`}>
        {article.thumb === "image" && <img src={article.hero} alt="" />}
        {article.thumb === "card" && <CreditCardIcon />}
        {article.thumb === "news" && <MuralNewspaper variant="card" />}
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
        <div className={`detail-hero ${article.htmlBody ? "full-cover" : ""}`}>
          <img src={article.hero} alt={article.coverName || ""} />
        </div>
      )}

      {article.heroKind === "newspaper" && !article.hero && (
        <div className="detail-newspaper-hero" aria-hidden="true">
          <MuralNewspaper variant="hero" />
        </div>
      )}

      <div className="detail-pad">
        <span className="detail-tag">{article.tag}</span>
        <h2>{article.title}</h2>
        <span className="detail-date">{article.date}</span>

        {article.paragraphs?.map((paragraph, index) => (
          <p key={`paragraph-${index}`}>{paragraph}</p>
        ))}

        {article.htmlBody && (
          <div className="html-message" dangerouslySetInnerHTML={{ __html: article.htmlBody }} />
        )}

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
        <g className="newspaper-tilt">
          <rect className="newspaper-shadow" x="25" y="16" width="55" height="68" rx="8" />
          <rect className="newspaper-page" x="17" y="10" width="55" height="68" rx="8" />
          <path className="newspaper-edge" d="M66 11h6c4 0 8 4 8 8v52c0 4-4 8-8 8h-6c4 0 8-4 8-8V19c0-4-4-8-8-8Z" />
          <path className="newspaper-fold" d="M58 12h9c4 0 7 3 7 7v18H58V12Z" />
          <rect className="newspaper-main-block" x="26" y="20" width="29" height="20" rx="2.5" />
          <text className="newspaper-r-mark" x="40.5" y="31.8">R</text>
          <path className="newspaper-line thick" d="M27 49h34" />
          <path className="newspaper-line" d="M27 58h30" />
          <path className="newspaper-line" d="M27 67h24" />
          <path className="newspaper-alert" d="M62 48v17" />
          <path className="newspaper-alert-dot" d="M62 71h.01" />
        </g>
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

function sanitizeHtml(html) {
  if (typeof window === "undefined" || !html) {
    return "";
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  const blockedTags = new Set(["script", "iframe", "object", "embed", "link", "meta", "style"]);
  const allowedAttributes = new Set(["href", "target", "rel", "class", "title", "src", "alt", "width", "height", "loading"]);

  template.content.querySelectorAll("*").forEach((node) => {
    if (blockedTags.has(node.tagName.toLowerCase())) {
      node.remove();
      return;
    }

    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith("on") || !allowedAttributes.has(name) || value.startsWith("javascript:")) {
        node.removeAttribute(attribute.name);
      }

      if (name === "src" && !isSafeImageSource(attribute.value)) {
        node.removeAttribute(attribute.name);
      }
    });

    if (node.tagName.toLowerCase() === "a") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noreferrer");
    }

    if (node.tagName.toLowerCase() === "img") {
      node.setAttribute("loading", "lazy");
    }
  });

  return template.innerHTML;
}

function isSafeImageSource(value) {
  const source = value.trim().toLowerCase();
  return source.startsWith("https://") || source.startsWith("http://") || source.startsWith("data:image/");
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

function escapeHtmlAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function extractHtmlTitle(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.querySelector("h1, h2, h3")?.textContent?.trim();
}

function extractPlainText(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const text = template.content.textContent?.replace(/\s+/g, " ").trim() || "";
  return text.length > 95 ? `${text.slice(0, 92)}...` : text;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

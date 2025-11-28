// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    databaseURL: "https://profissionais-364b9-default-rtdb.firebaseio.com/"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// BUSCAR DADOS
db.ref("Profissionais").once("value").then(snapshot => {
  const data = snapshot.val();

  montarHeader(data.header);
  montarCapa(data.capa);
  montarProfissionais(data.profissionais); 
  montarContatos(data.contatos);
});

// HEADER
function montarHeader(header) {
  // Logo
  document.getElementById("logo-header").src = header.logo;

  // MENU
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  header.menu.forEach(item => {
    // Se tiver submenu → cria dropdown
    if (item.submenu) {
      menu.innerHTML += `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
            ${item.nome}
          </a>

          <ul class="dropdown-menu">
            ${item.submenu
              .map(sub => `
                <li><a class="dropdown-item" href="${sub.link}">${sub.nome}</a></li>
              `)
              .join("")}
          </ul>
        </li>
      `;
    }

    // Se NÃO tiver submenu → item comum
    else {
      menu.innerHTML += `
        <li class="nav-item">
          <a class="nav-link" href="${item.link}">${item.nome}</a>
        </li>
      `;
    }
  });

  // ICONES
  const icons = document.getElementById("icons");
  icons.innerHTML = "";

  header.icones.forEach(ic => {
    icons.innerHTML += `
      <a href="${ic.link}">
        <img src="${ic.imagem}">
      </a>
    `;
  });
}


// CAPA
function montarCapa(capa) {
  document.getElementById("capa-img").src = capa.imagem;
  document.getElementById("capa-titulo").textContent = capa.titulo;
  document.getElementById("capa-subtitulo").textContent = capa.subtitulo;
}

// CARDS DOS PROFISSIONAIS
function montarProfissionais(lista) {
  const area = document.getElementById("lista-profissionais");

   area.innerHTML = lista
    .map(p => `
      <div class="prof-card">
        <div class="prof-img-box">
          <img src="${p.imagem}" alt="${p.nome}">
        </div>
        <div class="prof-text">
          <h2>${p.nome}</h2>
          <p>${p.descricao}</p>
          <ul>
            ${p.procedimentos.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    `)
    .join("");
}


// FORMULÁRIO + MODAIS
document.addEventListener("DOMContentLoaded", () => {
  // Seleção dos elementos
  const formulario = document.getElementById("form-duvidas");
  const modalConfirmacao = document.getElementById("modal-confirmacao");
  const modalSucesso = document.getElementById("modal-sucesso");
  const modalCancelado = document.getElementById("modal-cancelado");

  let dadosTemp = {};

  // Função para abrir modal
  function abrirModal(modal) {
    modal.classList.remove("modal-fechar");
    modal.style.display = "flex";
  }

  // Função para fechar modal com animação
  function fecharModal(modal) {
    modal.classList.add("modal-fechar");

    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove("modal-fechar");
    }, 250);
  }

  // Evento de envio do formulário
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    dadosTemp = {
      nome_completo: formulario.nome_completo.value,
      email: formulario.email.value,
      telefone: formulario.telefone.value || "Não informado",
      duvida: formulario.duvida.value,
    };

    // Preenche o modal de confirmação
    document.getElementById("confirma-nome").textContent = dadosTemp.nome_completo;
    document.getElementById("confirma-email").textContent = dadosTemp.email;
    document.getElementById("confirma-telefone").textContent = dadosTemp.telefone;
    document.getElementById("confirma-duvida").textContent = dadosTemp.duvida;

    abrirModal(modalConfirmacao);
  });

  // Confirmar envio
  document.getElementById("btn-confirmar-envio").addEventListener("click", () => {
    emailjs.send("service_02wdi3s", "template_xz72rir", dadosTemp)
      .then(() => {
        fecharModal(modalConfirmacao);
        abrirModal(modalSucesso);
        formulario.reset();
      })
      .catch((err) => {
        console.error("Erro ao enviar email:", err);
        alert("Erro ao enviar formulário. Tente novamente.");
      });
  });

  // Cancelar envio
  document.getElementById("btn-cancelar-envio").addEventListener("click", () => {
    fecharModal(modalConfirmacao);
    abrirModal(modalCancelado);
  });

  // Botões OK dos modais de sucesso e cancelamento
  document.querySelectorAll(".btn-fechar-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      fecharModal(modal);
    });
  });

  // Fechar ao clicar fora da caixa
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) fecharModal(modal);
    });
  });
});


// FUNÇÃO DOS CONTATOS/ENDEREÇO DA CLINICA
function montarContatos(contato) {
 document.getElementById("contato-logo").src = contato.logo;

 document.getElementById("contato-info").innerHTML = `
  <div class="linha">
    <img src="${contato.linha1.icone}" class="icon">
    <span>${contato.linha1.texto}</span>
  </div>

  <div class="linha">
    <img src="${contato.linha2.icone}" class="icon">
    <span>${contato.linha2.texto}</span>
  </div>

  <div class="linha">
    <img src="${contato.linha3.icone}" class="icon">
    <span>${contato.linha3.texto}</span>
  </div>
  `;

  document.getElementById("copy").textContent = contato.copy;
}
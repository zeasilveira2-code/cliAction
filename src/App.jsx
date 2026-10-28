import { useState } from 'react';
import './App.css';

export default function App() {
  // Estado para controlar a navegação entre as telas (Abas)
  const [telaAtiva, setTelaAtiva] = useState('cadastros');

  // Estados que simulam tabelas de um Banco de Dados relacional em memória
  const [clientes, setClientes] = useState([
    {
      id: 1,
      cpf: '12345678900',
      nome: 'Ana Silva',
      email: 'ana@email.com',
      telefone: '11999998888',
      dataNasc: '1995-10-23',
      sexo: 'Feminino',
      mktEmail: true,
      mktWhats: true,
      mktLigacao: false,
      preferencia: 'Produtos'
    },
    {
      id: 2,
      cpf: '98765432100',
      nome: 'Carlos Eduardo',
      email: 'carlos@email.com',
      telefone: '11988887777',
      dataNasc: '1988-10-25',
      sexo: 'Masculino',
      mktEmail: true,
      mktWhats: true,
      mktLigacao: true,
      preferencia: 'Serviços'
    }
  ]);

  const [vendas, setVendas] = useState([
    {
      id: 101,
      idCliente: 1,
      data: '2026-10-20',
      produto: 'Notebook Pro',
      valor: '5200.00',
      formaPagamento: 'Pix',
      funcionario: 'Carlos Vendedor'
    }
  ]);

  const [manifestacoes, setManifestacoes] = useState([
    {
      id: 501,
      idCliente: 1,
      dataRegistro: '2026-10-21',
      dataFinalizacao: '-',
      prazo: '2026-10-28',
      tipo: 'Reclamação',
      meio: 'WhatsApp',
      texto: 'O carregador esquenta muito durante o uso prolongado.',
      classificacao: 'Produto',
      idPedido: 101,
      responsavel: 'Gerente Marcos',
      status: 'Aberto',
      autorizadoRetorno: true
    }
  ]);

  // Estados controlados para os formulários
  const [formCliente, setFormCliente] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    dataNasc: '',
    sexo: 'Masculino',
    mktEmail: false,
    mktWhats: false,
    mktLigacao: false,
    preferencia: 'Produtos'
  });

  const [formVenda, setFormVenda] = useState({
    idCliente: '',
    produto: '',
    valor: '',
    formaPagamento: 'Pix',
    funcionario: '',
    data: ''
  });

  const [formManifestacao, setFormManifestacao] = useState({
    idCliente: '',
    tipo: 'Reclamação',
    meio: 'Telefone',
    texto: '',
    classificacao: 'Comportamental',
    idPedido: '',
    responsavel: '',
    autorizadoRetorno: false,
    termoLgpd: false
  });

  // Funções manipuladoras de cadastro
  const salvarCliente = (e) => {
    e.preventDefault();
    const novo = {
      ...formCliente,
      id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1
    };
    setClientes([...clientes, novo]);
    alert('Cliente cadastrado com sucesso!');
    setFormCliente({
      cpf: '',
      nome: '',
      email: '',
      telefone: '',
      dataNasc: '',
      sexo: 'Masculino',
      mktEmail: false,
      mktWhats: false,
      mktLigacao: false,
      preferencia: 'Produtos'
    });
  };

  const salvarVenda = (e) => {
    e.preventDefault();
    if (!formVenda.idCliente) {
      alert('Selecione um cliente para vincular à venda!');
      return;
    }
    const nova = {
      ...formVenda,
      id: vendas.length > 0 ? Math.max(...vendas.map(v => v.id)) + 1 : 101,
      idCliente: Number(formVenda.idCliente)
    };
    setVendas([...vendas, nova]);
    alert('Venda/Serviço registrado com sucesso!');
    setFormVenda({
      idCliente: '',
      produto: '',
      valor: '',
      formaPagamento: 'Pix',
      funcionario: '',
      data: ''
    });
  };

  const salvarManifestacao = (e) => {
    e.preventDefault();
    if (!formManifestacao.idCliente) {
      alert('Selecione um cliente para vincular à manifestação!');
      return;
    }
    if (!formManifestacao.termoLgpd) {
      alert('É obrigatório obter o consentimento LGPD para registrar a manifestação!');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const dataPrazo = new Date();
    dataPrazo.setDate(dataPrazo.getDate() + 7); // Simulação de 5 dias úteis (7 dias corridos)
    const prazoFormatado = dataPrazo.toISOString().split('T')[0];

    const nova = {
      ...formManifestacao,
      id: manifestacoes.length > 0 ? Math.max(...manifestacoes.map(m => m.id)) + 1 : 501,
      idCliente: Number(formManifestacao.idCliente),
      idPedido: formManifestacao.idPedido ? Number(formManifestacao.idPedido) : null,
      dataRegistro: hoje,
      dataFinalizacao: '-',
      status: 'Aberto',
      prazo: prazoFormatado
    };

    setManifestacoes([...manifestacoes, nova]);
    alert(`Manifestação registrada sob o Protocolo #${nova.id}`);
    setFormManifestacao({
      idCliente: '',
      tipo: 'Reclamação',
      meio: 'Telefone',
      texto: '',
      classificacao: 'Comportamental',
      idPedido: '',
      responsavel: '',
      autorizadoRetorno: false,
      termoLgpd: false
    });
  };

  // Atualizar dinamicamente o estado de uma manifestação
  const gerenciarStatus = (id, novoStatus) => {
    const hoje = novoStatus === 'Finalizado' ? new Date().toISOString().split('T')[0] : '-';
    setManifestacoes(manifestacoes.map(m =>
      m.id === id ? { ...m, status: novoStatus, dataFinalizacao: hoje } : m
    ));
  };

  // Funções auxiliares para o Módulo de Marketing
  const aniversariantesDoMes = clientes.filter(c => {
    if (!c.dataNasc) return false;
    const mesNasc = Number(c.dataNasc.split('-')[1]);
    const mesAtual = new Date().getMonth() + 1;
    return mesNasc === mesAtual && (c.mktEmail || c.mktWhats);
  });

  const clientesPorPreferencia = 
  (tipo) => clientes.filter(c => c.preferencia === tipo &&
     (c.mktEmail || c.mktWhats || c.mktLigacao));

  return (
    <div className="app-container">
      <header>
        <h1>CLI-action</h1>
        <p>Controle Integrado de Atendimento, Ouvidoria e Marketing de Retenção</p>
      </header>

      <nav>
        <button
          className={telaAtiva === 'cadastros' ? 'active' : ''}
          onClick={() => setTelaAtiva('cadastros')}
        >
          📝 Entrada & Formulários
        </button>
        <button
          className={telaAtiva === 'marketing' ? 'active' : ''}
          onClick={() => setTelaAtiva('marketing')}
        >
          🎯 Automação Marketing
        </button>
        <button
          className={telaAtiva === 'relatorios' ? 'active' : ''}
          onClick={() => setTelaAtiva('relatorios')}
        >
          📊 Relatório Ouvidoria
        </button>
      </nav>

      {/* ========================================================
          TELA 1: ENTRADA DE DADOS E FORMULÁRIOS
         ======================================================== */}
      {telaAtiva === 'cadastros' && (
        <div className="grid-container">
          {/* Card: Cadastro do Cliente */}
          <div className="view-card">
            <h2>Cadastro do Cliente</h2>
            <form onSubmit={salvarCliente} className="form-grid">
              <div className="form-group">
                <label>CPF (Chave Única)</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={formCliente.cpf}
                  onChange={e => setFormCliente({ ...formCliente, cpf: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={formCliente.nome}
                  onChange={e => setFormCliente({ ...formCliente, nome: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="cliente@email.com"
                  value={formCliente.email}
                  onChange={e => setFormCliente({ ...formCliente, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Telefone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  value={formCliente.telefone}
                  onChange={e => setFormCliente({ ...formCliente, telefone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={formCliente.dataNasc}
                  onChange={e => setFormCliente({ ...formCliente, dataNasc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sexo</label>
                <select
                  value={formCliente.sexo}
                  onChange={e => setFormCliente({ ...formCliente, sexo: e.target.value })}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Não Informar">Não Informar</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Preferência de Compra (Foco Marketing)</label>
                <select
                  value={formCliente.preferencia}
                  onChange={e => setFormCliente({ ...formCliente, preferencia: e.target.value })}
                >
                  <option value="Produtos">Produtos</option>
                  <option value="Serviços">Serviços</option>
                </select>
              </div>

              <div className="marketing-section full-width">
                <label className="section-title">Autorizações de Comunicação (LGPD / MKT):</label>
                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formCliente.mktEmail}
                      onChange={e => setFormCliente({ ...formCliente, mktEmail: e.target.checked })}
                    />
                    E-mail
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formCliente.mktWhats}
                      onChange={e => setFormCliente({ ...formCliente, mktWhats: e.target.checked })}
                    />
                    WhatsApp
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formCliente.mktLigacao}
                      onChange={e => setFormCliente({ ...formCliente, mktLigacao: e.target.checked })}
                    />
                    Ligações
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-submit full-width">Salvar Cadastro Cliente</button>
            </form>

            {/* Painel Interno de Histórico */}
            <div className="historico-container">
              <strong>🔎 Acesso Interno a Histórico por Cliente:</strong>
              {clientes.map(cli => {
                const compras = vendas.filter(v => v.idCliente === cli.id);
                return (
                  <div key={cli.id} className="historico-item">
                    <span>👤 <strong>{cli.nome}</strong> (ID #{cli.id}):</span>
                    {compras.length > 0 ? (
                      <ul>
                        {compras.map(v => (
                          <li key={v.id}>
                            Venda #{v.id}: {v.produto} — <strong>R$ {parseFloat(v.valor).toFixed(2)}</strong> ({v.formaPagamento})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted"> Nenhuma compra registrada até o momento.</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Formulário Serviço / Venda */}
          <div className="view-card">
            <h2>Formulário Serviço / Venda</h2>
            <form onSubmit={salvarVenda} className="form-grid">
              <div className="form-group full-width">
                <label>Vincular Cliente</label>
                <select
                  required
                  value={formVenda.idCliente}
                  onChange={e => setFormVenda({ ...formVenda, idCliente: e.target.value })}
                >
                  <option value="">-- Escolha o Cliente --</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} (CPF: {c.cpf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Descrição do Produto / Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultoria, Smartphone, Manutenção..."
                  value={formVenda.produto}
                  onChange={e => setFormVenda({ ...formVenda, produto: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formVenda.valor}
                  onChange={e => setFormVenda({ ...formVenda, valor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Forma de Pagamento</label>
                <select
                  value={formVenda.formaPagamento}
                  onChange={e => setFormVenda({ ...formVenda, formaPagamento: e.target.value })}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Funcionário Executor</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do vendedor/técnico"
                  value={formVenda.funcionario}
                  onChange={e => setFormVenda({ ...formVenda, funcionario: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Data da Transação</label>
                <input
                  type="date"
                  required
                  value={formVenda.data}
                  onChange={e => setFormVenda({ ...formVenda, data: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-submit full-width">Registrar Serviço / Venda</button>
            </form>
          </div>

          {/* Card: Formulário Único de Manifestação (SAC / Ouvidoria) */}
          <div className="view-card full-width">
            <h2>Formulário Único de Manifestação (SAC / Ouvidoria)</h2>
            <form onSubmit={salvarManifestacao} className="form-grid">
              <div className="form-group">
                <label>Cliente</label>
                <select
                  required
                  value={formManifestacao.idCliente}
                  onChange={e => setFormManifestacao({ ...formManifestacao, idCliente: e.target.value, idPedido: '' })}
                >
                  <option value="">-- Selecione o Cliente --</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      ID #{c.id} - {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Manifestação</label>
                <select
                  value={formManifestacao.tipo}
                  onChange={e => setFormManifestacao({ ...formManifestacao, tipo: e.target.value })}
                >
                  <option value="Reclamação">Reclamação</option>
                  <option value="Elogio">Elogio</option>
                  <option value="Sugestão">Sugestão</option>
                </select>
              </div>

              <div className="form-group">
                <label>Meio Utilizado</label>
                <select
                  value={formManifestacao.meio}
                  onChange={e => setFormManifestacao({ ...formManifestacao, meio: e.target.value })}
                >
                  <option value="Telefone">Telefone</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Redes Sociais">Redes Sociais</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div className="form-group">
                <label>Classificação</label>
                <select
                  value={formManifestacao.classificacao}
                  onChange={e => setFormManifestacao({ ...formManifestacao, classificacao: e.target.value })}
                >
                  <option value="Comportamental">Comportamental</option>
                  <option value="Sistêmico">Sistêmico</option>
                  <option value="Estrutural">Estrutural</option>
                  <option value="Produto">Produto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vincular ID do Pedido / Venda (Opcional)</label>
                <select
                  value={formManifestacao.idPedido}
                  onChange={e => setFormManifestacao({ ...formManifestacao, idPedido: e.target.value })}
                >
                  <option value="">-- Nenhum --</option>
                  {vendas
                    .filter(v => v.idCliente === Number(formManifestacao.idCliente))
                    .map(v => (
                      <option key={v.id} value={v.id}>
                        Venda #{v.id} - {v.produto} (R$ {v.valor})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Gerente Responsável</label>
                <input
                  type="text"
                  required
                  placeholder="Gerente que fará o acompanhamento"
                  value={formManifestacao.responsavel}
                  onChange={e => setFormManifestacao({ ...formManifestacao, responsavel: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Texto da Manifestação</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Relato detalhado da manifestação do cliente..."
                  value={formManifestacao.texto}
                  onChange={e => setFormManifestacao({ ...formManifestacao, texto: e.target.value })}
                />
              </div>

              <div className="lgpd-section full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formManifestacao.autorizadoRetorno}
                    onChange={e => setFormManifestacao({ ...formManifestacao, autorizadoRetorno: e.target.checked })}
                  />
                  Autorizar recebimento de retorno (E-mail, Telefone ou WhatsApp)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formManifestacao.termoLgpd}
                    onChange={e => setFormManifestacao({ ...formManifestacao, termoLgpd: e.target.checked })}
                  />
                  <strong>LGPD:</strong> Consentimento do cliente para uso exclusivo dos dados para tratar esta manifestação.
                </label>
              </div>

              <button type="submit" className="btn-submit full-width">
                Registrar Ocorrência (Prazo Padrão: 5 Dias Úteis)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TELA 2: AUTOMAÇÃO DE MARKETING
         ======================================================== */}
      {telaAtiva === 'marketing' && (
        <div className="view-card">
          <h2>🎯 Módulo CLI-action Marketing (Retenção)</h2>
          <p className="subtitle">Simulador de gatilhos automáticos com base no perfil e consentimento LGPD dos clientes:</p>

          <div className="marketing-cards-grid">
            {/* Gatilho 1: Aniversários */}
            <div className="marketing-box green">
              <div className="marketing-box-header">
                <h3>🎂 Aniversários do Mês</h3>
                <span className="badge">{aniversariantesDoMes.length} elegíveis</span>
              </div>
              <p>Dispara saudações personalizadas e cupons para clientes aniversariantes que autorizaram contato.</p>

              <div className="audience-list">
                <strong>Público-alvo identificado:</strong>
                {aniversariantesDoMes.length > 0 ? (
                  <ul>
                    {aniversariantesDoMes.map(c => (
                      <li key={c.id}>
                        {c.nome} ({c.dataNasc}) — Canais: {[c.mktEmail && 'E-mail', c.mktWhats && 'WhatsApp'].filter(Boolean).join(', ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Nenhum aniversariante elegível com autorização neste mês.</p>
                )}
              </div>

              <button
                className="btn-action btn-green"
                onClick={() => alert(`🎉 Campanha de Aniversário disparada com sucesso para ${aniversariantesDoMes.length} clientes!`)}
              >
                Disparar Parabenização
              </button>
            </div>

            {/* Gatilho 2: Ofertas Direcionadas */}
            <div className="marketing-box blue">
              <div className="marketing-box-header">
                <h3>🚀 Ofertas Direcionadas por Segmento</h3>
                <span className="badge">
                  {clientesPorPreferencia('Produtos').length} Produtos | {clientesPorPreferencia('Serviços').length} Serviços
                </span>
              </div>
              <p>Filtra a base de dados por interesse de compra e dispara campanhas sob medida para canais autorizados.</p>

              <div className="audience-list">
                <strong>Segmentação atual:</strong>
                <p>📦 <strong>Foco em Produtos:</strong> {clientesPorPreferencia('Produtos').map(c => c.nome).join(', ') || 'Nenhum'}</p>
                <p>🛠️ <strong>Foco em Serviços:</strong> {clientesPorPreferencia('Serviços').map(c => c.nome).join(', ') || 'Nenhum'}</p>
              </div>

              <div className="button-group">
                <button
                  className="btn-action btn-blue"
                  onClick={() => alert(`Campanha de PRODUTOS enviada para ${clientesPorPreferencia('Produtos').length} clientes!`)}
                >
                  Disparar Campanha de Produtos
                </button>
                <button
                  className="btn-action btn-indigo"
                  onClick={() => alert(`Campanha de SERVIÇOS enviada para ${clientesPorPreferencia('Serviços').length} clientes!`)}
                >
                  Disparar Campanha de Serviços
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TELA 3: RELATÓRIOS SINTETIZADOS
         ======================================================== */}
      {telaAtiva === 'relatorios' && (
        <div className="view-card">
          <div className="report-header">
            <div>
              <h2>📊 Relatório Sintetizado de Ouvidoria</h2>
              <p className="subtitle">Visão consolidada com regra de atribuição de responsabilidade por classificação</p>
            </div>
            <div className="metrics-summary">
              <span className="metric-pill">Total: {manifestacoes.length}</span>
              <span className="metric-pill warn">Abertas: {manifestacoes.filter(m => m.status === 'Aberto').length}</span>
              <span className="metric-pill ok">Finalizadas: {manifestacoes.filter(m => m.status === 'Finalizado').length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente (Contato)</th>
                  <th>Tipo / Canal</th>
                  <th>Classificação</th>
                  <th>Texto da Manifestação</th>
                  <th>Funcionário Envolvido</th>
                  <th>Abertura / Prazo / Fim</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {manifestacoes.map(m => {
                  const cli = clientes.find(c => c.id === m.idCliente) || {};
                  const vda = vendas.find(v => v.id === m.idPedido) || {};

                  // Regra de Negócio:
                  // Se for Comportamental, exibe o funcionário vendedor/executor da venda.
                  // Se for outro tipo, exibe o Gerente responsável pelo tratamento do caso.
                  const funcionarioExibido =
                    m.classificacao === 'Comportamental'
                      ? `${vda.funcionario || 'Não Vinculado'} (Vendedor)`
                      : `${m.responsavel || 'Não Definido'} (Gerente)`;

                  return (
                    <tr key={m.id} className={m.status === 'Finalizado' ? 'row-finalizado' : ''}>
                      <td><strong>#{m.id}</strong></td>
                      <td>
                        <strong>{cli.nome || 'Cliente Desconhecido'}</strong>
                        <div className="sub-text">{cli.email}</div>
                        <div className="sub-text">{cli.telefone}</div>
                      </td>
                      <td>
                        <span className={`badge-type ${m.tipo.toLowerCase()}`}>{m.tipo}</span>
                        <div className="sub-text">Via {m.meio}</div>
                      </td>
                      <td>
                        <span className="badge-class">{m.classificacao}</span>
                      </td>
                      <td className="texto-manifestacao">"{m.texto}"</td>
                      <td>
                        <span className="tag-responsavel">{funcionarioExibido}</span>
                      </td>
                      <td>
                        <div className="sub-text"><strong>Criado:</strong> {m.dataRegistro}</div>
                        <div className="sub-text"><strong>Prazo:</strong> {m.prazo}</div>
                        <div className="sub-text"><strong>Fim:</strong> {m.dataFinalizacao}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${m.status.toLowerCase().replace(' ', '-')}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {m.status !== 'Finalizado' ? (
                          <div className="action-buttons">
                            {m.status === 'Aberto' && (
                              <button
                                className="btn-table btn-warn"
                                onClick={() => gerenciarStatus(m.id, 'Em Análise')}
                              >
                                Em Análise
                              </button>
                            )}
                            <button
                              className="btn-table btn-success"
                              onClick={() => gerenciarStatus(m.id, 'Finalizado')}
                            >
                              Finalizar
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">Concluído</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}